import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { FiUser, FiMail, FiBriefcase, FiShield } from 'react-icons/fi';

// Mock user service - in real app this would call API
const userService = {
  getAll: async () => {
    // This would be an API call in production
    return {
      data: [
        { id: 1, username: 'admin', email: 'admin@university.edu', role: 'ADMIN', department: 'Administration' },
        { id: 2, username: 'student1', email: 'student1@university.edu', role: 'STUDENT', department: 'Computer Science' },
        { id: 3, username: 'professor1', email: 'prof1@university.edu', role: 'PROFESSOR', department: 'Computer Science' },
      ],
    };
  },
  updateRole: async (userId, role) => {
    // This would be an API call in production
    return { success: true };
  },
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateRole = async (userId, currentRole) => {
    setEditingUser(userId);
    setNewRole(currentRole);
  };

  const saveRole = async (userId) => {
    try {
      await userService.updateRole(userId, newRole);
      toast.success('Роль пользователя обновлена');
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error('Не удалось обновить роль');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge-danger';
      case 'PROFESSOR':
        return 'badge-info';
      case 'STUDENT':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'PROFESSOR':
        return 'Преподаватель';
      case 'STUDENT':
        return 'Студент';
      default:
        return role;
    }
  };

  return (
    <div>
      <Header />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Управление пользователями</h1>
            <Link to="/admin" className="btn btn-secondary">
              Назад к панели
            </Link>
          </div>

          {loading ? (
            <div className="loading-container" style={{ minHeight: '400px' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Email</th>
                    <th>Кафедра</th>
                    <th>Роль</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '600',
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '500' }}>{user.username}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray)' }}>
                          <FiMail /> {user.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray)' }}>
                          <FiBriefcase /> {user.department}
                        </div>
                      </td>
                      <td>
                        {editingUser === user.id ? (
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="form-input"
                            style={{ padding: '6px 12px', width: 'auto' }}
                          >
                            <option value="STUDENT">Студент</option>
                            <option value="PROFESSOR">Преподаватель</option>
                            <option value="ADMIN">Администратор</option>
                          </select>
                        ) : (
                          <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                            <FiShield style={{ marginRight: '4px' }} />
                            {getRoleText(user.role)}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingUser === user.id ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => saveRole(user.id)}
                              className="btn btn-success btn-sm"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUpdateRole(user.id, user.role)}
                            className="btn btn-outline btn-sm"
                          >
                            Изменить роль
                          </button>
                        )}
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
  );
}
