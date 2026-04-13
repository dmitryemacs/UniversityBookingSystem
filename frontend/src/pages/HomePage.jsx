import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import Header from '../components/Header';
import { FiGrid, FiCalendar, FiCheckCircle, FiClock, FiMapPin, FiUsers, FiArrowRight,
         FiShield, FiZap, FiSmile, FiBook, FiAward, FiHeadphones } from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    myBookings: 0,
    pendingBookings: 0,
  });
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    try {
      const [equipmentData, bookingsData] = await Promise.all([
        equipmentService.getAll(),
        user ? bookingService.getUserBookings().catch(() => ({ data: [] })) : null,
      ]);

      const allEquipment = equipmentData.data || [];
      const myBookings = bookingsData?.data || [];

      setStats({
        totalEquipment: allEquipment.length,
        availableEquipment: allEquipment.filter(e => e.status === 'AVAILABLE').length,
        myBookings: myBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length,
        pendingBookings: myBookings.filter(b => b.status === 'PENDING').length,
      });

      setRecentEquipment(allEquipment.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const features = [
    {
      icon: <FiGrid size={32} />,
      title: 'Современное оборудование',
      description: 'Доступ к новейшим лабораторным устройствам, компьютерам и исследовательскому оборудованию',
    },
    {
      icon: <FiCalendar size={32} />,
      title: 'Простое бронирование',
      description: 'Интуитивная система бронирования с проверкой доступности в реальном времени',
    },
    {
      icon: <FiClock size={32} />,
      title: 'Гибкий график',
      description: 'Бронируйте оборудование на часы, дни или недели в соответствии с вашими потребностями',
    },
    {
      icon: <FiShield size={32} />,
      title: 'Безопасность и надёжность',
      description: 'Ваши бронирования защищены с подтверждением и отслеживанием статуса',
    },
    {
      icon: <FiZap size={32} />,
      title: 'Быстрое подтверждение',
      description: 'Процесс быстрого подтверждения с уведомлениями об обновлении статуса',
    },
    {
      icon: <FiSmile size={32} />,
      title: 'Удобство использования',
      description: 'Интуитивный интерфейс, разработанный для студентов, преподавателей и исследователей',
    },
  ];

  const benefits = [
    { icon: <FiBook />, text: 'Доступно для всех сотрудников университета' },
    { icon: <FiAward />, text: 'Высококачественное обслуживаемое оборудование' },
    { icon: <FiUsers />, text: 'Поддержка совместных исследований' },
    { icon: <FiHeadphones />, text: 'Доступна техническая поддержка' },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section for Guests */}
      {!user && (
        <section className="hero">
          <div className="container">
            <h1 className="hero__title">
              Бронирование Университетского Оборудования
            </h1>
            <p className="hero__subtitle">
              Бронируйте лабораторное оборудование, компьютеры, проекторы и многое другое с лёгкостью.
            </p>
            <div className="hero__actions">
              <Link to="/register" className="btn btn--lg btn--white">
                Начать работу <FiArrowRight className="btn__icon" />
              </Link>
              <Link to="/equipment" className="btn btn--lg btn--white-outline">
                Смотреть оборудование
              </Link>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-value">{stats.totalEquipment}</div>
                <div className="hero__stat-label">Всего оборудования</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-value hero__stat-value--green">{stats.availableEquipment}</div>
                <div className="hero__stat-label">Доступно сейчас</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-value hero__stat-value--orange">24/7</div>
                <div className="hero__stat-label">Онлайн доступ</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-value hero__stat-value--cyan">100+</div>
                <div className="hero__stat-label">Довольных пользователей</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard for Authenticated Users */}
      {user && (
        <div className="page">
          <div className="container">
            <div className="page-header">
              <h1 className="page-title">
                С возвращением, {user.username}! 👋
              </h1>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalEquipment}</div>
                <div className="stat-label">
                  <FiGrid className="stat-icon" />
                  Всего оборудования
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value stat-value--success">
                  {stats.availableEquipment}
                </div>
                <div className="stat-label">
                  <FiCheckCircle className="stat-icon" />
                  Доступно
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value stat-value--info">
                  {stats.myBookings}
                </div>
                <div className="stat-label">
                  <FiCalendar className="stat-icon" />
                  Мои бронирования
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value stat-value--warning">
                  {stats.pendingBookings}
                </div>
                <div className="stat-label">
                  <FiClock className="stat-icon" />
                  Ожидают
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card card--actions">
              <h2 className="card__title">Быстрые действия</h2>
              <div className="quick-actions">
                <Link to="/equipment" className="btn btn-primary">
                  <FiGrid /> Смотреть оборудование
                </Link>
                <Link to="/bookings/create" className="btn btn-success">
                  <FiCalendar /> Создать бронирование
                </Link>
                <Link to="/my-bookings" className="btn btn-secondary">
                  <FiCalendar /> Мои бронирования
                </Link>
              </div>
            </div>

            {/* Recent Equipment */}
            <div className="recent-section">
              <h2 className="section-heading section-heading--light">
                Доступное оборудование
              </h2>
              {loading ? (
                <div className="loading-container" style={{ minHeight: '200px' }}>
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="grid grid-4">
                  {recentEquipment.map((equipment) => (
                    <Link
                      to={`/equipment/${equipment.id}`}
                      key={equipment.id}
                      className="equipment-link"
                    >
                      <div className="equipment-card">
                        <div className="equipment-image">📦</div>
                        <div className="equipment-content">
                          <h3 className="equipment-name">{equipment.name}</h3>
                          <p className="equipment-description">
                            {equipment.description?.substring(0, 80)}...
                          </p>
                          <div className="equipment-meta">
                            <span className="equipment-location">
                              <FiMapPin /> {equipment.location}
                            </span>
                            <span className="equipment-capacity">
                              <FiUsers /> {equipment.capacity}
                            </span>
                          </div>
                          <div className="equipment-status">
                            <span
                              className={`badge ${
                                equipment.status === 'AVAILABLE'
                                  ? 'badge-success'
                                  : equipment.status === 'BOOKED'
                                  ? 'badge-warning'
                                  : 'badge-danger'
                              }`}
                            >
                              {equipment.status === 'AVAILABLE' ? 'Доступно' : equipment.status === 'BOOKED' ? 'Забронировано' : 'Недоступно'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features__header">
            <h2 className="section-title">Почему выбирают нашу систему бронирования?</h2>
            <p className="section-subtitle">
              Всё необходимое для быстрого и эффективного бронирования университетского оборудования
            </p>
          </div>

          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card feature-card">
                <div className="feature-icon-box">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="benefits">
            <div className="benefits__grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">{benefit.icon}</span>
                  <span className="benefit-text">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta">
          <div className="container">
            <h2 className="cta__title">Готовы начать?</h2>
            <p className="cta__subtitle">
              Присоединяйтесь к университетскому сообществу и начните бронировать оборудование уже сегодня
            </p>
            <div className="cta__actions">
              <Link to="/register" className="btn btn--lg btn--white">
                Создать аккаунт
              </Link>
              <Link to="/login" className="btn btn--lg btn--white-outline">
                Уже есть аккаунт?
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
