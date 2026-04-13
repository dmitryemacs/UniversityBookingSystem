import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';

export default function CreateBooking() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const response = await equipmentService.getAll();
      const available = (response.data || []).filter(e => e.status === 'AVAILABLE');
      setEquipment(available);
    } catch (error) {
      toast.error('Не удалось загрузить оборудование');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.equipmentId) {
      toast.error('Пожалуйста, выберите оборудование');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error('Пожалуйста, выберите даты начала и окончания');
      return;
    }

    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    
    if (endDate <= startDate) {
      toast.error('Дата окончания должна быть позже даты начала');
      return;
    }

    setSubmitting(true);
    try {
      const result = await bookingService.create({
        equipmentId: parseInt(formData.equipmentId),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        purpose: formData.purpose,
      });

      if (result.success) {
        toast.success('Бронирование успешно создано!');
        navigate('/my-bookings');
      } else {
        toast.error(result.message || 'Не удалось создать бронирование');
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      const responseData = error.response?.data;
      
      // Handle validation errors with field error map
      if (responseData?.data && typeof responseData.data === 'object') {
        const fieldErrors = Object.values(responseData.data);
        const message = fieldErrors.join(', ');
        toast.error(message);
      } else {
        const message = responseData?.message || responseData?.error || 'Не удалось создать бронирование';
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <Link to="/equipment" className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
            <FiArrowLeft /> Назад к оборудованию
          </Link>

          <div className="page-header">
            <h1 className="page-title">Создать новое бронирование</h1>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
                <FiCalendar style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Детали бронирования
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Выберите оборудование</label>
                  <select
                    name="equipmentId"
                    className="form-input"
                    value={formData.equipmentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите оборудование...</option>
                    {loading ? (
                      <option>Загрузка...</option>
                    ) : (
                      equipment.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {item.location}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Дата и время начала</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    className="form-input"
                    value={formData.startTime}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Дата и время окончания</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    className="form-input"
                    value={formData.endTime}
                    onChange={handleChange}
                    min={formData.startTime || new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Цель использования</label>
                  <textarea
                    name="purpose"
                    className="form-input"
                    rows="4"
                    placeholder="Опишите цель вашего бронирования (например, исследовательский проект, демонстрация для класса и т.д.)"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                >
                  {submitting ? 'Создание бронирования...' : 'Создать бронирование'}
                </button>
              </form>
            </div>

            <div>
              <div className="card">
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>
                  Правила бронирования
                </h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--gray)', lineHeight: '1.8' }}>
                  <li>Бронируйте оборудование только на то время, когда оно вам действительно нужно</li>
                  <li>Возвращайте оборудование в том же состоянии, в котором вы его получили</li>
                  <li>Немедленно сообщайте о любых проблемах или повреждениях</li>
                  <li>Уважайте бронирования других пользователей</li>
                  <li>Отмена должна быть сделана не менее чем за 24 часа</li>
                </ul>
              </div>

              <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>
                  Нужна помощь?
                </h3>
                <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>
                  Свяжитесь с командой управления оборудованием, если у вас есть вопросы
                  по бронированию или использованию конкретного оборудования.
                </p>
                <Link to="/equipment" className="btn btn-outline btn-block">
                  Смотреть всё оборудование
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
