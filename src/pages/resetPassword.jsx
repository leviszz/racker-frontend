import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  // 1. Estado de carregamento
  const [loading, setLoading] = useState(false)

  async function handleReset(e) {
    e.preventDefault()

    // 2. Inicia o loading
    setLoading(true)
    setMsg("")

    try {
      const response = await fetch("https://racker-ultra-api-update.onrender.com/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      if (response.ok) {
        setMsg("Senha redefinida com sucesso.")
        // Opcional: Limpar o campo de senha após o sucesso
        setPassword("")
      } else {
        setMsg("Erro ao redefinir senha.")
      }
    } catch (error) {
      setMsg("Erro de conexão com o servidor.")
    } finally {
      // 3. Garante que o loading pare
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">

  <h1 className="
    text-2xl sm:text-3xl md:text-4xl
    font-russo-one
    text-yellow-400
    tracking-tight
    
    drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]
    leading-none
    mb-8
    pb-10
  ">
    V-BOSS <span className="hidden sm:inline">RACKER</span>
  </h1>

  <form
    onSubmit={handleReset}
    className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-800"
  >
        <h2 className="text-2xl mb-6 text-yellow-400 font-bold">
          Definir Nova Senha
        </h2>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          // Desabilita input durante loading
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 transition"
        />

        <button 
          disabled={loading}
          className={`w-full p-2 rounded font-bold transition-all flex justify-center items-center ${
            loading 
              ? "bg-green-800 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? (
            // Spinner (SVG)
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Confirmar"
          )}
        </button>

        {msg && <p className="mt-4 text-center text-slate-300 text-sm">{msg}</p>}
      </form>
    </div>
  )
}