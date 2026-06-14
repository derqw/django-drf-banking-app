import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../main/components/Header';
import '../styles.scss';
import logo from '../../../assets/logo.png';
import visa from '../../../assets/visa.png';

interface CardState {
  number_card: string;
  year: number;
  month: number;
  name: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: 'Loading...',
    location: 'Loading...',
    avatar: ''
  });

  const [cardData, setCardData] = useState<CardState>({
    number_card: '',
    year: 0,
    month: 0,
    name: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/profile/', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const profile = Array.isArray(data) ? data[0] : data;
          
          if (profile) {
            const country = profile.country || '';
            const city = profile.city || '';
            const locationString = country && city ? `${country}/${city}` : country || city || 'No location';

            setProfileData({
              fullName: profile.full_name || 'No Name',
              location: locationString,
              avatar: profile.avatar || ''
            });

            if (profile.card) {
              setCardData({
                number_card: profile.card.number_card || '',
                year: profile.card.year || 0,
                month: profile.card.month || 0,
                name: profile.card.name || ''
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile and card data:', error);
      }
    };
    
    fetchProfileData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatCardNumber = (num: string) => {
    if (!num) return '•••• •••• •••• ••••';
    const clearNum = num.replace(/\s+/g, '');
    return clearNum.match(/.{1,4}/g)?.join(' ') || num;
  };

  const formatExpiry = (month: number, year: number) => {
    if (!month || !year) return '••/••';
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}/${formattedYear}`;
  };

  return (
    <div className="profile-layout">
      <Header />
      
      <div className="profile-layout__container">
        <aside className="profile-sidebar">
          <button className="profile-sidebar__back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          
          <div className="profile-sidebar__info">
            <div className="profile-sidebar__avatar">
              {profileData.avatar && (
                <img src={profileData.avatar} alt="Avatar" className="profile-sidebar__avatar-img" />
              )}
            </div>
            <h3 className="profile-sidebar__name">{profileData.fullName}</h3>
            <p className="profile-sidebar__location">{profileData.location}</p>
          </div>

          <nav className="profile-sidebar__menu menu-box">
            <a href="/history" className="menu-box__link">History</a>
            <a href="/bussines" className="menu-box__link">Bussines</a>
            <a href="/settings" className="menu-box__link menu-box__link--active">Settings</a>
            <a href="/notifications" className="menu-box__link">Notification</a>
            <button className="menu-box__logout" onClick={handleLogOut}>Log out</button>
          </nav>
        </aside>

        <main className="profile-main">
          <h2 className="profile-main__title">My cards</h2>
          
          <div className="credit-card">
            <div className="credit-card__top">
              <img src={logo} alt="Logo" className="credit-card__logo-img" />
            </div>
            <div className="credit-card__number">
              {formatCardNumber(cardData.number_card)}
            </div>
            <div className="credit-card__bottom">
              <div className="credit-card__expiry">
                {formatExpiry(cardData.month, cardData.year)}
              </div>
              <div className="credit-card__holder">
                {cardData.name || profileData.fullName}
              </div>
            </div>
            <img src={visa} alt="Visa" className="credit-card__brand-img" />
          </div>
          
          <div className="slider-dots">
            <span className="slider-dots__item slider-dots__item--active"></span>
            <span className="slider-dots__item"></span>
            <span className="slider-dots__item"></span>
          </div>

          <div className="card-options">
            <button className="card-options__btn">Add card</button>
            <button className="card-options__btn">Reactive card</button>
            <button className="card-options__btn">View about card</button>
            <button className="card-options__btn card-options__btn--delete">Delete card</button>
          </div>
        </main>
      </div>
    </div>
  );
}