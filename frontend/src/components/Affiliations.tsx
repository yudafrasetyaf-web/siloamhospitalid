const affiliations = [
  { name: 'PT Siloam International Hospitals Tbk', desc: 'Jaringan rumah sakit swasta terbesar di Indonesia, 41+ cabang, 25 klinik.' },
  { name: 'Mitra Asuransi', desc: '400+ partner asuransi kesehatan nasional & internasional.' },
  { name: 'Klinik Siloam', desc: 'Jaringan klinik di berbagai kota.' },
  // ...tambahkan sesuai kebutuhan
];

export default function Affiliations() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Afiliasi Kami</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {affiliations.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="text-xl font-bold mb-2 text-blue-700">{item.name}</div>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="text-blue-700 font-semibold hover:underline">Lihat Lebih Banyak</button>
        </div>
      </div>
    </section>
  );
}
