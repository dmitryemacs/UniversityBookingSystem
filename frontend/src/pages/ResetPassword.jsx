import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false,
  });

  useEffect(() => {
    if (!token) {
      toast.error('Неверная ссылка для сброса');
      navigate('/forgot-password');
      return;
    }

    authService.validateResetToken(token)
      .then((response) => {
        if (response.data) {
          setTokenValid(true);
        } else {
          toast.error('Ссылка для сброса недействительна или истекла');
          setTimeout(() => navigate('/forgot-password'), 2000);
        }
      })
      .catch(() => {
        toast.error('Неверная ссылка для сброса');
        setTimeout(() => navigate('/forgot-password'), 2000);
      })
      .finally(() => {
        setValidating(false);
      });
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[@#$%^&+=!]/.test(password),
    };
  };

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthLabel = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return { text: 'Слабый', color: '#ef4444' };
    if (score <= 4) return { text: 'Средний', color: '#f59e0b' };
    return { text: 'Надёжный', color: '#10b981' };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    if (e.target.name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    const strength = checkPasswordStrength(formData.newPassword);
    if (!Object.values(strength).every(Boolean)) {
      toast.error('Пароль не соответствует требованиям');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.newPassword);
      toast.success('Пароль успешно сброшен! Пожалуйста, войдите.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Не удалось сбросить пароль');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-container" style={{ minHeight: '200px' }}>
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return null;
  }

  const strengthLabel = getPasswordStrengthLabel();
  const strengthScore = getPasswordStrengthScore();

  const RequirementItem = ({ met, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: met ? '#10b981' : '#64748b' }}>
      {met ? <FiCheck size={14} /> : <FiX size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiLock />
          </div>
          <h1 className="auth-title">Сброс пароля</h1>
          <p className="auth-subtitle">Придумайте новый надёжный пароль</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Новый пароль
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                className="form-input"
                placeholder="Придумайте новый пароль"
                value={formData.newPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
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

            {formData.newPassword && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Надёжность пароля</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: strengthLabel.color }}>{strengthLabel.text}</span>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strengthScore / 5) * 100}%`,
                      background: strengthLabel.color,
                      transition: 'width 0.3s, background 0.3s',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <RequirementItem met={passwordStrength.length} text="8+ символов" />
                  <RequirementItem met={passwordStrength.lowercase} text="Строчная буква" />
                  <RequirementItem met={passwordStrength.uppercase} text="Заглавная буква" />
                  <RequirementItem met={passwordStrength.digit} text="Цифра" />
                  <RequirementItem met={passwordStrength.special} text="Спецсимвол" />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Подтверждение нового пароля</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Подтвердите новый пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
                Пароли не совпадают
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || strengthScore < 5 || formData.newPassword !== formData.confirmPassword}
          >
            {loading ? 'Сброс...' : 'Сбросить пароль'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Назад ко входу</Link>
        </div>
      </div>
    </div>
  );
}
