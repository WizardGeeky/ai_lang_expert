"use client";

import { useState } from "react";

export default function Home() {
  const [sourceLang, setSourceLang] = useState("");
  const [destLang, setDestLang] = useState("");
  const [content, setContent] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTranslation("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceLang, destLang, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to translate");
      }

      setTranslation(data.translation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[100dvh] flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-200 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-300/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-300/40 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center min-h-0 px-4 py-4 sm:px-8">
        <div className="text-center mb-6 flex-shrink-0 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 drop-shadow-sm">
            LangExpert AI
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto mt-3 font-medium">
            Seamlessly translate text across any language with the intelligence of Google&apos;s most advanced models.
          </p>
        </div>

        <div className="w-full bg-white/60 border border-white/40 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-y-auto flex-shrink min-h-[400px]">
          <form onSubmit={handleTranslate} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Source Language */}
              <div className="flex-1 space-y-1.5">
                <label htmlFor="sourceLang" className="block text-sm font-semibold text-slate-700 ml-1">
                  From Language
                </label>
                <input
                  id="sourceLang"
                  type="text"
                  placeholder="e.g., English, Spanish..."
                  required
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Swap Icon (Decorative) */}
              <div className="hidden sm:flex items-center justify-center mt-7">
                <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-orange-500 border border-slate-200/80 shadow-sm hover:rotate-180 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M21 3 9 15"/><path d="M8 21H3v-5"/><path d="M3 21l12-12"/></svg>
                </div>
              </div>

              {/* Destination Language */}
              <div className="flex-1 space-y-1.5">
                <label htmlFor="destLang" className="block text-sm font-semibold text-slate-700 ml-1">
                  To Language
                </label>
                <input
                  id="destLang"
                  type="text"
                  placeholder="e.g., Japanese, French..."
                  required
                  value={destLang}
                  onChange={(e) => setDestLang(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Content to Translate */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 ml-1">
                Text to Translate
              </label>
              <textarea
                id="content"
                required
                rows={4}
                placeholder="Type or paste your text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all duration-300 resize-none shadow-sm flex-1 min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !sourceLang || !destLang || !content}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-4 py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:opacity-90 transition-all duration-300 text-white font-bold text-lg">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <span>Translate Text</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/90 group-hover:text-white transition-colors group-hover:translate-x-1.5 duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50/80 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Translation Result */}
          {translation && (
            <div className="mt-8 space-y-2 animate-fade-in-up">
              <label className="block text-sm font-semibold text-orange-600 ml-1">
                Translation Result
              </label>
              <div className="w-full bg-orange-50/50 border border-orange-200/50 rounded-2xl p-6 text-slate-800 min-h-[100px] whitespace-pre-wrap leading-relaxed shadow-inner font-medium">
                {translation}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-sm font-medium text-slate-500 py-4 bg-white/40 backdrop-blur-md border-t border-slate-200/50 mt-auto flex-shrink-0">
        <p>
          developed by{" "}
          <a
            href="https://eswarb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 font-bold transition-colors duration-300 drop-shadow-sm hover:underline underline-offset-4"
          >
            Eswar
          </a>
        </p>
      </footer>
    </div>
  );
}
