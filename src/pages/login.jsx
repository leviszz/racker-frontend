import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "./footer"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://racker-ultra-api-update.onrender.com/auth/jwt/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      })

      if (!response.ok) {
        alert("Login inválido")
        return 
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      navigate("/scan")

    } catch (error) {
      console.error(error)
      alert("Erro ao conectar com servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Adicionado p-4 para mobile e min-h-screen centralizado
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060b1a] p-4">
      
      {/* max-w-md no desktop, w-full no mobile */}
      <div className="w-full max-w-[400px] bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800">
        
        {/* Título com estilo 'Hacker' mais forte */}
        <h1 className="text-3xl md:text-4xl mb-10 font-russo-one  text-center text-yellow-400 mb-2 uppercase  drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
          V-BOSS Racker
        </h1>

        

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              // text-base evita o auto-zoom no iPhone
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all disabled:opacity-50"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all disabled:opacity-50"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            // text-slate-950 oferece melhor contraste no fundo amarelo
            className={`w-full h-14 f uppercase tracking-widest rounded-xl transition-all duration-300  flex justify-center items-center ${
              loading 
                ? "bg-yellow-600 cursor-not-allowed opacity-70" 
                : "bg-[#17181a] hover:bg-yellow-300 text-white active:scale-[0.98] hover:shadow-[0_0_25px_rgba(250,204,21,0.4)]"
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Entrar no Sistema"
            )}
          </button>

          <div className="text-center pt-2">
            <a
              href="/forgot-password"
              className={`text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-yellow-400 transition-colors ${loading ? 'pointer-events-none opacity-50' : ''}`}
            >
              Esqueci minha senha
            </a>
          </div>

        </form>
      </div>
    </div>
  )
}