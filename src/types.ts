export type Flashcard = {
  front: string;
  back: string;
};

export type FlashcardAudioPayload = {
  filename: string;
  data: string;
  fields: string[];
};

export type FlashcardPayload = {
  action: "addNote";
  version: 6;
  params: {
    note: {
      deckName: string;
      modelName: string;
      fields: {
        [key: string]: string;
      };
      audio: FlashcardAudioPayload[];
    };
  };
};

export type BasicModelRelatedResponse = {
  result: string[] | null;
  error: string | null;
};
