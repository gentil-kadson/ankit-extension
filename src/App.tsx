import type { Flashcard } from "./types";
import { useEffect, useState } from "react";
import MainPage from "./components/MainPage";
import FormPage from "./components/FormPage";

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "REQUEST_FLASHCARDS_FROM_BACKGROUND" },
      (response) => {
        if (response && response.flashcards) setFlashcards(response.flashcards);
      }
    );
  }, []);

  useEffect(() => {
    console.log(flashcards);
  }, [flashcards]);

  return <>{flashcards.length === 0 ? <MainPage /> : <FormPage />}</>;
}

export default App;
