import React, { useEffect, useState, useCallback } from "react";
import { Users, MousePointerClick, TrendingUp, Loader2, Trophy, Coins } from "lucide-react";

export default function DashboardScan() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("hoje");
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado

  // 1. Busca os dados do usuário para validar se é Superuser
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }
    fetchUser();
  }, []);

  // 2. Busca as estatísticas
  const fetchStats = useCallback(async (periodoSelecionado) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/admin/dashboard-stats?periodo=${periodoSelecionado}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(periodo);
  }, [periodo, fetchStats]);

  // 3. Função de Reset
  const handleResetStats = async () => {
    if (!window.confirm("Zerar todas as estatísticas?")) return;
    const token = localStorage.getItem("token");
    try {
      // Verifique se o endpoint é /admin/reset-stats ou /admin/reset-clicks conforme seu main.py
      const response = await fetch("http://127.0.0.1:8000/admin/reset-clicks", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Estatísticas resetadas!");
        fetchStats(periodo);
      } else {
        alert("Erro ao resetar. Verifique se você tem permissão de administrador.");
      }
    } catch (error) {
      console.error("Erro ao resetar:", error);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="bg-[#060b1a] text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-800 pb-6 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-tight">Dashboard</h2>
            
            {/* BOTÃO DE RESET: Só aparece se for Superuser */}
            {user?.is_superuser && (
              <button
                onClick={handleResetStats}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
              >
                Resetar Estatísticas
              </button>
            )}
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            {['hoje', 'semana', 'mes', 'ano'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                  periodo === p ? 'bg-yellow-500 text-black' : 'text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {p === 'mes' ? 'Mês' : p}
              </button>
            ))}
          </div>
        </header>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total de Scans" 
            value={stats?.cards.total_requisicoes || 0} 
            icon={<MousePointerClick className="h-8 w-8 text-blue-400" />}
            description="Requisições no período"
            color="border-blue-500/30"
          />
          <StatCard 
            title="Utilizadores Ativos" 
            value={stats?.cards.usuarios_ativos || 0} 
            icon={<Users className="h-8 w-8 text-green-400" />}
            description="Pessoas únicas"
            color="border-green-500/30"
          />
          <StatCard 
            title="Média de Uso" 
            value={stats?.cards.media_uso_por_usuario || 0} 
            icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
            description="Scans por utilizador"
            color="border-purple-500/30"
          />
          <StatCard 
            title="Top Moeda" 
            value={stats?.cards.moeda_top || "N/A"} 
            icon={<Coins className="h-8 w-8 text-yellow-400" />}
            description="Moeda mais requisitada"
            color="border-yellow-500/30"
          />
        </div>

        {/* RANKING TOP 5 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Ranking de Pares (Top 5)</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {stats?.ranking_moedas && stats.ranking_moedas.length > 0 ? (
              stats.ranking_moedas.slice(0, 5).map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                      index === 0 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {index + 1}º
                    </span>
                    <span className="font-bold text-lg text-yellow-400 group-hover:scale-105 transition-transform">
                      {item.moeda}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-black block">{item.cliques}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Acessos</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-700 rounded-xl">
                <p className="text-slate-500 italic text-sm">Nenhum clique registrado neste período.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, color }) {
  return (
    <div className={`bg-slate-900/40 border-l-4 ${color} p-6 rounded-2xl shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        {icon}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-3xl font-black mb-1 truncate" title={value}>{value}</div>
      <p className="text-slate-500 text-xs">{description}</p>
    </div>
  );
}