import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

console.log('Componente Login cargado'); // Debug

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Esperar para que se complete el guardado
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Usuario completo:', user);
        console.log('Todas las propiedades:', Object.keys(user));
        
        const tipo = user.tipo || 'jugador';
        console.log('Tipo final:', tipo);
        
        switch (tipo) {
          case 'jugador':
            console.log('→ Navegando a Dashboard Jugador');
            navigate('/dashboard-jugador');
            break;
          case 'propietario':
            console.log('→ Navegando a Dashboard Propietario');
            navigate('/dashboard-propietario');
            break;
          case 'admin':
          case 'administrador':
            console.log('→ Navegando a Dashboard Admin');
            navigate('/dashboard-admin');
            break;
          default:
            console.log('→ Navegando a Home (tipo:', tipo, ')');
            navigate('/');
        }
      }, 300);
      
    } catch (error: any) {
      console.error('Error de login:', error); // Debug
      setError(error.response?.data?.error || error.message || 'Error al iniciar sesión. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container" style={{ 
        background: 'var(--bg-card)', 
        padding: '3rem', 
        borderRadius: '16px', 
        width: '100%', 
        maxWidth: '400px',
        border: '1px solid var(--border-color)'
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo.png" alt="ReservaGol" className="logo" style={{ height: '60px', marginBottom: '1rem' }} />
          <h1>Bienvenido a <span className="text-neon">ReservaGol</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Inicia sesión para acceder a tu cuenta</p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <i className="fas fa-envelope" style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }}></i>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <i className="fas fa-lock" style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }}></i>
              <button
                type="button"
                onClick={togglePassword}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>o</span>
        </div>

        <div className="register-links">
          <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            ¿No tienes una cuenta?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/registro-jugador" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fas fa-futbol"></i>
              Registrarme como Jugador
            </Link>
            <Link to="/registro-propietario" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fas fa-building"></i>
              Registrar mi Predio
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;