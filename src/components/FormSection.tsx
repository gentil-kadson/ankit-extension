import { useContext, useRef, useState } from "react";
import Button from "./Button";
import FlashcardsContext from "../context/FlashcardsContext";
import AnkiConnectService from "../classes/AnkiConnectService";
import { waitThenRemoveMessage } from "../utils/functions";

type FormSection = {
  decks: string[];
  onAdditionCancelation: () => void;
};

type Message = {
  type: "success" | "error";
  content: string;
  show: boolean;
};

export default function FormSection({
  decks,
  onAdditionCancelation,
}: FormSection) {
  const { flashcards } = useContext(FlashcardsContext);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    type: "success",
    show: false,
    content: "",
  });
  const ankiConnectService = new AnkiConnectService();

  const handleCardsSubmit = async () => {
    setMessage((prevMessage) => ({ ...prevMessage, show: false }));
    setIsLoading(true);

    try {
      await ankiConnectService.addCardsToAnki(flashcards);
      setMessage((prevState) => ({
        ...prevState,
        type: "success",
        show: true,
        content: "Cartões adicionados. Já pode começar a estudar :)",
      }));
      waitThenRemoveMessage(() =>
        setMessage((prevMessage) => ({ ...prevMessage, show: false }))
      );
      setIsLoading(false);
    } catch (error: any) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        type: "error",
        show: true,
        content: error.message,
      }));

      waitThenRemoveMessage(() =>
        setMessage((prevMessage) => ({ ...prevMessage, show: false }))
      );
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {message.show && (
        <p
          className={`${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          } font-bold text-white self-center w-full text-center rounded-sm p-2`}
        >
          {message.content}
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
