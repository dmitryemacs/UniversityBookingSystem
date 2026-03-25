import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { equipmentService } from '../services/equipmentService';
import { FiMapPin, FiUsers, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';

export default function EquipmentList() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const response = await equipmentService.getAll();
      setEquipment(response.data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Каталог оборудования</h1>
            {user ? (
              <Link to="/bookings/create" className="btn btn-success">
                <FiCalendar /> Создать бронирование
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                <FiCalendar /> Войти для бронирования
              </Link>
            )}
          </div>

          {/* Info Banner for Guests */}
          {!user && (
            <div className="card" style={{ 
              marginBottom: '24px', 
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid var(--primary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>
                    👋 Хотите забронировать оборудование?
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
                    Войдите или создайте аккаунт, чтобы начать бронировать оборудование для ваших исследований и учёбы.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to="/login" className="btn btn-outline">
                    Войти
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Создать аккаунт
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <FiSearch style={{ marginRight: '6px' }} />
                    Поиск
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Поиск по названию, описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ minWidth: '150px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <FiFilter style={{ marginRight: '6px' }} />
                    Статус
                  </label>
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Все</option>
                    <option value="AVAILABLE">Доступно</option>
                    <option value="BOOKED">Забронировано</option>
                    <option value="MAINTENANCE">Обслуживание</option>
                    <option value="RETIRED">Списано</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          {loading ? (
            <div className="loading-container" style={{ minHeight: '400px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-title">Оборудование не найдено</div>
              <div className="empty-state-text">
                Попробуйте изменить параметры поиска или фильтрации
              </div>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredEquipment.map((item) => (
                <Link
                  to={`/equipment/${item.id}`}
                  key={item.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="equipment-card">
                    <div className="equipment-image">📦</div>
                    <div className="equipment-content">
                      <h3 className="equipment-name">{item.name}</h3>
                      <p className="equipment-description">
                        {item.description?.substring(0, 100)}
                        {item.description?.length > 100 ? '...' : ''}
                      </p>
                      {item.categoryName && (
                        <div
                          style={{
                            marginBottom: '12px',
                            fontSize: '13px',
                            color: 'var(--primary)',
                            fontWeight: '500',
                          }}
                        >
                          {item.categoryName}
                        </div>
                      )}
                      <div className="equipment-meta">
                        <span className="equipment-location">
                          <FiMapPin /> {item.location}
                        </span>
                        <span className="equipment-capacity">
                          <FiUsers /> {item.capacity}
                        </span>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <span
                          className={`badge ${
                            item.status === 'AVAILABLE'
                              ? 'badge-success'
                              : item.status === 'BOOKED'
                              ? 'badge-warning'
                              : item.status === 'MAINTENANCE'
                              ? 'badge-info'
                              : 'badge-danger'
                          }`}
                        >
                          {item.status === 'AVAILABLE' ? 'Доступно' : item.status === 'BOOKED' ? 'Забронировано' : item.status === 'MAINTENANCE' ? 'Обслуживание' : 'Недоступно'}
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
  );
}
