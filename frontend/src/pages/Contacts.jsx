import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiMapPin, FiPhone, FiClock, FiSend, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';

export default function Contacts() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      setFormData({
        name: user?.username || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <FiMail size={24} />,
      title: 'Email',
      value: 'support@univer-booking.edu',
      href: 'mailto:support@univer-booking.edu',
      color: '#4f46e5',
    },
    {
      icon: <FiPhone size={24} />,
      title: 'Телефон',
      value: '+7 (495) 123-45-67',
      href: 'tel:+74951234567',
      color: '#10b981',
    },
    {
      icon: <FiMapPin size={24} />,
      title: 'Адрес',
      value: 'Университетский кампус, Корпус А, Аудитория 101',
      href: '#',
      color: '#f59e0b',
    },
    {
      icon: <FiClock size={24} />,
      title: 'Часы работы',
      value: 'Пн - Пт: 9:00 - 18:00',
      href: '#',
      color: '#06b6d4',
    },
  ];

  const faqs = [
    {
      question: 'Как забронировать оборудование?',
      answer: 'Просто просмотрите каталог оборудования, выберите нужный предмет, укажите желаемую дату и время, и отправьте запрос на бронирование. Вы получите подтверждение после одобрения.',
    },
    {
      question: 'Могу ли я отменить бронирование?',
      answer: 'Да, вы можете отменить бронирование на странице "Мои бронирования". Обратите внимание, что отмена должна быть сделана не менее чем за 24 часа до начала бронирования.',
    },
    {
      question: 'Сколько времени занимает подтверждение?',
      answer: 'Большинство бронирований подтверждаются в течение 24 часов. Для срочных запросов, пожалуйста, свяжитесь с нашей службой поддержки напрямую.',
    },
    {
      question: 'Что делать, если оборудование повреждено?',
      answer: 'Немедленно сообщите о любом повреждённом оборудовании через страницу "Мои бронирования" или свяжитесь с нашей службой поддержки. Не используйте повреждённое оборудование.',
    },
    {
      question: 'Кто может использовать систему бронирования?',
      answer: 'Все зарегистрированные студенты университета, преподаватели и научные сотрудники могут использовать систему бронирования.',
    },
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Контакты</h1>
          <p className="hero__subtitle">
            Есть вопросы? Мы здесь, чтобы помочь и ответить на все ваши вопросы.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{
        padding: '60px 20px',
        background: 'white',
        marginTop: '-40px',
      }}>
        <div className="container">
          <div className="grid grid-4">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                style={{ textDecoration: 'none' }}
                className="card"
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 16px',
                  background: `${info.color}20`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: info.color,
                }}>
                  {info.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--dark)', marginBottom: '8px' }}>
                  {info.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: 0 }}>
                  {info.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}>
            {/* Contact Form */}
            <div className="card">
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
                Напишите нам
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--gray)', marginBottom: '24px' }}>
                Заполните форму ниже, и мы свяжемся с вами как можно скорее.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <FiMessageSquare style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Email адрес
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="ivan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Тема</label>
                  <select
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите тему</option>
                    <option value="general">Общий вопрос</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="booking">Проблема с бронированием</option>
                    <option value="feedback">Обратная связь</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FiHelpCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Сообщение
                  </label>
                  <textarea
                    name="message"
                    className="form-input"
                    placeholder="Чем мы можем вам помочь?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    'Отправка...'
                  ) : (
                    <>
                      <FiSend style={{ marginRight: '8px' }} /> Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
                Часто задаваемые вопросы
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--gray)', marginBottom: '24px' }}>
                Быстрые ответы на распространённые вопросы о нашей системе бронирования.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="card"
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    <summary style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--dark)',
                      marginBottom: '12px',
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      {faq.question}
                      <span style={{
                        fontSize: '20px',
                        color: 'var(--primary)',
                        transition: 'transform 0.3s',
                      }}>
                        +
                      </span>
                    </summary>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--gray)',
                      lineHeight: '1.6',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--light)',
                    }}>
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Всё ещё есть вопросы?
                </h3>
                <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '16px' }}>
                  Наша служба поддержки готова помочь вам.
                </p>
                <Link
                  to={user ? '/equipment' : '/register'}
                  className="btn"
                  style={{
                    background: 'white',
                    color: 'var(--primary)',
                    fontSize: '14px',
                    padding: '10px 24px',
                    fontWeight: '600',
                  }}
                >
                  {user ? 'Смотреть оборудование' : 'Создать аккаунт'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours Section */}
      <section style={{
        padding: '80px 20px',
        background: 'white',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
                Часы работы поддержки
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--gray)', marginBottom: '24px', lineHeight: '1.6' }}>
                Наша команда технической поддержки доступна в следующие часы для помощи 
                вам с любыми вопросами, связанными с оборудованием или бронированием.
              </p>

              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #cbd5e1',
                }}>
                  <span style={{ fontWeight: '500', color: 'var(--dark)' }}>Понедельник - Пятница</span>
                  <span style={{ color: 'var(--gray)' }}>9:00 - 18:00</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #cbd5e1',
                }}>
                  <span style={{ fontWeight: '500', color: 'var(--dark)' }}>Суббота</span>
                  <span style={{ color: 'var(--gray)' }}>10:00 - 16:00</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                }}>
                  <span style={{ fontWeight: '500', color: 'var(--dark)' }}>Воскресенье</span>
                  <span style={{ color: 'var(--gray)' }}>Выходной</span>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: '#fef3c7',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b',
              }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                  <strong>Примечание:</strong> Для срочных вопросов вне часов работы поддержки, 
                  пожалуйста, напишите нам, и мы ответим как можно скорее.
                </p>
              </div>
            </div>

            <div style={{
              padding: '40px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              borderRadius: '16px',
              color: 'white',
              textAlign: 'center',
            }}>
              <FiMail size={64} style={{ marginBottom: '24px', opacity: '0.9' }} />
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                Экстренный контакт
              </h3>
              <p style={{ fontSize: '16px', opacity: '0.9', marginBottom: '24px' }}>
                Для экстренных случаев и срочных вопросов
              </p>
              <a
                href="mailto:emergency@univer-booking.edu"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'white',
                  color: 'var(--primary)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                emergency@univer-booking.edu
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
