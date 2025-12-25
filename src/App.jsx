import Home from "./Home";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-start sm:items-center justify-center px-4">
      <div className="w-full max-w-3xl
                     bg-slate-800/90 rounded-2xl border border-slate-700 text-center
                     p-5 sm:p-8 md:p-10
                     flex flex-col items-center gap-5 sm:gap-6
                     max-h-screen overflow-y-auto">
        
        <div className="w-full">
          <h1 className="font-bold leading-snug sm:leading-normal
                         text-3xl sm:text-4xl md:text-5xl
                         mb-3 sm:mb-4 md:mb-6 pb-1 overflow-visible">
            <span className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI Image Enhancer
            </span>
          </h1>

          <p className="mt-2 sm:mt-4 md:mt-5 text-base sm:text-lg text-slate-300">
            Enhance your images with ease
          </p>
        </div>

        <Home />

        <div className="text-[11px] sm:text-xs text-slate-500">
          <p>Created by Vipeen with React & Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}