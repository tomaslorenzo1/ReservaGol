import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RegistroJugador from './pages/RegistroJugador';
import RegistroPropietario from './pages/RegistroPropietario';
import DashboardJugador from './pages/DashboardJugador';
import DashboardPropietario from './pages/DashboardPropietario';
import DashboardAdmin from './pages/DashboardAdmin';
import Reservar from './pages/Reservar';
import MisTurnos from './pages/MisTurnos';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro-jugador" element={<RegistroJugador />} />
            <Route path="/registro-propietario" element={<RegistroPropietario />} />
            
            {/* Rutas protegidas */}
            <Route path="/reservar" element={
              <ProtectedRoute>
                <Reservar />
              </ProtectedRoute>
            } />
            
            <Route path="/mis-turnos" element={
              <ProtectedRoute>
                <MisTurnos />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard-jugador" element={
              <ProtectedRoute allowedRoles={['jugador']}>
                <DashboardJugador />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard-propietario" element={
              <ProtectedRoute allowedRoles={['propietario']}>
                <DashboardPropietario />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard-admin" element={
              <ProtectedRoute allowedRoles={['admin', 'administrador']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;