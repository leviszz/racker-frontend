import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const [resultados, setResultados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // ================= FUNÇÃO DE REQUISIÇÃO =================
  async function fetchScan() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCarregando(true);

    try {
      const res = await fetch(
        "https://racker-ultra-api-update.onrender.com/scan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.resultados && data.resultados.length > 0) {
        setResultados(data.resultados);
        setErro(false);
      } else {
        setResultados([]);
      }

      // Ativa cooldown de 5 minutos (300 segundos)
      setCooldown(300);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  // ================= EXECUTA NA MONTAGEM =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060b1a] text-white font-sans">

      <nav className="flex justify-end p-6">
        <div className="w-full flex justify-center py-4">
          <section className="flex items-center gap-4">
            <p className="text-lg md:text-2xl text-white uppercase tracking-tighter text-center">
              Mercado Asiático de Futuros
            </p>
          </section>
        </div>
      </nav>

      {/* ================= RETÂNGULO VERMELHO COM BOTÃO ================= */}
      <div className="flex justify-center mb-14 bg">

  <button
    onClick={fetchScan}
    disabled={cooldown > 0 || carregando}
    className={`
  px-20 py-5 rounded-xl font-bold text-lg md:text-xl
  transition-all duration-300 transform
  bg-green-600 text-white
  
  
  shadow-[0_0_20px_rgba(255,215,0,0.4)]
  ${(cooldown === 0 && !carregando)
    ? "hover:scale-105 "
    : "cursor-not-allowed"
  }
`}
  >
    {carregando ? (
  <span className="flex items-center gap-3">
    <Loader2 className="h-5 w-5 animate-spin" />
    Buscando oportunidades...
  </span>
) : cooldown > 0 ? (
  `Aguarde ${Math.floor(cooldown / 60)}:${String(
    cooldown % 60
  ).padStart(2, "0")}`
) : (
  "Clique agora e localize pares"
)}
  </button>

</div>

      {/* ================= TABELA DESKTOP ================= */}
      <div className="hidden md:block overflow-x-auto px-4 md:px-0 w-full">
        <table className="w-full min-w-[900px] max-w-6xl mx-auto border-collapse rounded-xl overflow-hidden shadow-xl">
          <thead className="bg-yellow-500 text-black">
            <tr>
              {[
                "Par",
                "Sinal Técnico",
                "Timeframe",
                "Suporte",
                "Candle Pilha",
                "Variação 24h",
                "URL BINANCE",
              ].map((col, i) => (
                <th key={i} className="py-4 px-6 text-center font-bold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {erro && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-red-500">
                  Erro ao conectar à API
                </td>
              </tr>
            )}

            {carregando && !resultados && (
              <tr>
                <td colSpan="7" className="p-6">
                  <div className="flex items-center justify-center gap-3 italic text-yellow-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Buscando oportunidades em 18 mil pares...</span>
                  </div>
                </td>
              </tr>
            )}

            {!erro && resultados?.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Nenhum sinal encontrado no momento
                </td>
              </tr>
            )}

            {resultados?.map((r, index) => {
              const perigoso = r.suporte?.includes("PERIGOSO");
              const variacaoNegativa = r.variacao?.includes("-");

              return (
                <tr
                  key={index}
                  className="border-b border-slate-700 hover:bg-slate-800 transition"
                >
                  <td className="py-4 px-6 font-bold text-yellow-400">
                    {r.par}
                  </td>
                  <td className="py-4 px-6">{r.sinal}</td>
                  <td className="py-4 px-6">{r.tf}</td>
                  <td
                    className={`py-4 px-6 font-semibold ${
                      perigoso ? "text-red-500" : "text-green-400"
                    }`}
                  >
                    ⚠️ {r.suporte}
                  </td>
                  <td className="py-4 px-6">{r.pilha}</td>
                  <td
                    className={`py-4 px-6 font-bold ${
                      variacaoNegativa ? "text-red-500" : "text-green-400"
                    }`}
                  >
                    {r.variacao}
                  </td>
                  <td className="py-4 px-6">
                    <a
                      href={r.binance}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-500 font-bold hover:underline"
                    >
                      ABRIR
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        
      </div>
      {/* ================= MOBILE ================= */}
<div className="md:hidden px-4 space-y-4">

  {erro && (
    <div className="text-center p-6 text-red-500">
      Erro ao conectar à API
    </div>
  )}

  {carregando && !resultados && (
    <div className="flex items-center justify-center gap-3 italic text-yellow-200">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Buscando oportunidades...</span>
    </div>
  )}

  {!erro && resultados?.length === 0 && (
    <div className="text-center p-6">
      Nenhum sinal encontrado no momento
    </div>
  )}

  {resultados?.map((r, index) => {
    const perigoso = r.suporte?.includes("PERIGOSO");
    const variacaoNegativa = r.variacao?.includes("-");

    return (
      <div
        key={index}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-yellow-400 text-lg">
            {r.par}
          </span>

          <span
            className={`font-bold ${
              variacaoNegativa ? "text-red-500" : "text-green-400"
            }`}
          >
            Variação: {r.variacao}
          </span>
        </div>

        <div className="text-sm text-slate-300">
          {r.sinal}
        </div>

        <div className="flex justify-between text-sm">
          <span>Timeframe: {r.tf}</span>

          <span
            className={`font-semibold ${
              perigoso ? "text-red-500" : "text-green-400"
            }`}
          >
            ⚠️ {r.suporte}
          </span>
        </div>

        {r.pilha && (
          <div className="text-sm text-slate-300">
            <span className="font-semibold">Candle Pilha:</span> {r.pilha}
          </div>
        )}

        <a
          href={r.binance}
          target="_blank"
          rel="noreferrer"
          className="block text-center bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          ABRIR NA BINANCE
        </a>
      </div>
    );
  })}

</div>
    </div>
  );
}