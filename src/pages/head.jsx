import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderSimple() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
  <div className="w-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">

    {/* Logo */}
    <h1 className="
      text-lg sm:text-xl md:text-3xl
      font-russo-one
      text-yellow-400
      tracking-tight
      uppercase italic
      drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]
      leading-none
    ">
      V-BOSS <span className="hidden sm:inline">RACKER</span>
    </h1>

  </div>
</header>
  );
}