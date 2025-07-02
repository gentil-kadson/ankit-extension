import type { Flashcard, FlashcardPayload } from "../types";
import AnkitTextToSpeechService from "./AnkitTextToSpeechService";

export default class AnkiConnectService {
  private ankiConnectBaseUrl: string = "http://localhost:8765";
  private baseFetchData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  private deckName: string = "";
  private ankitTextToSpeechService = new AnkitTextToSpeechService();

  setDeckName(deckName: string) {
    this.deckName = deckName;
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
          modelName: "Basic",
          fields: {
            Frente: front + "<br><br>",
            Verso: back,
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
      const flashcardsPayload = await this.getFlashcardsPayloads(flashcards);

      for (const flashcardPayload of flashcardsPayload) {
        addCardsToAnkiPromises.push(
          fetch(this.ankiConnectBaseUrl, {
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
