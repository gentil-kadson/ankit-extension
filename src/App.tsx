import { useEffect } from "react";
import MainPage from "./components/MainPage";
import FormPage from "./components/FormPage";
import { useContext } from "react";
import FlashcardsContext from "./context/FlashcardsContext";

function App() {
  const { flashcards, addFlashcards } = useContext(FlashcardsContext);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "REQUEST_FLASHCARDS_FROM_BACKGROUND" },
      (response) => {
        if (response && response.flashcards) addFlashcards(response.flashcards);
      }
    );
  }, []);

  return <>{flashcards.length === 0 ? <MainPage /> : <FormPage />}</>;
}

export default App;
