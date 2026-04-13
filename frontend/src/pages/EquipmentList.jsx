import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { equipmentService } from '../services/equipmentService';
import { FiMapPin, FiUsers, FiSearch, FiFilter, FiCalendar, FiChevronLeft, FiChevronRight, FiX, FiList } from 'react-icons/fi';

export default function EquipmentList() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadEquipment();
  }, [page, size, searchTerm, selectedStatuses, selectedCategories, location, minCapacity, maxCapacity, sortBy, sortOrder]);

  async function loadEquipment() {
    try {
      setLoading(true);
      const searchRequest = {
        search: searchTerm || null,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : null,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : null,
        location: location || null,
        minCapacity: minCapacity ? parseInt(minCapacity) : null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        sortBy,
        sortOrder,
        page,
        size,
      };

      const response = await equipmentService.search(searchRequest);
      const pageData = response.data;
      setEquipment(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalElements(pageData.totalElements || 0);
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleStatus(status) {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPage(0);
  }

  function toggleCategory(categoryId) {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
    setPage(0);
  }

  function clearFilters() {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setLocation('');
    setMinCapacity('');
    setMaxCapacity('');
    setSortBy('name');
    setSortOrder('asc');
    setPage(0);
  }

  const hasActiveFilters = searchTerm || selectedStatuses.length > 0 || selectedCategories.length > 0 || 
                          location || minCapacity || maxCapacity;

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Доступно', color: 'badge-success' },
    { value: 'BOOKED', label: 'Забронировано', color: 'badge-warning' },
    { value: 'MAINTENANCE', label: 'Обслуживание', color: 'badge-info' },
    { value: 'RETIRED', label: 'Списано', color: 'badge-danger' },
  ];

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

          {/* Search Bar */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Поиск по названию, описанию, серийному номеру..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Фильтры
              </button>
              {hasActiveFilters && (
                <button className="btn btn-outline" onClick={clearFilters}>
                  <FiX /> Сбросить
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                Расширенные фильтры
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {/* Status Filter */}
                <div>
                  <label className="form-label">Статус</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {statusOptions.map(opt => (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(opt.value)}
                          onChange={() => toggleStatus(opt.value)}
                        />
                        <span className={`badge ${opt.color}`} style={{ fontSize: '11px' }}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="form-label">Местоположение</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Поиск по местоположению..."
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setPage(0); }}
                  />
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="form-label">Вместимость</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Мин"
                      value={minCapacity}
                      onChange={(e) => { setMinCapacity(e.target.value); setPage(0); }}
                      min="1"
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Макс"
                      value={maxCapacity}
                      onChange={(e) => { setMaxCapacity(e.target.value); setPage(0); }}
                      min="1"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="form-label">Сортировать по</label>
                  <select
                    className="form-input"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                  >
                    <option value="name">Название</option>
                    <option value="status">Статус</option>
                    <option value="location">Местоположение</option>
                    <option value="capacity">Вместимость</option>
                    <option value="createdAt">Дата создания</option>
                    <option value="category">Категория</option>
                  </select>
                  <select
                    className="form-input"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{ marginTop: '8px' }}
                  >
                    <option value="asc">По возрастанию</option>
                    <option value="desc">По убыванию</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          {hasActiveFilters && (
            <div style={{ marginBottom: '16px', color: 'var(--white)', fontSize: '14px' }}>
              Найдено: {totalElements} результатов
            </div>
          )}

          {/* Equipment Grid */}
          {loading ? (
            <div className="loading-container" style={{ minHeight: '400px' }}>
              <div className="spinner"></div>
            </div>
          ) : equipment.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-title">Оборудование не найдено</div>
              <div className="empty-state-text">
                Попробуйте изменить параметры поиска или фильтрации
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-3">
                {equipment.map((item) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <FiChevronLeft /> Назад
                  </button>
                  <div style={{ color: 'var(--white)', fontSize: '14px' }}>
                    Страница {page + 1} из {totalPages}
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Далее <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
