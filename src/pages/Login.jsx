import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from "../hooks/useForm"; // ✅ Correcto
import { loginSchema } from '../schemas/authSchemas';

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={{ color: 'var(--accent)', fontSize: '.73rem', marginTop: '.3rem' }}>{msg}</p>;
}

export default function Login() {
  const navigate           = useNavigate();
  const { login, loading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '', remember: false },
    loginSchema
  );

  const onSubmit = async (vals) => {
    setApiError('');
    const result = await login({ email: vals.email, password: vals.password });
    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="login-page">
      {/* Mini Navbar */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'transparent', padding: '1.25rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>
          Athenaeum
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/"         style={{ color: 'rgba(255,255,255,.75)', fontSize: '.875rem' }}>Home</Link>
          <Link to="/login"    style={{ color: '#fff', fontWeight: 700, fontSize: '.875rem', borderBottom: '2px solid #fff', paddingBottom: '2px' }}>Login</Link>
          <Link to="/register" style={{ color: 'rgba(255,255,255,.75)', fontSize: '.875rem' }}>Register</Link>
        </div>
      </nav>

      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">Sign in to access your library account</p>

        {/* Error de la API */}
        {apiError && (
          <div style={{
            background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 'var(--radius-sm)',
            padding: '.75rem 1rem', fontSize: '.82rem', color: '#c53030', marginBottom: '1rem',
          }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <label className="form-label-ath">Email or Username</label>
          <div className="input-icon-wrap">
            <span className="icon">✉</span>
            <input
              className="ath-input"
              type="text"
              name="email"
              placeholder="librarian@athenaeum.edu"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FieldError msg={touched.email && errors.email} />
          </div>

          {/* Password */}
          <div className="form-label-row" style={{ marginBottom: '.4rem' }}>
            <label className="form-label-ath" style={{ margin: 0 }}>Password</label>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>
          <div className="input-icon-wrap" style={{ position: 'relative' }}>
            <span className="icon">🔒</span>
            <input
              className="ath-input"
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{
              position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '.85rem', color: 'var(--text-light)',
            }}>
              {showPass ? '🙈' : '👁'}
            </button>
            <FieldError msg={touched.password && errors.password} />
          </div>

          {/* Remember */}
          <label className="check-label">
            <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} />
            Keep me logged in for 30 days
          </label>

          <button type="submit" className="btn-signin" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="or-divider">or continue with</div>
        <div className="social-btns">
          <button className="btn-social">🎓 University ID</button>
          <button className="btn-social">🏛 ORCID</button>
        </div>

        <p className="register-prompt">
          Don't have an account yet?&nbsp;
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}