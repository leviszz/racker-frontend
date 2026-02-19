import { useEffect, useState } from "react";
import { LogOut } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; // Se estiver usando react-router
export default function Scan() {
  const [resultados, setResultados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token"); // Remove o acesso
  navigate("/"); // Redireciona (ajuste a rota conforme seu projeto)
};
  useEffect(() => {
    // Pegamos o token dentro do useEffect para garantir o valor atual
    const token = localStorage.getItem("token");
    let isMounted = true; // Evita atualizar estado se o componente desmontou

    async function fetchData() {
      if (!token) return;
      
      setCarregando(true);
      try {
        const res = await fetch("https://racker-ultra-api-update.onrender.com/scan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("DATA RECEBIDA:", data);

        if (isMounted) {
          // Só atualiza se o back-end realmente enviou dados
          if (data.resultados && data.resultados.length > 0) {
            setResultados(data.resultados);
            setErro(false);
          } else if (!resultados) {
            // Se ainda não tem nada na tela e veio vazio, define como array vazio
            setResultados([]);
          }
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
        if (isMounted) setErro(true);
      } finally {
        if (isMounted) setCarregando(false);
      }
    }

    fetchData();

    return () => { isMounted = false; }; // Cleanup function
  }, []); // [] faz rodar APENAS na montagem do componente

  return (
    <div className="min-h-screen bg-[#060b1a] text-white font-sans">
        <nav className="flex justify-end p-6"> 
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
  >
    <LogOut size={16} />
    Sair do Sistema
  </button>
</nav>
      <h1 className="text-yellow-400 text-3xl font-sans font-bold text-center m-10 p-7 mb-6">
        Bem Vindo à ferramenta V-BOSS Racker 
      </h1>

      <div className="bg-red-600 font-bold text-center py-2 px-4 w-fit mx-auto mb-10 rounded border-2 border-red-800">
        ⚠️ FAZER 1 REQUISIÇÃO A CADA 5 MINUTOS PARA QUE NÃO SOFRA BLOQUEIO
      </div>

      <div className="overflow-x-auto">
        <table className="w-full max-w-6xl mx-auto border-collapse rounded-xl overflow-hidden shadow-xl">
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
              <tr><td colSpan="7" className="text-center p-6 italic text-yellow-200">Buscando dados no servidor...</td></tr>
            )}

            {!erro && resultados?.length === 0 && (
              <tr><td colSpan="7" className="text-center p-6">Nenhum sinal encontrado no momento</td></tr>
            )}

            {resultados?.map((r, index) => {
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
                  <td className="py-4 px-10">{r.pilha}</td>
                  <td className={`py-4 px-6 font-bold ${variacaoNegativa ? "text-red-500" : "text-green-400"}`}>
                    {r.variacao}
                  </td>
                  <td className="py-4 px-6">
                    <a href={r.binance} target="_blank" rel="noreferrer" className="text-sky-500 font-bold hover:underline">
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
  );
}