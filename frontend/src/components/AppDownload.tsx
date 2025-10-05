export default function AppDownload() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-8 md:mb-0 md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">MySiloam App</h2>
          <p className="mb-6 text-lg">Solusi kesehatan terintegrasi, dalam genggaman. Cek janji temu, telekonsultasi, akses rekam medis, dan banyak lagi.</p>
          <div className="flex gap-4">
            <a href="#" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 transition-colors">Download di App Store</a>
            <a href="#" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 transition-colors">Download di Google Play</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src="/mysiloam-app.png" alt="MySiloam App" className="w-60 rounded-xl shadow-lg" />
        </div>
      </div>
    </section>
  );
}
