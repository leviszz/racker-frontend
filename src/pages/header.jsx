import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full h-20 bg-slate-900/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between border-b border-slate-700 relative">
      
      {/* 1. Espaçador para garantir que o título fique no centro absoluto */}
      <div className="w-10 md:w-32"></div>

      {/* 2. Título Centralizado */}
      <h1 className="
        absolute left-1/2 -translate-x-1/2
        text-xl sm:text-xl md:text-3xl
        font-russo-one
        text-yellow-400
        tracking-tight
        uppercase italic
        drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]
        leading-none
        whitespace-nowrap
      ">
        V-BOSS <span className="hidden sm:inline">RACKER</span>
      </h1>

      {/* 3. Botão de Logout na Direita */}
      <nav>
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