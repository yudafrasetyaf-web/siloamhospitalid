const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphabetNav({ onSelect }: { onSelect: (letter: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {alphabet.map((letter) => (
        <button
          key={letter}
          onClick={() => onSelect(letter)}
          className="w-8 h-8 flex items-center justify-center rounded-full border bg-white text-blue-700 border-blue-300 font-bold hover:bg-blue-600 hover:text-white transition-colors"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
