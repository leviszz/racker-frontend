import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [contador, setContador] = useState(3)

  // Countdown e redirecionamento automático após sucesso
  useEffect(() => {
    if (!sucesso) return
    if (contador === 0) {
      navigate("/")
      return
    }
    const timer = setTimeout(() => setContador((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [sucesso, contador, navigate])

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    setMsg("")

    

    try {
      const response = await fetch("https://racker-ultra-api-update.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        setSucesso(true)
        setPassword("")
      } else {
        setMsg("Erro ao redefinir senha. O link pode ter expirado.")
      }
    } catch (error) {
      setMsg("Erro de conexão com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-russo-one text-yellow-400 tracking-tight drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] leading-none mb-8 pb-10">
        V-BOSS <span className="hidden sm:inline">RACKER</span>
      </h1>

      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-800">

        {sucesso ? (
          /* ── Tela de sucesso com countdown ── */
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-green-400">Senha redefinida!</h2>
            <p className="text-slate-400 text-sm">
              Redirecionando para o login em{" "}
              <span className="text-yellow-400 font-black text-lg">{contador}</span>
              {" "}segundo{contador !== 1 ? "s" : ""}...
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full p-3 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-all"
            >
              Ir para o Login agora
            </button>
          </div>
        ) : (
          /* ── Formulário normal ── */
          <form onSubmit={handleReset}>
            <h2 className="text-2xl mb-6 text-yellow-400 font-bold">Definir Nova Senha</h2>

            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 transition"
            />

            <button
              disabled={loading}
              className={`w-full p-2 rounded font-bold transition-all flex justify-center items-center ${
                loading ? "bg-green-800 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                "Confirmar"
              )}
            </button>

            {msg && <p className="mt-4 text-center text-red-400 text-sm">{msg}</p>}
          </form>
        )}
      </div>
    </div>
  )
}