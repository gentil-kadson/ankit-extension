import Button from "./Button";

type FormSection = {
  decks: string[];
  onAdditionCancelation: () => void;
};

export default function FormSection({
  decks,
  onAdditionCancelation,
}: FormSection) {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[1.25rem]" htmlFor="decks">
          Escolha um Baralho
        </label>
        <select
          name="decks"
          id="decks"
          className="py-2 px-3 bg-stone-700 rounded-md"
        >
          {decks.map((deckName, index) => (
            <option key={`${deckName}-${index}`} value={deckName}>
              {deckName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-start items-center gap-3">
        <Button>Adicionar</Button>
        <Button styleType="danger" onClick={onAdditionCancelation}>
          Cancelar
        </Button>
      </div>
    </section>
  );
}
