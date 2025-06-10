import { useEffect, useState } from "react";

export default function FormPage() {
  const [connectionStatus, setConnectionStatus] = useState<
    "loading" | "error" | "success"
  >("loading");

  useEffect(() => {
    fetch("http://localhost:8765").catch((_error) =>
      setConnectionStatus("error")
    );
  }, [connectionStatus]);

  return (
    <main className="border-white">
      {connectionStatus === "loading" && <h1>Carregando</h1>}
      {connectionStatus === "error" && <h1>ERRO!!!!!</h1>}
      {connectionStatus === "success" && <h1>FORMULÁRIO AQUI!!!</h1>}
    </main>
  );
}
