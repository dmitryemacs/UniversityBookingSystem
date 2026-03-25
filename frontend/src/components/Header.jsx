import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiCalendar, FiSettings, FiLogOut, FiUsers, FiInfo, FiMail } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">📦</div>
          <span>Бронирование Университетского Оборудования</span>
        </Link>

        <nav>
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                <FiHome /> Главная
              </Link>
            </li>
            <li>
              <Link to="/equipment" className="nav-link">
                <FiGrid /> Оборудование
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                <FiInfo /> О проекте
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="nav-link">
                <FiMail /> Контакты
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/my-bookings" className="nav-link">
                    <FiCalendar /> Мои бронирования
                  </Link>
                </li>
                {user.role === 'ADMIN' && (
                  <>
                    <li>
                      <Link to="/admin" className="nav-link">
                        <FiSettings /> Админ
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/users" className="nav-link">
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
