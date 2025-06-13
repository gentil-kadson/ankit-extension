import type { Flashcard } from "../types";
import openAi from "../apis/openAi";

export const arrayBufferToBase64 = async (
  arrayBuffer: ArrayBuffer
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(new Blob([arrayBuffer]));
  });
};

export const addFlashcardsAudio = async (flashcards: Flashcard[]) => {
  const flashcardsAudioPromises: Promise<void>[] = [];
  const flashcardsWithAudio: any[] = [];

  try {
    for (const flashcard of flashcards) {
      console.log("globbit");
      const createFlashcardAudio = async () => {
        const audiodata = await openAi.audio.speech.create({
          input: flashcard.front,
          model: "gpt-4o-mini-tts",
          voice: "alloy",
        });
        const arrayBuffer = await audiodata.arrayBuffer();
        const base64Audio = await arrayBufferToBase64(arrayBuffer);
        const flashcardPayload = {
          action: "addNote",
          version: 6,
          params: {
            note: {
              deckName: "Teste Ankit",
              modelName: "Basic-e3b45",
              fields: {
                Front: flashcard.front + "\n",
                Back: flashcard.back,
              },
              audio: [
                {
                  filename: `${flashcard.front}.mp3`,
                  data: base64Audio,
                  fields: ["Front"],
                },
              ],
            },
          },
        };
        flashcardsWithAudio.push(flashcardPayload);
      };
      flashcardsAudioPromises.push(createFlashcardAudio());
    }

    await Promise.all(flashcardsAudioPromises);
    return flashcardsWithAudio;
  } catch (error) {
    throw new Error(
      "Não foi possível gerar o áudio dos cards. Tente novamente mais tarde"
    );
  }
};
