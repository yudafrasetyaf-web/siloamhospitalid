const stats = [
  { number: '41+', label: 'Rumah Sakit di Seluruh Indonesia' },
  { number: '12.5K+', label: 'Tenaga Medis' },
  { number: '400+', label: 'Mitra Asuransi' },
  { number: '9M+', label: 'Pasien Dilayani' },
];

export default function Statistics() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
