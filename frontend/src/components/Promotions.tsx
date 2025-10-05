const promos = [
  { title: 'Rawat Tulang di Rumah 🏠', desc: 'Layanan ortopedi homecare untuk pemulihan optimal.' },
  { title: 'Sehat Itu Investasi, Yuk MCU 🩺', desc: 'Paket Medical Check Up hemat untuk keluarga.' },
  { title: 'Cek Risiko Jantung Mulai Sekarang!', desc: 'Konsultasi dan screening risiko jantung.' },
  { title: '🚨 30-50% Kanker Bisa Dicegah!', desc: 'Promo deteksi dini kanker dengan harga spesial.' },
  { title: 'Download Aplikasi, Hemat Radiologi?🤩', desc: 'Diskon radiologi untuk pengguna MySiloam App.' },
  { title: 'Liburan Tenang, Chat Dokter 24 Jam', desc: 'Telekonsultasi kapan saja, di mana saja.' },
];

export default function Promotions() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Promo</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {promos.map((promo, i) => (
            <div key={i} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-xl font-semibold mb-2 text-blue-700">{promo.title}</div>
              <p className="text-gray-700">{promo.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-blue-700 font-semibold hover:underline">Lihat Semua Promo</a>
        </div>
      </div>
    </section>
  );
}
