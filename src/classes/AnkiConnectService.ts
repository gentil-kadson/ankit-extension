import type {
  Flashcard,
  FlashcardPayload,
  ModelRelatedResponse,
} from "../types";
import AnkitTextToSpeechService from "./AnkitTextToSpeechService";

export default class AnkiConnectService {
  private baseUrl: string = "http://localhost:8765";
  private baseFetchData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  private deckName: string = "";
  private ankitTextToSpeechService = new AnkitTextToSpeechService();
  private modelName: string = "";
  private modelFields: string[] = [];

  setDeckName(deckName: string) {
    this.deckName = deckName;
  }

  getDeckNames() {
    const fetchDecksPayload = {
      action: "deckNames",
      version: 6,
    };

    return fetch(this.baseUrl, {
      ...this.baseFetchData,
      body: JSON.stringify(fetchDecksPayload),
    });
  }

  async getBasicModelFields(modelName: string) {
    const payload = {
      action: "modelFieldNames",
      version: 6,
      params: {
        modelName: modelName,
      },
    };

    const response = await fetch(this.baseUrl, {
      ...this.baseFetchData,
      body: JSON.stringify(payload),
    }).catch((_error) => {
      throw Error("Conexão com o Anki perdida.");
    });

    const modelFields: ModelRelatedResponse = await response.json();
    if (!modelFields.result || modelFields.result.length !== 2) {
      throw Error(
        "Modelo de cartão inválido. Certifique-se de ter o modelo de cartão básico no seu Anki"
      );
    }
    this.modelName = modelName;
    this.modelFields = modelFields.result;
  }

  async fillModelData() {
    const response = await fetch(this.baseUrl, {
      ...this.baseFetchData,
      body: JSON.stringify({ action: "modelNames", version: 6 }),
    }).catch((_error) => {
      throw Error("Conexão com o Anki perdida");
    });

    const noteModels: ModelRelatedResponse = await response.json();
    if (!noteModels.result) {
      throw Error("Parece que não há modelos de cartões no seu Anki");
    }
    await this.getBasicModelFields(noteModels.result[0]);
  }

  async generateFlashcardPayload(front: string, back: string) {
    const base64Audio = await this.ankitTextToSpeechService.generateBase64Audio(
      front
    );
    const flashcardPayload: FlashcardPayload = {
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName: this.deckName,
          modelName: this.modelName,
          fields: {
            [this.modelFields[0]]: front + "<br><br>",
            [this.modelFields[1]]: back,
          },
          audio: [
            {
              filename: `${front}.mp3`,
              data: base64Audio,
              fields: [this.modelFields[0]],
            },
          ],
        },
      },
    };
    return flashcardPayload;
  }

  async getFlashcardsPayloads(flashcards: Flashcard[]) {
    const flashcardsAudioPromises: Promise<FlashcardPayload>[] = [];

    for (const flashcard of flashcards) {
      flashcardsAudioPromises.push(
        this.generateFlashcardPayload(flashcard.front, flashcard.back)
      );
    }

    const flashcardsPayload = await Promise.all(flashcardsAudioPromises);
    return flashcardsPayload;
  }

  async addCardsToAnki(flashcards: Flashcard[]) {
    try {
      const addCardsToAnkiPromises: Promise<Response>[] = [];
      await this.fillModelData();
      const flashcardsPayload = await this.getFlashcardsPayloads(flashcards);

      for (const flashcardPayload of flashcardsPayload) {
        addCardsToAnkiPromises.push(
          fetch(this.baseUrl, {
            ...this.baseFetchData,
            body: JSON.stringify(flashcardPayload),
          })
        );
      }

      await Promise.all(addCardsToAnkiPromises);
    } catch (error: any) {
      throw Error(error.message);
    }
  }
}
