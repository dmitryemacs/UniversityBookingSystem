import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiCalendar, FiCheckCircle, FiShield, FiZap, FiHeart, FiMail } from 'react-icons/fi';

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
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            О нашем проекте
          </h1>
          <p className="hero__subtitle">
            Делаем бронирование университетского оборудования простым, эффективным и доступным для всех
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section section--white">
        <div className="container">
          <div className="mission-grid">
            <div>
              <h2 className="about-heading">Наша миссия</h2>
              <p className="about-text">
                Мы стремимся упростить процесс бронирования оборудования в университетах,
                облегчая студентам, преподавателям и исследователям доступ к инструментам,
                необходимым для их учебной и исследовательской деятельности.
              </p>
              <p className="about-text">
                Наша платформа устраняет сложности ручных систем бронирования, снижает конфликты
                и двойные бронирования, обеспечивает видимость доступности оборудования в реальном времени.
              </p>
            </div>
            <div className="about-stats-bg">
              <div className="about-stats">
                {[
                  { icon: <FiUsers size={32} />, title: '500+', label: 'Активных пользователей' },
                  { icon: <FiCalendar size={32} />, title: '1000+', label: 'Бронирований в месяц' },
                  { icon: <FiCheckCircle size={32} />, title: '98%', label: 'Удовлетворённость' },
                  { icon: <FiShield size={32} />, title: '24/7', label: 'Доступность системы' },
                ].map((stat, index) => (
                  <div key={index} className="about-stat">
                    <div className="about-stat-icon">{stat.icon}</div>
                    <div>
                      <div className="about-stat-value">{stat.title}</div>
                      <div className="about-stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section--light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Наши ценности</h2>
            <p className="section-subtitle">
              Что движет нами для создания лучшего опыта бронирования
            </p>
          </div>

          <div className="grid grid-3">
            {[
              {
                icon: <FiZap size={40} />,
                title: 'Эффективность',
                description: 'Мы ценим ваше время. Процесс бронирования занимает менее 2 минут от начала до конца.',
                color: 'var(--warning)',
              },
              {
                icon: <FiShield size={40} />,
                title: 'Надёжность',
                description: 'Ваши бронирования подтверждены и отслеживаются. Никаких неопределённостей или двойных бронирований.',
                color: 'var(--success)',
              },
              {
                icon: <FiHeart size={40} />,
                title: 'Ориентированность на пользователя',
                description: 'Разработано с учётом реальных отзывов пользователей. Мы постоянно улучшаемся на основе ваших потребностей.',
                color: 'var(--danger)',
              },
            ].map((value, index) => (
              <div key={index} className="card value-card">
                <div className="value-icon" style={{ background: `linear-gradient(135deg, ${value.color}20 0%, ${value.color}40 100%)`, color: value.color }}>
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Технологический стек</h2>
            <p className="section-subtitle">
              Построено с использованием современных, надёжных технологий
            </p>
          </div>

          <div className="tech-tags">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-tag" style={{ borderColor: tech.color }}>
                <div className="tech-name">{tech.name}</div>
                <div className="tech-cat">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section--light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Наша команда</h2>
            <p className="section-subtitle">
              Талантливые люди, делающие это возможным
            </p>
          </div>

          <div className="grid grid-4">
            {team.map((member, index) => (
              <div key={index} className="card team-card">
                <div className="team-icon">{member.icon}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Есть вопросы?</h2>
          <p className="cta__subtitle">
            Мы здесь, чтобы помочь! Свяжитесь с нами в любое время.
          </p>
          <div className="cta__actions">
            <Link to="/contacts" className="btn btn--lg btn--white">
              <FiMail className="btn-icon-left" /> Связаться с нами
            </Link>
            {!user && (
              <Link to="/register" className="btn btn--lg btn--white-outline">
                Начать работу
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
