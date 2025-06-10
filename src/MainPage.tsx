import { useEffect, useState } from "react";
import PlayingCards from "/public/playing_cards.svg";
import type { Flashcard } from "./types";

export default function MainPage() {
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

  return (
    <main className="text-stone-400 border-none">
      <h1 className="font-bold">Ankit</h1>
      <p className="text-[1.2rem]">
        Termine uma sessão de estudos ou clique em{" "}
        <img
          className="w-[30px] h-[30px] inline"
          src={PlayingCards}
          alt="Cartões de baralho contornados de branco"
        />{" "}
        para adicionar seus cartões no Anki!
      </p>
    </main>
  );
}
