export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">
          Selamat Datang di Siloam Hospitals
        </h1>
        <p className="text-2xl mb-8">Yang berarti, segera kembali.</p>
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 max-w-3xl">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Cari Dokter, Lokasi..." 
              className="flex-1 px-4 py-3 border rounded text-gray-800"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700">
              Cari
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
