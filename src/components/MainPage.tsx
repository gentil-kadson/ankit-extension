import PlayingCards from "/public/playing_cards.svg";

export default function MainPage() {
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
