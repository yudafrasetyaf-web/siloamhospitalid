import { useState } from 'react';

export default function HealthCalculator() {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [smoke, setSmoke] = useState('');
  const [bp, setBp] = useState('');
  const [risk, setRisk] = useState<string | null>(null);

  const calculate = () => {
    // Simulasi sederhana, bisa diintegrasikan ke backend
    if (!age || !weight || !height || !bp) {
      setRisk('Lengkapi semua data untuk hasil akurat.');
      return;
    }
    let score = 0;
    if (parseInt(age) > 45) score++;
    if (parseInt(bp) > 130) score++;
    if (smoke === 'ya') score++;
    setRisk(score >= 2 ? 'Risiko jantung Anda tinggi. Konsultasikan ke dokter.' : 'Risiko jantung Anda rendah.');
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Kalkulator Kesehatan</h2>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1">Jenis Kelamin</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border px-3 py-2 rounded">
                <option value="">Pilih</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Umur</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Tahun" />
            </div>
            <div>
              <label className="block mb-1">Berat Badan (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block mb-1">Tinggi Badan (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block mb-1">Tekanan Darah</label>
              <input type="number" value={bp} onChange={e => setBp(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="mmHg" />
            </div>
            <div>
              <label className="block mb-1">Apakah kamu merokok?</label>
              <select value={smoke} onChange={e => setSmoke(e.target.value)} className="w-full border px-3 py-2 rounded">
                <option value="">Pilih</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 mt-4">Hitung Risiko Jantung</button>
          {risk && <div className="mt-6 text-center text-lg font-bold text-blue-700">{risk}</div>}
        </div>
      </div>
    </section>
  );
}
