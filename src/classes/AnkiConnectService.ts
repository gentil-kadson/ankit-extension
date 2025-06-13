import openAi from "../apis/openAi";
import type { Flashcard, FlashcardPayload } from "../types";

export default class AnkiConnectService {
  private baseUrl: string = "http://localhost:8765";
  private baseFetchData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  private speechGenerationParams = {
    model: "gpt-4o-mini-tts",
    voice: "alloy",
  };

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

    return fetch(this.baseUrl, {
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
          deckName: "Teste Ankit",
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
    const audiodata = await openAi.audio.speech.create({
      ...this.speechGenerationParams,
      input: front,
    });
    const arrayBuffer = await audiodata.arrayBuffer();
    const base64Audio = await this.arrayBufferToBase64(arrayBuffer);

    const flashcardPayload: FlashcardPayload =
      this.generateFlashcardWithAudioPayload(front, back, base64Audio);

    return flashcardPayload;
  }

  async getFlashcardsWithAudioPayloads(flashcards: Flashcard[]) {
    const flashcardsAudioPromises: Promise<FlashcardPayload>[] = [];

    try {
      for (const flashcard of flashcards) {
        flashcardsAudioPromises.push(
          this.getCompleteFlashcardPayload(flashcard.front, flashcard.back)
        );
      }

      const flashcardsPayload = await Promise.all(flashcardsAudioPromises);
      return flashcardsPayload;
    } catch (error) {
      throw new Error(
        "Não foi possível gerar o áudio dos cards. Tente novamente mais tarde"
      );
    }
  }
}
