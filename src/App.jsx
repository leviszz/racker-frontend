import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import PrivateRoute from "./components/privateRoute"
import Scan from "./pages/scan"
import CreateUser from "./pages/createUser"
import ResetPassword from "./pages/resetPassword"
import ForgotPassword from "./pages/forgotPassword.jsx"




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
  path="/scan"
  element={
    <PrivateRoute>
      <Scan />
    </PrivateRoute>
  }
/>

<Route
  path="/create-user"
  element={
    
      <CreateUser />
    
  }
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route path="/forgot-password" element={<ForgotPassword />} />



      </Routes>
    </BrowserRouter>
  )
}
