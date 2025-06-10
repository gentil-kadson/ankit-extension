import { createContext, useState, type ReactNode } from "react";
import { type Flashcard } from "../types";

type FlashcardsContextType = {
  flashcards: Flashcard[];
  resetFlashcards: () => void;
  addFlashcards: (flashcardsToAdd: Flashcard[]) => void;
};

const FlashcardsContext = createContext<FlashcardsContextType>({
  flashcards: [],
  resetFlashcards: () => {},
  addFlashcards: ([]) => {},
});

export const FlashcardsProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const addFlashcards = (flashcardsToAdd: Flashcard[]) => {
    setFlashcards((prevFlashcards) => [...prevFlashcards, ...flashcardsToAdd]);
  };

  const resetFlashcards = () => {
    setFlashcards([]);
  };

  return (
    <FlashcardsContext.Provider
      value={{ flashcards, addFlashcards, resetFlashcards }}
    >
      {children}
    </FlashcardsContext.Provider>
  );
};

export default FlashcardsContext;
