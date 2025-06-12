import { useContext, useRef, useState } from "react";
import Button from "./Button";
import FlashcardsContext from "../context/FlashcardsContext";
import { addFlashcardsAudio } from "../utils/functions";

type FormSection = {
  decks: string[];
  onAdditionCancelation: () => void;
};

export default function FormSection({
  decks,
  onAdditionCancelation,
}: FormSection) {
  const { flashcards } = useContext(FlashcardsContext);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardsSubmit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const flashcardsPayload = await addFlashcardsAudio(flashcards);
      for (const flashcardPayload of flashcardsPayload) {
        await fetch("http://localhost:8765", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flashcardPayload),
        }).catch((_error) => setError("Conexão com o Anki perdida"));
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {error && (
        <p className="bg-red-600 font-bold text-white self-center w-full text-center rounded-sm p-2">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[1.25rem]" htmlFor="decks">
          Escolha um Baralho
        </label>
        <select
          name="decks"
          id="decks"
          ref={selectRef}
          className="py-2 px-3 bg-stone-700 rounded-md"
          disabled={isLoading}
        >
          {decks.map((deckName, index) => (
            <option key={`${deckName}-${index}`} value={deckName}>
              {deckName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-start items-center gap-3">
        <Button onClick={handleCardsSubmit} disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar"}
        </Button>
        <Button
          disabled={isLoading}
          styleType="danger"
          onClick={onAdditionCancelation}
        >
          Voltar
        </Button>
      </div>
    </section>
  );
}
