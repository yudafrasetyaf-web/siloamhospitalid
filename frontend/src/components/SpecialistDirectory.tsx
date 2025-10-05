import { useState } from 'react';
import AlphabetNav from './AlphabetNav';

const specialists = [
  // Simulasi data, bisa diganti dengan fetch API
  { name: 'Aritmia', desc: 'Gangguan irama jantung', letter: 'A' },
  { name: 'Andrologi', desc: 'Sistem reproduksi pria', letter: 'A' },
  { name: 'Bedah Saraf', desc: 'Operasi sistem saraf', letter: 'B' },
  { name: 'Dermatologi', desc: 'Kulit, rambut, kuku, estetika', letter: 'D' },
  { name: 'Kardiologi', desc: 'Jantung & pembuluh darah', letter: 'K' },
  { name: 'Nefrologi', desc: 'Ginjal & dialisis', letter: 'N' },
  { name: 'Onkologi', desc: 'Kanker', letter: 'O' },
  { name: 'Urologi', desc: 'Saluran kemih & reproduksi pria', letter: 'U' },
  // ...tambahkan sesuai kebutuhan
];

export default function SpecialistDirectory() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const filtered = specialists.filter(s => s.letter === selectedLetter);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Temukan Spesialis/Subspesialis Kami</h2>
        <AlphabetNav onSelect={setSelectedLetter} />
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">Belum ada spesialis untuk huruf ini.</div>
          ) : (
            filtered.map((spec, i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-xl font-bold mb-2 text-blue-700">{spec.name}</div>
                <p className="text-gray-700 mb-4">{spec.desc}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Lebih Lanjut</button>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <button className="text-blue-700 font-semibold hover:underline">Cari Berdasarkan Abjad</button>
        </div>
      </div>
    </section>
  );
}
