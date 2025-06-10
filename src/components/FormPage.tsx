import { useState } from "react";
import signalDisconnectedIcon from "/public/signal_disconnected.svg";

export default function FormPage() {
  const [connectionStatus, _setConnectionStatus] = useState<
    "loading" | "error" | "success"
  >("error");

  // useEffect(() => {
  //   fetch("http://localhost:8765").catch((_error) =>
  //     setConnectionStatus("error")
  //   );
  // }, [connectionStatus]);

  return (
    <main className="border-white h-screen justify-center items-center gap-3">
      {connectionStatus !== "success" && (
        <>
          {connectionStatus === "error" ? (
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
                <button className="rounded-md py-2 px-3 flex justify-center items-center bg-blue-700 hover:bg-blue-800 cursor-pointer">
                  Tentar novamente
                </button>
              </div>
            </>
          ) : (
            <h2 className="font-bold">Carregando...</h2>
          )}
        </>
      )}
      {connectionStatus === "success" && <h1>FORMULÁRIO AQUI!!!</h1>}
    </main>
  );
}
