import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import PrivateRoute from "./components/privateRoute"
import Scan from "./pages/scan"
import CreateUser from "./pages/createUser"
import ResetPassword from "./pages/resetPassword"
import ForgotPassword from "./pages/forgotPassword.jsx"
import HeaderSimple from "./pages/head"

// 1. IMPORTANTE: Importe o componente que criamos no passo anterior
import DashboardAdmin from "./pages/DashboardAdmin" 

import Header from "./pages/header.jsx" 
import Footer from "./pages/footer.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#060b1a]">
        
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <Login />
              </main>
              <Footer />
            </div>
          } />

          {/* SCAN (Protegido) */}
          <Route
            path="/scan"
            element={
              <PrivateRoute>
                <Header /> 
                <main className="flex-1">
                  <Scan />
                </main>
                <Footer />
              </PrivateRoute>
            }
          />

          {/* NOVO: DASHBOARD ADMIN (Protegido) */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <Header /> 
                <main className="flex-1">
                  <DashboardAdmin />
                </main>
                <Footer />
              </PrivateRoute>
            }
          />

          {/* CREATE USER */}
          <Route
            path="/create-user"
            element={
              <div className="flex-1 flex items-center justify-center">
                <CreateUser />
              </div>
            }
          />

          {/* RESET PASSWORD */}
          <Route path="/reset-password" element={
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <ResetPassword />
              </main>
              <Footer />
            </div>
          } />

          {/* FORGOT PASSWORD */}
          <Route path="/forgot-password" element={
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <ForgotPassword />
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}