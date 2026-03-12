import { Loader2, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardScan from "./dashboardscan";

// ── Sinais disponíveis para filtro ──────────────────────────
const SINAIS = [
  { key: "FLUXO CACHOEIRA",  label: "Fluxo Cachoeira",  cor: "#38bdf8" },
  { key: "INÍCIO CACHOEIRA", label: "Início Cachoeira", cor: "#22c55e" },
  { key: "BEIJO DA MORTE",   label: "Beijo da Morte",   cor: "#ef4444" },
  { key: "ANTECIPAÇÃO",      label: "Antecipação",      cor: "#f59e0b" },
  {key: "PILHA", label: "Candle Pilha", cor: "#a855f7", campo: "pilha"},
];

// ── Painel lateral de filtros ────────────────────────────────
function FilterSidebar({ filtros, setFiltros, total, filtrado }) {
  const todosAtivos = SINAIS.every(s => filtros.includes(s.key));

  const toggleTodos = () => setFiltros(todosAtivos ? [] : SINAIS.map(s => s.key));
  const toggle = (key) => setFiltros(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  return (
    <aside
      className="hidden md:flex flex-col gap-2 bg-slate-900 border border-slate-700 rounded-xl p-4 sticky top-20"
      style={{ width: "210px", flexShrink: 0, alignSelf: "flex-start" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Filtros</span>
        </div>
        <span className="text-xs text-slate-500 font-bold">{filtrado}/{total}</span>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Tipo de Sinal</p>

      {/* Checkboxes */}
      {SINAIS.map(({ key, label, cor }) => {
        const ativo = filtros.includes(key);
        return (
          <label
            key={key}
            onClick={() => toggle(key)}
            className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-all"
            style={{
              background: ativo ? `${cor}15` : "transparent",
              border: `1px solid ${ativo ? `${cor}50` : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center transition-all"
              style={{
                width: "15px", height: "15px",
                borderRadius: "3px",
                border: `2px solid ${ativo ? cor : "#475569"}`,
                background: ativo ? cor : "transparent",
              }}
            >
              {ativo && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              className="text-xs font-bold uppercase tracking-wide select-none"
              style={{ color: ativo ? cor : "#94a3b8" }}
            >
              {label}
            </span>
          </label>
        );
      })}

      {/* Divisor */}
      <div className="border-t border-slate-700 my-1" />

      {/* Selecionar/limpar tudo */}
      <button
        onClick={toggleTodos}
        className="w-full text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition-all"
        style={{
          background: todosAtivos ? "rgba(255,255,255,0.05)" : "rgba(245,197,24,0.1)",
          color: todosAtivos ? "#475569" : "#f5c518",
          border: `1px solid ${todosAtivos ? "rgba(255,255,255,0.06)" : "rgba(245,197,24,0.2)"}`,
          cursor: "pointer",
        }}
      >
        {todosAtivos ? "Limpar tudo" : "Selecionar tudo"}
      </button>

      {filtros.length === 0 && (
        <p className="text-center text-[11px] text-slate-600 italic mt-1">Nenhum filtro ativo</p>
      )}
    </aside>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function Scan() {
  const [resultados, setResultados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtros, setFiltros] = useState(SINAIS.map(s => s.key));

  const navigate = useNavigate();

  const registrarCliqueMoeda = async (moeda) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`http://127.0.0.1:8000/track-coin/${moeda}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Erro ao registrar clique na moeda:", err);
    }
  };

  async function fetchScan() {
    const token = localStorage.getItem("token");
    if (!token) return;
    setCarregando(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/scan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.resultados && data.resultados.length > 0) {
        setResultados(data.resultados);
        setErro(false);
      } else {
        setResultados([]);
      }
      setCooldown(300);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtragem dos resultados
  const resultadosFiltrados = resultados
    ? filtros.length === 0
      ? []
      : resultados.filter(r =>
    filtros.some(f => {
    const sinalObj = SINAIS.find(s => s.key === f)
    const campo = sinalObj?.campo ?? "sinal"
    return r[campo]?.toUpperCase().includes(f)
  })
)
    : null;

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

      <div>
        <DashboardScan />
      </div>

      {/* ================= BOTÃO ================= */}
      <div className="flex justify-center mb-14 bg">
        <button
          onClick={fetchScan}
          disabled={cooldown > 0 || carregando}
          className={`
            px-20 py-5 rounded-xl font-bold text-lg md:text-xl
            transition-all duration-300 transform
            bg-green-600 text-white
            shadow-[0_0_20px_rgba(255,215,0,0.4)] m-5
            ${(cooldown === 0 && !carregando) ? "hover:scale-105" : "cursor-not-allowed"}
          `}
        >
          {carregando ? (
            <span className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin " />
              Buscando oportunidades...
            </span>
          ) : cooldown > 0 ? (
            `Aguarde ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`
          ) : (
            "Clique agora e localize pares"
          )}
        </button>
      </div>

      {/* ================= TABELA DESKTOP ================= */}
      <div className="hidden md:block pb-10 overflow-x-auto px-4 md:px-0 w-full">

        {/* Linha de controle: toggle + contador */}
        {resultados !== null && (
          <div className="max-w-6xl mx-auto flex items-center justify-between mb-3 px-1">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
              style={{
                color: sidebarOpen ? "#f5c518" : "#64748b",
                background: sidebarOpen ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${sidebarOpen ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.06)"}`,
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={13} />
              {sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
            <span className="text-xs text-slate-500">
              <span className="text-white font-bold">{resultadosFiltrados?.length ?? 0}</span>
              {" "}de{" "}
              <span className="text-white font-bold">{resultados.length}</span>
              {" "}resultados
            </span>
          </div>
        )}

        {/* Layout: sidebar + tabela */}
        <div className="max-w-6xl mx-auto flex gap-4 items-start">

          {resultados !== null && sidebarOpen && (
            <FilterSidebar
              filtros={filtros}
              setFiltros={setFiltros}
              total={resultados.length}
              filtrado={resultadosFiltrados?.length ?? 0}
            />
          )}

          <table className="flex-1 min-w-[600px] border-collapse rounded-xl overflow-hidden shadow-xl">
            <thead className="bg-yellow-500 text-black">
              <tr>
                {["Par", "Sinal Técnico", "Timeframe", "Suporte", "Candle Pilha", "Variação 24h", "URL BINANCE"].map((col, i) => (
                  <th key={i} className="py-4 px-6 text-center font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {erro && (
                <tr><td colSpan="7" className="text-center p-6 text-red-500">Erro ao conectar à API</td></tr>
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
              {resultados !== null && filtros.length === 0 && (
                <tr><td colSpan="7" className="text-center p-6 text-slate-500">Nenhum filtro selecionado</td></tr>
              )}
              {resultados !== null && filtros.length > 0 && resultadosFiltrados?.length === 0 && (
                <tr><td colSpan="7" className="text-center p-6 text-slate-500">Nenhum sinal para os filtros selecionados</td></tr>
              )}
              {resultadosFiltrados?.map((r, index) => {
                const perigoso = r.suporte?.includes("PERIGOSO");
                const variacaoNegativa = r.variacao?.includes("-");
                return (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-800 transition">
                    <td className="py-4 px-6 font-bold text-yellow-400">{r.par}</td>
                    <td className="py-4 px-6">{r.sinal}</td>
                    <td className="py-4 px-6">{r.tf}</td>
                    <td className={`py-4 px-6 font-semibold ${perigoso ? "text-red-500" : "text-green-400"}`}>
                      ⚠️ {r.suporte}
                    </td>
                    <td className="py-4 px-6">{r.pilha}</td>
                    <td className={`py-4 px-6 font-bold ${variacaoNegativa ? "text-red-500" : "text-green-400"}`}>
                      {r.variacao}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={r.binance}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-500 font-bold hover:underline"
                        onClick={() => registrarCliqueMoeda(r.par)}
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
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-4 space-y-4">

        {/* Chips de filtro mobile */}
        {resultados !== null && (
          <div className="flex flex-wrap gap-2 pb-2">
            {SINAIS.map(({ key, label, cor }) => {
              const ativo = filtros.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => setFiltros(prev => ativo ? prev.filter(k => k !== key) : [...prev, key])}
                  className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: ativo ? `${cor}18` : "rgba(255,255,255,0.04)",
                    color: ativo ? cor : "#64748b",
                    border: `1px solid ${ativo ? `${cor}40` : "rgba(255,255,255,0.06)"}`,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {erro && <div className="text-center p-6 text-red-500">Erro ao conectar à API</div>}

        {carregando && !resultados && (
          <div className="flex items-center justify-center gap-3 italic text-yellow-200 pb-10">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Buscando oportunidades...</span>
          </div>
        )}

        {resultados !== null && filtros.length === 0 && (
          <div className="text-center p-6 text-slate-500">Nenhum filtro selecionado</div>
        )}

        {resultados !== null && filtros.length > 0 && resultadosFiltrados?.length === 0 && (
          <div className="text-center p-6 text-slate-500">Nenhum sinal para os filtros selecionados</div>
        )}

        {resultadosFiltrados?.map((r, index) => {
          const perigoso = r.suporte?.includes("PERIGOSO");
          const variacaoNegativa = r.variacao?.includes("-");
          return (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-bold text-yellow-400 text-lg">{r.par}</span>
                <span className={`font-bold ${variacaoNegativa ? "text-red-500" : "text-green-400"}`}>
                  Variação: {r.variacao}
                </span>
              </div>
              <div className="text-sm text-slate-300">{r.sinal}</div>
              <div className="flex justify-between text-sm">
                <span>Timeframe: {r.tf}</span>
                <span className={`font-semibold ${perigoso ? "text-red-500" : "text-green-400"}`}>
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
                onClick={() => registrarCliqueMoeda(r.par)}
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