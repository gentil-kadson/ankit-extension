export type Flashcard = {
  front: string;
  back: string;
};

export type FlashcardAudioPayload = {
  filename: string;
  data: string;
  fields: ["Front"];
};

export type FlashcardPayload = {
  action: "addNote";
  version: 6;
  params: {
    note: {
      deckName: string;
      modelName: "Basic-e3b45";
      fields: {
        Front: string;
        Back: string;
      };
      audio: FlashcardAudioPayload[];
    };
  };
};
