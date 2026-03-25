import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Ссылка для сброса пароля отправлена на ваш email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Не удалось отправить ссылку');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FiMail />
            </div>
            <h1 className="auth-title">Проверьте вашу почту</h1>
            <p className="auth-subtitle">
              Мы отправили ссылку для сброса пароля на <strong>{email}</strong>
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#f0fdf4', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #bbf7d0'
          }}>
            <p style={{ fontSize: '14px', color: '#166534', margin: 0 }}>
              Не получили письмо? Проверьте папку спам или попробуйте другой email.
            </p>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="btn btn-primary btn-block"
          >
            Попробовать другой Email
          </button>

          <div className="auth-footer">
            <Link to="/login">
              <FiArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Назад ко входу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiMail />
          </div>
          <h1 className="auth-title">Забыли пароль?</h1>
          <p className="auth-subtitle">
            Не переживайте! Введите ваш email и мы отправим инструкцию по сбросу.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Email адрес
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">
            <FiArrowLeft style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Назад ко входу
          </Link>
        </div>
      </div>
    </div>
  );
}
