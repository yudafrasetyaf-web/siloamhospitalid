const stories = [
  {
    name: 'Hendra Johari',
    title: 'Perjuangan Melawan Penyakit Ginjal Turunan',
    desc: 'Setelah mengalami penurunan fungsi ginjal akibat ginjal polikistik, Hendra menjalani transplantasi ginjal di Siloam Hospitals Asri.',
    doctor: 'Prof. Dr. dr. Endang Susalit, SpPD-KGH',
    specialty: 'Konsultan Ginjal & Hipertensi',
    link: '#',
  },
  // Tambahkan lebih banyak cerita jika diperlukan
];

export default function PatientStories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Cerita #BersamaSiloam</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, i) => (
            <div key={i} className="bg-blue-50 p-8 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="mb-2 font-semibold text-blue-700">{story.name}</div>
              <div className="text-xl font-bold mb-2">{story.title}</div>
              <p className="text-gray-700 mb-4">{story.desc}</p>
              <div className="text-sm text-gray-600 mb-2">{story.doctor} <span className="ml-2 text-blue-500">{story.specialty}</span></div>
              <a href={story.link} className="text-blue-700 hover:underline font-semibold">Baca Selengkapnya</a>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-blue-700 font-semibold hover:underline">Lihat Semua Cerita</a>
        </div>
      </div>
    </section>
  );
}
