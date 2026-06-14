import { useState, useEffect } from 'react';
import logo from '../../../assets/logo.png';
import visa from '../../../assets/visa.png';
import './styles/card.scss';

interface CardDataType {
  number_card: string;
  cvc: string;
  year: number;
  month: number;
  name: string;
  type_credit_card: string;
  balance: string;
}

export default function Card() {
  const [cardState, setCardState] = useState<'flat' | 'front' | 'back'>('flat');
  const [copied, setCopied] = useState(false);
  const [cardData, setCardData] = useState<CardDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('/api/v1/UniBank', {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        const actualData = Array.isArray(data) ? data[0] : data;
        setCardData(actualData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (cardState !== 'flat') {
        setCardState('flat');
      }
    };

    if (cardState !== 'flat') {
      document.addEventListener('click', handleGlobalClick);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [cardState]);

  const handleCopy = (e: React.MouseEvent, textToCopy: string, cleanSpaces: boolean = false) => {
    e.stopPropagation();
    const finalDetail = cleanSpaces ? textToCopy.replace(/\s/g, '') : textToCopy;
    navigator.clipboard.writeText(finalDetail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardState === 'flat') {
      setCardState('front');
    } else if (cardState === 'front') {
      setCardState('back');
    } else {
      setCardState('front');
    }
  };

  if (isLoading || !cardData) {
    return null;
  }

  const formattedNumber = cardData.number_card.replace(/(\d{4})(?=\d)/g, '$1 ');
  const formattedDate = `${String(cardData.month).padStart(2, '0')}/${cardData.year}`;
  const displayBalance = `$${cardData.balance}`;

  return (
    <div className="cards-block">
      <div className={`card-toast ${copied ? 'card-toast--visible' : ''}`}>
        Copied!
      </div>

      <div className={`card-balance ${cardState === 'flat' ? 'card-balance--visible' : ''}`}>
        {displayBalance}
      </div>

      <div 
        className={`card card--${cardState}`}
        onClick={handleCardClick}
      >
        <div className="card__rotator">
          <div className="card__side card__side--front">
            <div className="card__content">
              <img src={logo} alt="logo" className="card__logo" />
              
              <p className="card__number" onClick={(e) => handleCopy(e, formattedNumber, true)}>
                {formattedNumber}
              </p>

              <div className="card__bottom-content">
                <span>
                  <p className="card__date" onClick={(e) => handleCopy(e, formattedDate)}>
                    {formattedDate}
                  </p>
                  <p className="card__name" onClick={(e) => handleCopy(e, cardData.name)}>
                    {cardData.name}
                  </p>
                </span>
                <img src={visa} alt={cardData.type_credit_card} className="card__visa" />
              </div>
            </div>
          </div>

          <div className="card__side card__side--back">
            <div className="card__magnetic-stripe">
              <span className="card__cvc" onClick={(e) => handleCopy(e, cardData.cvc, true)}>
                {cardData.cvc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}