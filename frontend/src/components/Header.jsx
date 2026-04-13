import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiCalendar, FiSettings, FiLogOut, FiUsers, FiInfo, FiMail, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleNavClick}>
          <div className="logo-icon">📦</div>
          <span>Бронирование</span>
        </Link>

        <button
          className="header-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav>
          <ul className={`nav-menu ${mobileMenuOpen ? 'nav-menu--open' : ''}`}>
            <li>
              <Link to="/" className="nav-link" onClick={handleNavClick}>
                <FiHome /> Главная
              </Link>
            </li>
            <li>
              <Link to="/equipment" className="nav-link" onClick={handleNavClick}>
                <FiGrid /> Оборудование
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" onClick={handleNavClick}>
                <FiInfo /> О проекте
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="nav-link" onClick={handleNavClick}>
                <FiMail /> Контакты
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/my-bookings" className="nav-link" onClick={handleNavClick}>
                    <FiCalendar /> Мои бронирования
                  </Link>
                </li>
                {user.role === 'ADMIN' && (
                  <>
                    <li>
                      <Link to="/admin" className="nav-link" onClick={handleNavClick}>
                        <FiSettings /> Админ
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/users" className="nav-link" onClick={handleNavClick}>
                        <FiUsers /> Пользователи
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-role">{user.role === 'ADMIN' ? 'Администратор' : user.role === 'PROFESSOR' ? 'Преподаватель' : 'Студент'}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <FiLogOut /> Выйти
            </button>
          </div>
        ) : (
          <div className="user-menu">
            <Link to="/login" className="btn btn-outline btn-sm">
              Войти
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
