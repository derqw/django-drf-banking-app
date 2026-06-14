import { useState, useEffect, useRef } from 'react';
import notificationIcon from '../../../assets/notification.png';
import analyticsIcon from '../../../assets/analytics.png';
import './styles/header.scss';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0 && data[0].avatar) {
            setAvatarUrl(data[0].avatar);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
  };

  return (
    <header className="header" ref={menuRef}>
      <div className="header__left">
        <div className="header__avatar" onClick={toggleMenu}>
          {avatarUrl && <img src={avatarUrl} alt="Avatar" className="header__avatar-img" />}
        </div>

        <button className="header__btn">
          <img src={notificationIcon} alt="Chat" className="header__icon header__icon--chat" />
        </button>
      </div>

      <div className="header__right">
        <button className="header__btn">
          <img src={analyticsIcon} alt="Analytics" className="header__icon header__icon--chart" />
        </button>
      </div>

      <div className={`header__dropdown dropdown ${isMenuOpen ? 'dropdown--open' : ''}`}>
        <ul className="dropdown__list">
          <a href='/profile' className="dropdown__item">Profile</a>
          <a href='/bussines' className="dropdown__item">Business</a>
          <a href='/settings' className="dropdown__item">Settings</a>
          <a href='/login' className="dropdown__item dropdown__item--signout" onClick={handleSignOut}>Sign out</a>
        </ul>
      </div>
    </header>
  );
}