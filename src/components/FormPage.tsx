import { useContext, useEffect, useState } from "react";
import signalDisconnectedIcon from "/public/signal_disconnected.svg";
import Button from "./Button";
import FormSection from "./FormSection";
import FlashcardsContext from "../context/FlashcardsContext";

type ConnectionStatus = {
  status: "loading" | "error" | "success";
  decks: string[];
};

export default function FormPage() {
  const { resetFlashcards } = useContext(FlashcardsContext);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: "loading",
    decks: [],
  });

  const handleCancelAdditionToDeck = () => {
    setConnectionStatus({ decks: [], status: "loading" });
    resetFlashcards();
  };

  const handleGetDeckNames = () => {
    setConnectionStatus((prevStatus) => ({ ...prevStatus, status: "loading" }));

    const fetchDecksPayload = {
      action: "deckNames",
      version: 6,
    };

    fetch("http://localhost:8765", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchDecksPayload),
    })
      .then((response) => response.json())
      .then((json) => {
        setConnectionStatus((prevStatus) => ({
          ...prevStatus,
          status: "success",
          decks: json.result,
        }));
      })
      .catch((_error) =>
        setConnectionStatus((prevStatus) => ({
          ...prevStatus,
          status: "error",
        }))
      );
  };

  useEffect(() => {
    handleGetDeckNames();
  }, []);

  return (
    <main className="border-white h-screen justify-center items-center gap-3">
      {connectionStatus.status !== "success" && (
        <>
          {connectionStatus.status === "error" ? (
            <>
              <div className="flex flex-col items-center">
                <img
                  className="width-[30px] height-[30px]"
                  src={signalDisconnectedIcon}
                  alt="Sinal de rede com barra inclinada no meio, indicando falha na conexão"
                />
                <h2 className="font-bold">Não foi possível conectar</h2>
              </div>
              <div className="flex flex-col items-center gap-4">
                <p>
                  Verifique se o add-on "AnkiConnect" foi adicionado ao seu Anki
                  ou se o Anki está aberto.
                </p>
                <Button onClick={handleGetDeckNames}>Tentar novamente</Button>
              </div>
            </>
          ) : (
            <h2 className="font-bold text-stone-400">Carregando...</h2>
          )}
        </>
      )}
      {connectionStatus.status === "success" && (
        <FormSection
          onAdditionCancelation={handleCancelAdditionToDeck}
          decks={connectionStatus.decks}
        />
      )}
    </main>
  );
}
