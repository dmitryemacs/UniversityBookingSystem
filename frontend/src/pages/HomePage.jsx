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
        user ? bookingService.getUserBookings(user.id).catch(() => ({ data: [] })) : null,
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
        <section className="hero-section" style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          textAlign: 'center',
          color: 'white',
        }}>
          <div className="container">
            <h1 className="hero-title" style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Бронирование Университетского Оборудования
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '20px', marginBottom: '40px', opacity: '0.9', maxWidth: '600px', margin: '0 auto 40px' }}>
              Бронируйте лабораторное оборудование, компьютеры, проекторы и многое другое с лёгкостью.
            </p>
            <div className="quick-actions" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn" style={{
                background: 'white',
                color: 'var(--primary)',
                fontSize: '16px',
                padding: '14px 32px',
                fontWeight: '600',
              }}>
                Начать работу <FiArrowRight style={{ marginLeft: '8px' }} />
              </Link>
              <Link to="/equipment" className="btn" style={{
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                fontSize: '16px',
                padding: '14px 32px',
                fontWeight: '600',
              }}>
                Смотреть оборудование
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="hero-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '24px',
              maxWidth: '800px',
              margin: '60px auto 0',
              padding: '32px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
            }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.totalEquipment}</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Всего оборудования</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#10b981' }}>{stats.availableEquipment}</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Доступно сейчас</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#f59e0b' }}>24/7</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Онлайн доступ</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#06b6d4' }}>100+</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Довольных пользователей</div>
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
                  <FiGrid style={{ display: 'inline', marginRight: '6px' }} />
                  Всего оборудования
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  {stats.availableEquipment}
                </div>
                <div className="stat-label">
                  <FiCheckCircle style={{ display: 'inline', marginRight: '6px' }} />
                  Доступно
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                  {stats.myBookings}
                </div>
                <div className="stat-label">
                  <FiCalendar style={{ display: 'inline', marginRight: '6px' }} />
                  Мои бронирования
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--warning)' }}>
                  {stats.pendingBookings}
                </div>
                <div className="stat-label">
                  <FiClock style={{ display: 'inline', marginRight: '6px' }} />
                  Ожидают
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '32px' }}>
              <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Быстрые действия</h2>
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
            <div>
              <h2 style={{ marginBottom: '20px', fontSize: '18px', color: 'white' }}>
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
                      style={{ textDecoration: 'none' }}
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
                          <div style={{ marginTop: '12px' }}>
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
      <section style={{
        padding: '80px 20px',
        background: 'white',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
              Почему выбирают нашу систему бронирования?
            </h2>
            <p className="section-subtitle" style={{ fontSize: '18px', color: 'var(--gray)', maxWidth: '600px', margin: '0 auto' }}>
              Всё необходимое для быстрого и эффективного бронирования
            </p>
          </div>

          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card feature-card" style={{
                textAlign: 'center',
                padding: '32px 24px',
              }}>
                <div className="feature-icon" style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--dark)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="benefits-section" style={{
            marginTop: '60px',
            padding: '40px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '16px',
          }}>
            <div className="benefits-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    color: 'var(--primary)',
                    fontSize: '24px',
                  }}>
                    {benefit.icon}
                  </div>
                  <span style={{ fontWeight: '500', color: 'var(--dark)' }}>
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section" style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          textAlign: 'center',
        }}>
          <div className="container">
            <h2 className="cta-title" style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
              Готовы начать?
            </h2>
            <p className="cta-subtitle" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Присоединяйтесь к университетскому сообществу и начните бронировать оборудование уже сегодня
            </p>
            <div className="quick-actions" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn" style={{
                background: 'white',
                color: 'var(--primary)',
                fontSize: '16px',
                padding: '14px 32px',
                fontWeight: '600',
              }}>
                Создать аккаунт
              </Link>
              <Link to="/login" className="btn" style={{
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                fontSize: '16px',
                padding: '14px 32px',
                fontWeight: '600',
              }}>
                Уже есть аккаунт?
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
