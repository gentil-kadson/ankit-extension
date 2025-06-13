import PlayingCards from "/public/playing_cards.svg";
import AnkitIcon from "/public/ankit_icon.svg";

export default function MainPage() {
  return (
    <main className="text-stone-400">
      <div className="flex items-center justify-center gap-1">
        <img
          className="w-[35px] h-[35px]"
          src={AnkitIcon}
          alt="Caixa de pacotes selada e contornada de cinza."
        />
        <h1 className="font-bold">Ankit</h1>
      </div>
      <p>
        Clique em{" "}
        <img
          className="w-[30px] h-[30px] inline"
          src={PlayingCards}
          alt="Cartões de baralho contornados de branco"
        />{" "}
        em uma sessão de estudos finalizada para adicionar seus cartões no Anki!
      </p>
    </main>
  );
}
