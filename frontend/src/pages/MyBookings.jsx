import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { bookingService } from '../services/bookingService';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      const result = await bookingService.cancel(bookingId);
      if (result.success) {
        toast.success('Бронирование успешно отменено');
        loadBookings();
      } else {
        toast.error(result.message || 'Не удалось отменить бронирование');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Не удалось отменить бронирование');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { class: 'badge-success', icon: <FiCheckCircle />, text: 'Подтверждено' };
      case 'PENDING':
        return { class: 'badge-warning', icon: <FiClock />, text: 'Ожидает' };
      case 'CANCELLED':
        return { class: 'badge-danger', icon: <FiXCircle />, text: 'Отменено' };
      case 'COMPLETED':
        return { class: 'badge-info', icon: <FiCheckCircle />, text: 'Завершено' };
      case 'REJECTED':
        return { class: 'badge-danger', icon: <FiAlertCircle />, text: 'Отклонено' };
      default:
        return { class: 'badge-info', icon: <FiClock />, text: status };
    }
  };

  const getFilterButtonText = (status) => {
    const texts = {
      all: 'Все',
      pending: 'Ожидающие',
      confirmed: 'Подтверждённые',
      cancelled: 'Отменённые',
      completed: 'Завершённые',
      rejected: 'Отклонённые',
    };
    return texts[status] || status;
  };

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Мои бронирования</h1>
            <Link to="/bookings/create" className="btn btn-success">
              <FiCalendar /> Новое бронирование
            </Link>
          </div>

          {/* Filter */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'confirmed', 'cancelled', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`btn btn-sm ${
                    filter === status ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {getFilterButtonText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="loading-container" style={{ minHeight: '400px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-title">Бронирования не найдены</div>
              <div className="empty-state-text">
                {filter === 'all'
                  ? 'У вас пока нет бронирований'
                  : `Нет ${getFilterButtonText(filter).toLowerCase()}`}
              </div>
              {filter === 'all' && (
                <Link to="/bookings/create" className="btn btn-primary">
                  Создать первое бронирование
                </Link>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table table-responsive-card">
                <thead>
                  <tr>
                    <th>Оборудование</th>
                    <th>Дата начала</th>
                    <th>Дата окончания</th>
                    <th>Цель</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const statusBadge = getStatusBadge(booking.status);
                    return (
                      <tr key={booking.id}>
                        <td data-label="Оборудование">
                          <Link
                            to={`/equipment/${booking.equipmentId}`}
                            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}
                          >
                            {booking.equipmentName}
                          </Link>
                        </td>
                        <td data-label="Начало">
                          {new Date(booking.startTime).toLocaleString('ru-RU')}
                        </td>
                        <td data-label="Окончание">
                          {new Date(booking.endTime).toLocaleString('ru-RU')}
                        </td>
                        <td data-label="Цель" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {booking.purpose}
                        </td>
                        <td data-label="Статус">
                          <span className={`badge ${statusBadge.class}`}>
                            {statusBadge.icon}
                            <span style={{ marginLeft: '4px' }}>{statusBadge.text}</span>
                          </span>
                        </td>
                        <td data-label="">
                          <div className="table-actions">
                            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Отменить
                              </button>
                            )}
                            {booking.rejectionReason && (
                              <span style={{ color: 'var(--danger)', fontSize: '13px' }}>
                                Причина: {booking.rejectionReason}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
