import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import {
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiCheckCircle,
} from 'react-icons/fi';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [creatingBooking, setCreatingBooking] = useState(false);

  useEffect(() => {
    loadEquipment();
    loadBookings();
  }, [id]);

  async function loadEquipment() {
    try {
      const response = await equipmentService.getById(id);
      setEquipment(response.data);
    } catch (error) {
      toast.error('Не удалось загрузить информацию об оборудовании');
      navigate('/equipment');
    } finally {
      setLoading(false);
    }
  }

  async function loadBookings() {
    try {
      const response = await bookingService.getEquipmentBookings(id);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  }

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!bookingDates.startTime || !bookingDates.endTime) {
      toast.error('Пожалуйста, выберите время начала и окончания');
      return;
    }

    setCreatingBooking(true);
    try {
      const result = await bookingService.create({
        equipmentId: parseInt(id),
        startTime: new Date(bookingDates.startTime).toISOString(),
        endTime: new Date(bookingDates.endTime).toISOString(),
        purpose: bookingDates.purpose,
      });

      if (result.success) {
        toast.success('Бронирование успешно создано!');
        setCreatingBooking(false);
        setBookingDates({ startTime: '', endTime: '', purpose: '' });
        loadBookings();
      } else {
        toast.error(result.message || 'Не удалось создать бронирование');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Не удалось создать бронирование');
    } finally {
      setCreatingBooking(false);
    }
  };

  if (loading || !equipment) {
    return (
      <div>
        <Header />
        <div className="loading-container" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <Link to="/equipment" className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
            <FiArrowLeft /> Назад к оборудованию
          </Link>

          <div className="grid grid-2">
            {/* Equipment Details */}
            <div className="card">
              <div
                style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  marginBottom: '24px',
                }}
              >
                📦
              </div>

              <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
                {equipment.name}
              </h1>

              <div style={{ marginBottom: '16px' }}>
                <span
                  className={`badge ${
                    equipment.status === 'AVAILABLE'
                      ? 'badge-success'
                      : equipment.status === 'BOOKED'
                      ? 'badge-warning'
                      : equipment.status === 'MAINTENANCE'
                      ? 'badge-info'
                      : 'badge-danger'
                  }`}
                >
                  {equipment.status === 'AVAILABLE' ? 'Доступно' : equipment.status === 'BOOKED' ? 'Забронировано' : equipment.status === 'MAINTENANCE' ? 'Обслуживание' : 'Недоступно'}
                </span>
              </div>

              <p style={{ color: 'var(--gray)', lineHeight: '1.6', marginBottom: '24px' }}>
                {equipment.description}
              </p>

              {equipment.categoryName && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Категория:</strong> {equipment.categoryName}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <FiMapPin style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                <strong>Местоположение:</strong> {equipment.location}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <FiUsers style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                <strong>Вместимость:</strong> {equipment.capacity} чел.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <FiCalendar style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                <strong>Добавлено:</strong>{' '}
                {new Date(equipment.createdAt).toLocaleDateString()}
              </div>

              {equipment.serialNumber && (
                <div>
                  <strong>Серийный номер:</strong> {equipment.serialNumber}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div>
              {user ? (
                <div className="card">
                  <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
                    <FiCalendar style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Забронировать это оборудование
                  </h2>

                  <form onSubmit={handleCreateBooking}>
                    <div className="form-group">
                      <label className="form-label">Дата и время начала</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={bookingDates.startTime}
                        onChange={(e) =>
                          setBookingDates({ ...bookingDates, startTime: e.target.value })
                        }
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Дата и время окончания</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={bookingDates.endTime}
                        onChange={(e) =>
                          setBookingDates({ ...bookingDates, endTime: e.target.value })
                        }
                        min={bookingDates.startTime || new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Цель использования</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        placeholder="Опишите цель вашего бронирования"
                        value={bookingDates.purpose}
                        onChange={(e) =>
                          setBookingDates({ ...bookingDates, purpose: e.target.value })
                        }
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={
                        creatingBooking || equipment.status !== 'AVAILABLE'
                      }
                    >
                      {creatingBooking ? 'Создание...' : 'Создать бронирование'}
                    </button>

                    {equipment.status !== 'AVAILABLE' && (
                      <p style={{ color: 'var(--warning)', fontSize: '13px', marginTop: '12px' }}>
                        Это оборудование в настоящее время недоступно для бронирования.
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state">
                    <div className="empty-state-icon">🔐</div>
                    <div className="empty-state-title">Требуется вход</div>
                    <div className="empty-state-text">
                      Пожалуйста, войдите, чтобы забронировать оборудование
                    </div>
                    <Link to="/login" className="btn btn-primary">
                      Войти
                    </Link>
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>
                  Последние бронирования
                </h3>
                {bookings.length === 0 ? (
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
                    Пока нет бронирований
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        style={{
                          padding: '12px',
                          background: 'var(--light)',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '500' }}>{booking.username}</span>
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
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>
                          {new Date(booking.startTime).toLocaleDateString()} -{' '}
                          {new Date(booking.endTime).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
