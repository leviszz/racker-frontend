import { useState } from "react"

export default function CreateUser() {
  const [email, setEmail] = useState("")
  const [adminSecret, setAdminSecret] = useState("")
  const [msg, setMsg] = useState("")
  // 1. Estado de carregamento
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()

    // 2. Inicia o loading
    setLoading(true)
    setMsg("")

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          admin_secret: adminSecret,
        }),
      })

      if (response.ok) {
        setMsg("Usuário criado com sucesso. Email enviado.")
        // Opcional: limpar campos após sucesso
        setEmail("")
      } else {
        setMsg("Erro ao criar usuário. Verifique as credenciais.")
      }
    } catch (error) {
      setMsg("Erro de conexão com o servidor.")
    } finally {
      // 3. Finaliza o loading
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <form
        onSubmit={handleCreate}
        className="bg-slate-900 p-8 rounded-xl w-96 border border-slate-800 shadow-xl"
      >
        <h2 className="text-2xl mb-6 text-yellow-400 font-bold">Criar Usuário</h2>

        <input
          type="email"
          placeholder="Email do usuário"
          value={email}
          // Desabilita durante o loading
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 disabled:opacity-50 transition"
        />

        <input
          type="text"
          placeholder="Admin Secret"
          value={adminSecret}
          // Desabilita durante o loading
          disabled={loading}
          onChange={(e) => setAdminSecret(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 disabled:opacity-50 transition"
        />

        <button 
          disabled={loading}
          className={`w-full p-2 rounded font-bold transition-all flex justify-center items-center ${
            loading 
              ? "bg-yellow-600 cursor-not-allowed" 
              : "bg-yellow-500 hover:bg-yellow-400 text-white"
          }`}
        >
          {loading ? (
            // Spinner (cor escura para contraste com amarelo)
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Criar"
          )}
        </button>

        {msg && <p className="mt-4 text-center text-sm text-gray-300">{msg}</p>}
      </form>
    </div>
  )
}