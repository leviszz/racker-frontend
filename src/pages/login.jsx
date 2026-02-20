import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // 1. Estado de carregamento
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    // 2. Inicia o loading
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
        return // O bloco 'finally' executará mesmo com esse return
      }

      const data = await response.json()

      // salva token
      localStorage.setItem("token", data.access_token)

      // redireciona
      navigate("/scan")

    } catch (error) {
      console.error(error)
      alert("Erro ao conectar com servidor")
    } finally {
      // 3. Garante que o spinner pare, independente do resultado
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br bg-[#060b1a] ">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700">
        
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-2">
          V-BOSS Racker
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Acesse sua conta
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              // Desabilita input durante loading
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              // Desabilita input durante loading
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-200 shadow-lg flex justify-center items-center ${
              loading 
                ? "bg-yellow-600 cursor-not-allowed" 
                : "bg-yellow-500 hover:bg-yellow-400 text-white" // Mudei a cor do texto para slate-900 para melhor contraste com amarelo
            }`}
          >
            {loading ? (
              // Spinner (com cor escura para aparecer no amarelo)
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="text-center">
            <a
              href="/forgot-password"
              // Opcional: pointer-events-none impede clicar no link enquanto carrega o login
              className={`text-sm text-slate-400 hover:text-yellow-400 transition ${loading ? 'pointer-events-none opacity-50' : ''}`}
            >
              Esqueci minha senha
            </a>
          </div>

        </form>
      </div>
    </div>
  )
}