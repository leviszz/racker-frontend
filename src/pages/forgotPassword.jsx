import { useState } from "react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")
  // 1. Adicionamos o estado para controlar o carregamento
  const [loading, setLoading] = useState(false)

  async function handleForgot(e) {
    e.preventDefault()

    // 2. Iniciamos o loading antes da requisição
    setLoading(true)
    setMsg("") // Limpa mensagens antigas

    try {
      const response = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMsg("Se o email existir, um link foi enviado.")
      } else {
        setMsg("Erro ao solicitar redefinição.")
      }
    } catch (error) {
      setMsg("Erro de conexão. Tente novamente.")
    } finally {
      // 3. O finally garante que o loading pare, dando erro ou sucesso
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <form
        onSubmit={handleForgot}
        className="bg-slate-950 p-8 rounded-xl w-96 border border-slate-800" // Adicionei uma borda sutil para destacar do fundo
      >
        <h2 className="text-2xl mb-6 text-yellow-400 font-bold">
          Esqueci minha senha
        </h2>

        <input
          type="email"
          placeholder="Seu email"
          // Desabilita o input enquanto carrega
          disabled={loading}
          className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button 
          // Desabilita o botão enquanto carrega
          disabled={loading}
          className={`w-full p-3 rounded font-bold transition-all flex justify-center items-center ${
            loading 
              ? "bg-red-800 cursor-not-allowed" // Cor quando está carregando
              : "bg-red-600 hover:bg-red-700 text-white" // Cor normal (mudei o texto para branco para ler melhor)
          }`}
        >
          {loading ? (
            // 4. Aqui está o Spinner usando Tailwind (SVG + animate-spin)
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Enviar link"
          )}
        </button>

        {msg && <p className="mt-4 text-center text-sm text-gray-300">{msg}</p>}
      </form>
    </div>
  )
}