import  { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Header.scss';
import { Link } from '@tanstack/react-router';
import {
Button
} from "../button"



export default function Header() {



  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Главная');

  const menuItems = [
    { label: 'Главная', href: '/' },
    { label: 'Возможности', href: '/features'},
    { label: 'API', href: '/redoc'},
    { label: 'Документация', href: '/documentation',  badge: 'New' },
    { label: 'Контакты', href: '/contact', },
  ];

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          <Link to='/' className="header__logo">
            <div className="header__logo-icon"></div>
            <span className="header__logo-text">ECHO.PR</span>
          </Link>

          <nav className="header__nav">
            <ul className="header__list">
              {menuItems.map((item) => (
                <li key={item.label} className="header__item">
                  <Link
                    to={item.href}
                  >
                    <Button >
                       {item.label}
                    </Button>
                   
                    
                    {item.badge && (
                      <span className="header__link-badge">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <Link to='/auth/signin' className="header__login">
                <Button  variant="secondary">Войти</Button>
            </Link>
        
          </div>

          <button
            className="header__menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Меню"
          >
            {isMobileMenuOpen ? (
              <X className="header__menu-icon" />
            ) : (
              <Menu className="header__menu-icon" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="header__mobile-menu">
            <ul className="header__mobile-list">
              {menuItems.map((item) => (
                <li key={item.label} className="header__mobile-item">
                  <Link
                    to={item.href}
                    className={`header__mobile-link ${activeItem === item.label ? 'header__mobile-link--active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{item.label}</span>
                  
                    {item.badge && (
                      <span className="header__mobile-badge">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="header__mobile-actions">
              <Link to="/auth/signin" className="header__login">
                Войти
              </Link>
        
            </div>
          </div>
        )}
      </div>
    </header>
  );
};