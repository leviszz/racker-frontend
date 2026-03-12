import React, { useEffect, useState } from "react";
import { Users, MousePointerClick, TrendingUp, Loader2, Trophy, Coins } from "lucide-react";


export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("hoje"); // NOVO: Estado para o filtro de tempo

  // Busca os dados passando o período na URL
  async function fetchStats(periodoSelecionado) {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Adicionamos ?periodo=... no final da URL
      const response = await fetch(`http://127.0.0.1:8000/admin/dashboard-stats?periodo=${periodoSelecionado}`, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }

  // Recarrega sempre que a variável 'periodo' mudar
  useEffect(() => {
    fetchStats(periodo);
  }, [periodo]);

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#060b1a] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b1a] text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO EXECUTIVO E FILTROS */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black text-yellow-500 tracking-tighter uppercase">
              Painel de Controle
            </h1>
            <p className="text-slate-400 mt-1">Métricas de Engajamento em Tempo Real</p>
          </div>
          
          {/* NOVO: Botões de Filtro de Tempo */}
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            {['hoje', 'semana', 'mes', 'ano'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                  periodo === p 
                    ? 'bg-yellow-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {p === 'mes' ? 'Mês' : p}
              </button>
            ))}
          </div>
        </header>

        {/* CARDS DE MÉTRICAS */}
        {loading && stats ? (
           <div className="flex justify-center mb-8"><Loader2 className="h-6 w-6 animate-spin text-yellow-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              title="Total de Scans" 
              value={stats?.cards.total_requisicoes} 
              icon={<MousePointerClick className="h-8 w-8 text-blue-400" />}
              description="Requisições no período"
              color="border-blue-500/30"
            />
            <StatCard 
              title="Utilizadores Ativos" 
              value={stats?.cards.usuarios_ativos} 
              icon={<Users className="h-8 w-8 text-green-400" />}
              description="Pessoas únicas"
              color="border-green-500/30"
            />
            <StatCard 
              title="Média de Uso" 
              value={`${stats?.cards.media_uso_por_usuario}`} 
              icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
              description="Scans por utilizador"
              color="border-purple-500/30"
            />
            {/* NOVO: Cartão da Moeda */}
            <StatCard 
              title="Top Moeda" 
              value={stats?.cards.moeda_top} 
              icon={<Coins className="h-8 w-8 text-yellow-400" />}
              description="Moeda mais requisitada"
              color="border-yellow-500/30"
            />
          </div>
        )}

        {/* RANKING DE UTILIZADORES (Mantido igual) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500 h-6 w-6" />
            <h2 className="text-2xl font-bold">Ranking de Atividade</h2>
          </div>

          <div className="space-y-3">
            {(stats?.ranking_usuarios ?? []).map((user, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-4 bg-slate-800/40 hover:bg-slate-800/80 transition-all rounded-2xl border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold w-6">{index + 1}º</span>
                  <span className="font-semibold text-slate-200">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden hidden md:block">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${(user.cliques / stats?.cards.total_requisicoes) * 100}%` }}
                    />
                  </div>
                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-lg font-black text-sm">
                    {user.cliques} SCANS
                  </span>
                </div>
              </div>
            ))}

            {(stats?.ranking_usuarios ?? []).length === 0 && (
              <p className="text-center text-slate-500 py-10 italic">Nenhum dado registado para este período.</p>
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