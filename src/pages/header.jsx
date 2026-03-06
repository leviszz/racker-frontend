import { LogOut, LayoutDashboard, Search } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isDashboard = location.pathname.includes("/admin/dashboard");


  // Busca os dados do seu próprio usuário para verificar permissões
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("https://racker-ultra-api-update.onrender.com/users/me", {
          headers: { 
            "Authorization": `Bearer ${token}` 
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full h-20 bg-slate-900/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between border-b border-slate-700 relative z-50">
      
      {/* NAVEGAÇÃO À ESQUERDA */}
      {/* NAVEGAÇÃO À ESQUERDA */}
      <nav className="flex items-center gap-3 md:gap-5 z-10 w-1/3">
        {/* Renderização condicional: SÓ APARECE PARA ADMINS */}
        {user?.is_superuser && (
          isDashboard ? (
            // Se estiver no Dashboard -> Mostra botão para ir pro Scanner
            <Link 
              to="/scan" 
              className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 transition-all shadow-[0_0_10px_rgba(56,189,248,0.1)]"
            >
              <Search size={16} />
              <span className="hidden md:inline">Scanner</span>
            </Link>
          ) : (
            // Se NÃO estiver no Dashboard -> Mostra botão para ir pro Painel Admin
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 transition-all shadow-[0_0_10px_rgba(234,179,8,0.1)]"
            >
              <LayoutDashboard size={16} />
              <span className="hidden md:inline">Painel Admin</span>
            </Link>
          )
        )}
      </nav>

      {/* TÍTULO CENTRALIZADO */}
      <div className="w-1/3 flex justify-center">
        <h1 className="
          text-xl sm:text-xl md:text-3xl
          font-russo-one
          text-yellow-400
          tracking-tight
          uppercase italic
          drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]
          leading-none
          whitespace-nowrap
          pointer-events-none
        ">
          V-BOSS <span className="hidden sm:inline">RACKER</span>
        </h1>
      </div>

      {/* BOTÃO DE SAIR NA DIREITA */}
      <nav className="z-10 w-1/3 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </nav>
    </header>
  );
}