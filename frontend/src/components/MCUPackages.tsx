const categories = [
  'Semua Paket', 'Untuk Wanita', 'Untuk Pria', 'Untuk Perusahaan', 'Penawaran Spesial',
  'Skrining Umum', 'Skrining Lite', 'Skrining Jantung', 'Skrining Kanker',
  'Skrining Prakerja', 'Skrining Pranikah', 'Aplikasi Visa', 'Skrining Ginjal', 'Skrining Stroke',
  'Diagnostik', 'Cek Laboratorium', 'Cek Radiologi', 'Siloam at Home', 'Gift Card', 'Selangkah',
  'Terapi Radiasi', 'Telekonsultasi'
];

const packages = [
  { name: 'Skrining Umum', desc: 'Paket skrining kesehatan dasar', category: 'Skrining Umum' },
  { name: 'Skrining Jantung', desc: 'Deteksi risiko penyakit jantung', category: 'Skrining Jantung' },
  { name: 'Skrining Kanker', desc: 'Paket deteksi dini kanker', category: 'Skrining Kanker' },
  { name: 'MCU Wanita', desc: 'Medical check up khusus wanita', category: 'Untuk Wanita' },
  { name: 'MCU Pria', desc: 'Medical check up khusus pria', category: 'Untuk Pria' },
  { name: 'MCU Perusahaan', desc: 'Paket MCU untuk karyawan perusahaan', category: 'Untuk Perusahaan' },
  { name: 'Cek Laboratorium', desc: 'Paket tes lab lengkap', category: 'Cek Laboratorium' },
  { name: 'Cek Radiologi', desc: 'Paket pemeriksaan radiologi', category: 'Cek Radiologi' },
  // ...tambahkan sesuai kebutuhan
];

import { useState } from 'react';

export default function MCUPackages() {
  const [selected, setSelected] = useState('Semua Paket');
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Medical Check Up</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border ${selected === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'} font-semibold transition-colors`}
              onClick={() => setSelected(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.filter(pkg => selected === 'Semua Paket' || pkg.category === selected).map((pkg, i) => (
            <div key={i} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="text-xl font-bold mb-2 text-blue-700">{pkg.name}</div>
              <p className="text-gray-700 mb-4">{pkg.desc}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Lihat Detail</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
