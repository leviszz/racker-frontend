import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import PrivateRoute from "./components/privateRoute"
import Scan from "./pages/scan"
import CreateUser from "./pages/createUser"
import ResetPassword from "./pages/resetPassword"
import ForgotPassword from "./pages/forgotPassword.jsx"
import HeaderSimple from "./pages/head"

// Importe seus componentes de layout
import Header from "./pages/header.jsx" 
import Footer from "./pages/footer.jsx"

export default function App() {
  return (
    <BrowserRouter>
      {/* A div abaixo é o segredo:
        1. min-h-screen: Garante que o app ocupe toda a altura da tela.
        2. flex-col: Empilha Header, Conteúdo e Footer.
      */}
      <div className="min-h-screen flex flex-col bg-[#060b1a]">
        
        <Routes>
          {/* Rotas que NÃO precisam de Header/Footer (como o Login) */}
          <Route path="/" element={
            <div>
            <main className="flex-1">
              <Login />
            </main>
            <Footer />
            </div>
          } />

          {/* Rotas que PRECISAM de estrutura (Scan, Dashboard, etc) */}
          <Route
            path="/scan"
            element={
              <PrivateRoute>
                <Header /> 
                {/* flex-1 faz este conteúdo "empurrar" o footer para baixo */}
                <main className="flex-1">
                  <Scan />
                </main>
                <Footer />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-user"
            element={
              <div className="flex-1 flex items-center justify-center">
                <CreateUser />
              </div>
            }
          />

          <Route path="/reset-password" element={
            
            <div>
              <div>
                <ResetPassword />
              </div>
              <Footer />
              
            </div>
            
            } />


          <Route path="/forgot-password" element={
            <div>
              <div>
                <ForgotPassword />
              </div>
              <Footer />
              
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}