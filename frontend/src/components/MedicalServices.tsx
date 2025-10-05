const items = [
  { number: '250+', label: 'Spesialisasi & Subspesialisasi' },
  { number: '300+', label: 'Tes Laboratorium' },
  { number: '200+', label: 'Pemeriksaan Radiologi' },
  { number: '200+', label: 'Paket Medical Check Up' },
  { number: '100+', label: 'Layanan Homecare' },
];

export default function MedicalServices() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Layanan Medis Siloam</h2>
        <div className="grid md:grid-cols-5 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold mb-2 text-blue-600">{item.number}</div>
              <div className="text-lg text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
