import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiCalendar, FiCheckCircle, FiShield, FiZap, FiHeart, FiGithub, FiMail } from 'react-icons/fi';

export default function About() {
  const { user } = useAuth();

  const team = [
    { name: 'Команда разработки', role: 'Backend & Frontend', icon: '👨‍💻' },
    { name: 'UI/UX дизайнеры', role: 'Пользовательский опыт', icon: '🎨' },
    { name: 'QA инженеры', role: 'Контроль качества', icon: '✅' },
    { name: 'DevOps', role: 'Инфраструктура', icon: '⚙️' },
  ];

  const technologies = [
    { name: 'Spring Boot', category: 'Backend', color: '#6DB33F' },
    { name: 'React', category: 'Frontend', color: '#61DAFB' },
    { name: 'PostgreSQL', category: 'База данных', color: '#336791' },
    { name: 'JWT', category: 'Безопасность', color: '#000000' },
    { name: 'Docker', category: 'Развёртывание', color: '#2496ED' },
    { name: 'Maven', category: 'Сборка', color: '#C71A36' },
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>
            О нашем проекте
          </h1>
          <p style={{ fontSize: '20px', opacity: '0.9', maxWidth: '700px', margin: '0 auto' }}>
            Делаем бронирование университетского оборудования простым, эффективным и доступным для всех
          </p>
        </div>
      </section>

      {/* Mission Section */}
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
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--dark)', marginBottom: '20px' }}>
                Наша миссия
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--gray)', lineHeight: '1.8', marginBottom: '20px' }}>
                Мы стремимся упростить процесс бронирования оборудования в университетах, 
                облегчая студентам, преподавателям и исследователям доступ к инструментам, 
                необходимым для их учебной и исследовательской деятельности.
              </p>
              <p style={{ fontSize: '18px', color: 'var(--gray)', lineHeight: '1.8' }}>
                Наша платформа устраняет сложности ручных систем бронирования, снижает конфликты 
                и двойные бронирования, обеспечивает видимость доступности оборудования в реальном времени.
              </p>
            </div>
            <div style={{
              padding: '40px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
            }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  { icon: <FiUsers size={32} />, title: '500+', label: 'Активных пользователей' },
                  { icon: <FiCalendar size={32} />, title: '1000+', label: 'Бронирований в месяц' },
                  { icon: <FiCheckCircle size={32} />, title: '98%', label: 'Удовлетворённость' },
                  { icon: <FiShield size={32} />, title: '24/7', label: 'Доступность системы' },
                ].map((stat, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ color: 'var(--primary)' }}>{stat.icon}</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--dark)' }}>{stat.title}</div>
                      <div style={{ fontSize: '14px', color: 'var(--gray)' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
              Наши ценности
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--gray)' }}>
              Что движет нами для создания лучшего опыта бронирования
            </p>
          </div>

          <div className="grid grid-3">
            {[
              {
                icon: <FiZap size={40} />,
                title: 'Эффективность',
                description: 'Мы ценим ваше время. Процесс бронирования занимает менее 2 минут от начала до конца.',
                color: '#f59e0b',
              },
              {
                icon: <FiShield size={40} />,
                title: 'Надёжность',
                description: 'Ваши бронирования подтверждены и отслеживаются. Никаких неопределённостей или двойных бронирований.',
                color: '#10b981',
              },
              {
                icon: <FiHeart size={40} />,
                title: 'Ориентированность на пользователя',
                description: 'Разработано с учётом реальных отзывов пользователей. Мы постоянно улучшаемся на основе ваших потребностей.',
                color: '#ef4444',
              },
            ].map((value, index) => (
              <div key={index} className="card" style={{
                textAlign: 'center',
                padding: '40px 24px',
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 24px',
                  background: `linear-gradient(135deg, ${value.color}20 0%, ${value.color}40 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: value.color,
                }}>
                  {value.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--dark)' }}>
                  {value.title}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.6' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section style={{
        padding: '80px 20px',
        background: 'white',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
              Технологический стек
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--gray)' }}>
              Построено с использованием современных, надёжных технологий
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
          }}>
            {technologies.map((tech, index) => (
              <div key={index} style={{
                padding: '20px 32px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                minWidth: '150px',
                border: '2px solid',
                borderColor: tech.color,
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--dark)', marginBottom: '4px' }}>
                  {tech.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
              Наша команда
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--gray)' }}>
              Талантливые люди, делающие это возможным
            </p>
          </div>

          <div className="grid grid-4">
            {team.map((member, index) => (
              <div key={index} className="card" style={{
                textAlign: 'center',
                padding: '32px 20px',
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>{member.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--dark)', marginBottom: '8px' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--gray)' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
            Есть вопросы?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Мы здесь, чтобы помочь! Свяжитесь с нами в любое время.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contacts" className="btn" style={{
              background: 'white',
              color: 'var(--primary)',
              fontSize: '16px',
              padding: '14px 32px',
              fontWeight: '600',
            }}>
              <FiMail style={{ marginRight: '8px' }} /> Связаться с нами
            </Link>
            {!user && (
              <Link to="/register" className="btn" style={{
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                fontSize: '16px',
                padding: '14px 32px',
                fontWeight: '600',
              }}>
                Начать работу
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
