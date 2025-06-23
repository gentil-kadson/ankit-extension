// import openAi from "../apis/openAi";
import type { Flashcard, FlashcardPayload } from "../types";

export default class AnkiConnectService {
  private ankiConnectBaseUrl: string = "http://localhost:8765";
  private ankitTextToSpeechBaseUrl: string = import.meta.env
    .VITE_ANKIT_TEXT_TO_SPEECH_API_BASE_URL;
  private baseFetchData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  private deckName: string = "";

  setDeckName(deckName: string) {
    this.deckName = deckName;
  }

  async arrayBufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(new Blob([arrayBuffer]));
    });
  }

  getDeckNames() {
    const fetchDecksPayload = {
      action: "deckNames",
      version: 6,
    };

    return fetch(this.ankiConnectBaseUrl, {
      ...this.baseFetchData,
      body: JSON.stringify(fetchDecksPayload),
    });
  }

  generateFlashcardWithAudioPayload(
    front: string,
    back: string,
    base64Audio: string
  ): FlashcardPayload {
    return {
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName: this.deckName,
          modelName: "Basic-e3b45",
          fields: {
            Front: front + "<br>",
            Back: back,
          },
          audio: [
            {
              filename: `${front}.mp3`,
              data: base64Audio,
              fields: ["Front"],
            },
          ],
        },
      },
    };
  }

  async getCompleteFlashcardPayload(front: string, back: string) {
    const audiodataResponse = await fetch(
      `${this.ankitTextToSpeechBaseUrl}/speech`,
      {
        method: this.baseFetchData.method,
        headers: {
          "Content-Type": this.baseFetchData.headers["Content-Type"],
          "x-extension-secret": import.meta.env.VITE_EXTENSION_SECRET,
        },
        body: JSON.stringify({ input: front }),
      }
    );

    if (audiodataResponse.status === 500) {
      throw Error(
        "Não foi possível gerar os áudios para os cartões. Tente novamente mais tarde."
      );
    }
    if (audiodataResponse.status === 403) {
      throw Error(
        "Sua extensão não tem permissão para gerar os áudios. Reinstale-a, por favor."
      );
    }

    const arrayBuffer = await audiodataResponse.arrayBuffer();
    const base64Audio = await this.arrayBufferToBase64(arrayBuffer);

    const flashcardPayload: FlashcardPayload =
      this.generateFlashcardWithAudioPayload(front, back, base64Audio);

    return flashcardPayload;
  }

  async getFlashcardsWithAudioPayloads(flashcards: Flashcard[]) {
    const flashcardsAudioPromises: Promise<FlashcardPayload>[] = [];

    for (const flashcard of flashcards) {
      flashcardsAudioPromises.push(
        this.getCompleteFlashcardPayload(flashcard.front, flashcard.back)
      );
    }

    const flashcardsPayload = await Promise.all(flashcardsAudioPromises);
    return flashcardsPayload;
  }

  async addCardsToAnki(flashcards: Flashcard[]) {
    const addCardsToAnkiPromises: Promise<Response>[] = [];
    const flashcardsPayload = await this.getFlashcardsWithAudioPayloads(
      flashcards
    );

    for (const flashcardPayload of flashcardsPayload) {
      addCardsToAnkiPromises.push(
        fetch("http://localhost:8765", {
          ...this.baseFetchData,
          body: JSON.stringify(flashcardPayload),
        })
      );
    }

    try {
      await Promise.all(addCardsToAnkiPromises);
    } catch (error) {
      throw Error("Conexão com o Anki perdida");
    }
  }
}
