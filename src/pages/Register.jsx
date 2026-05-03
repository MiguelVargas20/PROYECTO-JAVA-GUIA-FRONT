import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from "../hooks/useForm"; // ✅ Correcto: Apunta a hooks
import { registerSchema } from '../schemas/authSchemas';

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={{ color: 'var(--accent)', fontSize: '.73rem', marginTop: '.3rem' }}>{msg}</p>;
}

export default function Register() {
  const navigate              = useNavigate();
  const { register, loading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { fullName: '', email: '', password: '', confirmPassword: '', libraryCard: '', terms: false },
    registerSchema
  );

  const onSubmit = async (vals) => {
    setApiError('');
    const result = await register(vals);
    if (result.success) {
      navigate('/login');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="register-page">
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '0 2rem', height: '62px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 100,
      }}>
        <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--navy)' }}>
          Athenaeum
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/"         style={{ color: 'var(--text-mid)', fontSize: '.875rem' }}>Home</Link>
          <Link to="/login"    style={{ color: 'var(--text-mid)', fontSize: '.875rem' }}>Login</Link>
          <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '.875rem', borderBottom: '2px solid var(--navy)', paddingBottom: '2px' }}>Register</Link>
        </div>
      </nav>

      <div className="register-wrapper" style={{ marginTop: '62px' }}>
        {/* Sidebar decorativo */}
        <div className="register-sidebar">
          <div className="sidebar-content">
            <span className="sidebar-tag">New Membership</span>
            <p className="sidebar-quote">
              "Knowledge is a treasure, but practice is the key to it."
            </p>
            <p className="sidebar-desc">
              Join our scholarly community and unlock access to thousands of rare manuscripts and modern archives.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="register-form-area">
          <h2 className="register-title">Create your account</h2>
          <p className="register-sub">Enter your details to register as a library member.</p>

          {apiError && (
            <div style={{
              background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 'var(--radius-sm)',
              padding: '.75rem 1rem', fontSize: '.82rem', color: '#c53030', marginBottom: '1rem',
            }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <label className="form-label-ath">Full Name</label>
            <div className="input-icon-wrap">
              <span className="icon">👤</span>
              <input className="ath-input" type="text" name="fullName"
                placeholder="Johnathan Doe" value={values.fullName}
                onChange={handleChange} onBlur={handleBlur} />
              <FieldError msg={touched.fullName && errors.fullName} />
            </div>

            {/* Email */}
            <label className="form-label-ath">Email Address</label>
            <div className="input-icon-wrap">
              <span className="icon">✉</span>
              <input className="ath-input" type="email" name="email"
                placeholder="name@athenaeum.edu" value={values.email}
                onChange={handleChange} onBlur={handleBlur} />
              <FieldError msg={touched.email && errors.email} />
            </div>

            {/* Password row */}
            <div className="form-row">
              <div>
                <label className="form-label-ath">Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', fontSize: '.9rem', pointerEvents: 'none' }}>🔒</span>
                  <input className="ath-input" type={showPass ? 'text' : 'password'} name="password"
                    placeholder="••••••••" value={values.password}
                    onChange={handleChange} onBlur={handleBlur} />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem', color: 'var(--text-light)' }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                <FieldError msg={touched.password && errors.password} />
              </div>
              <div>
                <label className="form-label-ath">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', fontSize: '.9rem', pointerEvents: 'none' }}>🔒</span>
                  <input className="ath-input" type={showPass ? 'text' : 'password'} name="confirmPassword"
                    placeholder="••••••••" value={values.confirmPassword}
                    onChange={handleChange} onBlur={handleBlur} />
                </div>
                <FieldError msg={touched.confirmPassword && errors.confirmPassword} />
              </div>
            </div>

            {/* Library Card */}
            <label className="form-label-ath" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              Library Card Number
              <span style={{ fontSize: '.7rem', color: 'var(--text-light)', fontWeight: 400 }}>OPTIONAL</span>
            </label>
            <div className="input-icon-wrap">
              <span className="icon">🏛</span>
              <input className="ath-input" type="text" name="libraryCard"
                placeholder="LIB-0000-0000" value={values.libraryCard}
                onChange={handleChange} onBlur={handleBlur} />
              <FieldError msg={touched.libraryCard && errors.libraryCard} />
            </div>

            {/* Terms */}
            <label className="terms-check">
              <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} />
              <span>
                I agree to the&nbsp;<Link to="#" style={{ color: 'var(--accent)', fontWeight: 700 }}>Terms of Service</Link>
                &nbsp;and&nbsp;<Link to="#" style={{ color: 'var(--accent)', fontWeight: 700 }}>Privacy Policy</Link>.
              </span>
            </label>
            <FieldError msg={touched.terms && errors.terms} />

            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="login-prompt">
            Already have an account?&nbsp;
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}