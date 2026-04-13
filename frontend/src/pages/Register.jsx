import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUserPlus, FiUser, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false,
  });

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
    if (score <= 2) return { text: 'Слабый', color: 'var(--danger)' };
    if (score <= 4) return { text: 'Средний', color: 'var(--warning)' };
    return { text: 'Надёжный', color: 'var(--success)' };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    if (e.target.name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    const strength = checkPasswordStrength(formData.password);
    if (!Object.values(strength).every(Boolean)) {
      toast.error('Пароль не соответствует требованиям');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        toast.success('Аккаунт успешно создан!');
        navigate('/');
      } else {
        toast.error(result.message || 'Ошибка регистрации');
      }
    } catch (error) {
      const errors = error.response?.data?.data;
      if (errors) {
        Object.values(errors).forEach(msg => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Произошла ошибка при регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = getPasswordStrengthLabel();
  const strengthScore = getPasswordStrengthScore();

  const RequirementItem = ({ met, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: met ? 'var(--success)' : 'var(--gray)' }}>
      {met ? <FiCheck size={14} /> : <FiX size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiUserPlus />
          </div>
          <h1 className="auth-title">Создать аккаунт</h1>
          <p className="auth-subtitle">Зарегистрируйтесь для бронирования оборудования</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FiUser style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Имя пользователя
            </label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Придумайте имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              pattern="[a-zA-Z0-9_]+"
              title="Имя пользователя может содержать только буквы, цифры и подчёркивания"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiBriefcase style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Кафедра / Факультет
            </label>
            <input
              type="text"
              name="department"
              className="form-input"
              placeholder="например, Информатика"
              value={formData.department}
              onChange={handleChange}
              required
              autoComplete="organization"
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
                placeholder="Придумайте пароль"
                value={formData.password}
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
                  color: 'var(--gray)',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {formData.password && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--light)', borderRadius: '8px', color: 'var(--dark)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Надёжность пароля</span>
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
            <label className="form-label">Подтверждение пароля</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Подтвердите пароль"
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
                  color: 'var(--gray)',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--danger)' }}>
                Пароли не совпадают
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || strengthScore < 5 || formData.password !== formData.confirmPassword}
          >
            {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}
