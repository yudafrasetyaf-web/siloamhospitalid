const services = [
  { title: 'Ibu & Anak', desc: 'Program IVF: 200+ Kelahiran Bayi', icon: '👶' },
  { title: 'Nefrologi', desc: '260+ Operasi Transplantasi Ginjal', icon: '🩺' },
  { title: 'Kardiologi', desc: '3,7K+ Prosedur PCI per Tahun', icon: '❤️' },
  { title: 'Neurosains', desc: '12K+ Bedah Saraf per Tahun', icon: '🧠' },
  { title: 'Onkologi', desc: '13K+ Operasi Pengangkatan Tumor per Tahun', icon: '🎗️' },
  { title: 'Urologi', desc: '32K+ Operasi Saluran Kemih per Tahun', icon: '💧' },
  { title: 'Ortopedi', desc: '60K+ Operasi Tulang dan Trauma per Tahun', icon: '🦴' },
  { title: 'Digestif', desc: '10K+ Operasi Sistem Pencernaan per Tahun', icon: '🍽️' },
];

export default function FeaturedServices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Layanan Unggulan</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {services.map((svc, i) => (
            <div key={i} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
              <div className="text-4xl mb-4">{svc.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{svc.title}</h3>
              <p className="text-gray-600">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
