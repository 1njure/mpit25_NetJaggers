
import { 
  Github, Twitter, Linkedin, Mail, 
  MapPin, Phone, Globe, ChevronRight,
  Shield, Zap, Code, Heart
} from 'lucide-react';
import './Footer.scss';
import logoImpt from '@assets/images/background/mpitLogo.png'
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: 'Возможности', href: '#features' },
    { label: 'Тарифы', href: '#pricing' },
    { label: 'Кейсы', href: '#cases' },
    { label: 'API', href: '#api' },
    { label: 'Документация', href: '#docs' },
    { label: 'Чат-бот', href: '#chatbot', badge: 'New' }
  ];

  const companyLinks = [
    { label: 'О компании', href: '#about' },
    { label: 'Команда', href: '#team' },
    { label: 'Карьера', href: '#careers', badge: '3 вакансии' },
    { label: 'Блог', href: '#blog' },
    { label: 'Новости', href: '#news' },
    { label: 'Партнеры', href: '#partners' }
  ];

  const legalLinks = [
    { label: 'Политика конфиденциальности', href: '#privacy' },
    { label: 'Условия использования', href: '#terms' },
    { label: 'Cookie', href: '#cookies' },
    { label: 'Лицензии', href: '#licenses' },
    { label: 'Соответствие', href: '#compliance' }
  ];

  

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <div className="footer__logo">
              <img className="footer__logo-icon" src={logoImpt}/>
              
              <div>
                <span className="footer__logo-text">Моя профессия - ИТ</span>
                <div className="footer__tagline">
                  Инновационные решения для бизнеса
                </div>
              </div>
            </div>
            <p className="footer__description">
              Мы создаем передовые технологии, которые помогают компаниям 
              достигать своих целей быстрее и эффективнее.
            </p>
            
            <div className="footer__stats">
              <div className="footer__stat">
                <Zap className="footer__stat-icon" />
                <div>
                  <div className="footer__stat-value">99.9%</div>
                  <div className="footer__stat-label">Аптайм</div>
                </div>
              </div>
              <div className="footer__stat">
                <Shield className="footer__stat-icon" />
                <div>
                  <div className="footer__stat-value">sha-256</div>
                  <div className="footer__stat-label">Шифрование</div>
                </div>
              </div>
              <div className="footer__stat">
                <Code className="footer__stat-icon" />
                <div>
                  <div className="footer__stat-value">24/7</div>
                  <div className="footer__stat-label">Поддержка</div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__links-column">
              <h3 className="footer__links-title">
                <ChevronRight className="footer__title-icon" />
                Продукт
              </h3>
              <ul className="footer__links-list">
                {productLinks.map((link) => (
                  <li key={link.label} className="footer__links-item">
                    <a href={link.href} className="footer__link">
                      {link.label}
                      {link.badge && (
                        <span className="footer__link-badge">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">
                <ChevronRight className="footer__title-icon" />
                Компания
              </h3>
              <ul className="footer__links-list">
                {companyLinks.map((link) => (
                  <li key={link.label} className="footer__links-item">
                    <a href={link.href} className="footer__link">
                      {link.label}
                      {link.badge && (
                        <span className="footer__link-badge">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">
                <ChevronRight className="footer__title-icon" />
                Правовая информация
              </h3>
              <ul className="footer__links-list">
                {legalLinks.map((link) => (
                  <li key={link.label} className="footer__links-item">
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__copyright">
          <div className="footer__copyright-text">
            © {currentYear} TechSolutions. Все права защищены.
          </div>
          <div className="footer__made-with">
            Сделано с <Heart className="footer__heart-icon" /> в России
          </div>
        </div>
      </div>
    </footer>
  );
};