import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import { FiUsers, FiGrid, FiCalendar, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEquipment: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [equipmentData, bookingsData] = await Promise.all([
        equipmentService.getAll(),
        bookingService.getAll(),
      ]);

      const allEquipment = equipmentData.data || [];
      const allBookings = bookingsData.data || [];

      setStats({
        totalUsers: 3, // This would come from a users API
        totalEquipment: allEquipment.length,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'PENDING').length,
      });

      setRecentBookings(allBookings.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (bookingId, status) => {
    const reason = status === 'REJECTED' ? prompt('Введите причину отклонения:') : null;
    if (status === 'REJECTED' && !reason) return;

    try {
      await bookingService.updateStatus(bookingId, status, reason);
      loadDashboardData();
    } catch (error) {
      alert('Не удалось обновить статус');
    }
  };

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Панель администратора</h1>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">
                <FiUsers style={{ display: 'inline', marginRight: '6px' }} />
                Пользователей
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalEquipment}</div>
              <div className="stat-label">
                <FiGrid style={{ display: 'inline', marginRight: '6px' }} />
                Оборудования
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">
                <FiCalendar style={{ display: 'inline', marginRight: '6px' }} />
                Всего бронирований
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--warning)' }}>
                {stats.pendingBookings}
              </div>
              <div className="stat-label">
                <FiClock style={{ display: 'inline', marginRight: '6px' }} />
                Ожидают подтверждения
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Управление</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/admin/users" className="btn btn-primary">
                <FiUsers /> Управление пользователями
              </Link>
              <Link to="/equipment" className="btn btn-secondary">
                <FiGrid /> Смотреть оборудование
              </Link>
              <Link to="/bookings/create" className="btn btn-secondary">
                <FiCalendar /> Создать бронирование
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>
              <FiClock style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Последние бронирования
            </h2>

            {loading ? (
              <div className="loading-container" style={{ minHeight: '200px' }}>
                <div className="spinner"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-title">Пока нет бронирований</div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table table-responsive-card">
                  <thead>
                    <tr>
                      <th>Пользователь</th>
                      <th>Оборудование</th>
                      <th>Начало</th>
                      <th>Окончание</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td data-label="Пользователь">{booking.username}</td>
                        <td data-label="Оборудование">{booking.equipmentName}</td>
                        <td data-label="Начало">{new Date(booking.startTime).toLocaleDateString('ru-RU')}</td>
                        <td data-label="Окончание">{new Date(booking.endTime).toLocaleDateString('ru-RU')}</td>
                        <td data-label="Статус">
                          <span
                            className={`badge ${
                              booking.status === 'CONFIRMED'
                                ? 'badge-success'
                                : booking.status === 'PENDING'
                                ? 'badge-warning'
                                : booking.status === 'CANCELLED'
                                ? 'badge-danger'
                                : 'badge-info'
                            }`}
                          >
                            {booking.status === 'CONFIRMED' ? 'Подтверждено' : booking.status === 'PENDING' ? 'Ожидает' : booking.status === 'CANCELLED' ? 'Отменено' : booking.status}
                          </span>
                        </td>
                        <td data-label="">
                          <div className="table-actions">
                            {booking.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                  className="btn btn-success btn-sm"
                                >
                                  <FiCheckCircle /> Подтвердить
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                                  className="btn btn-danger btn-sm"
                                >
                                  Отклонить
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
