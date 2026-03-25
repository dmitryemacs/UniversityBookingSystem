import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        toast.success('С возвращением!');
        navigate('/');
      } else {
        toast.error(result.message || 'Ошибка входа');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiLogIn />
          </div>
          <h1 className="auth-title">С возвращением!</h1>
          <p className="auth-subtitle">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Имя пользователя
            </label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Введите имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Пароль
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '13px', textDecoration: 'none' }}>
                Забыли пароль?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
          <strong>Тестовые аккаунты:</strong><br />
          <code style={{ display: 'block', marginTop: '8px', padding: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
            admin / password
          </code>
          <code style={{ display: 'block', marginTop: '4px', padding: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
            student1 / password
          </code>
          <code style={{ display: 'block', marginTop: '4px', padding: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
            professor1 / password
          </code>
        </div>
      </div>
    </div>
  );
}
