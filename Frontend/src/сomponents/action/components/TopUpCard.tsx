import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/topup.scss';

interface TopUpCardProps {
  step: number;
  setStep: (step: number) => void;
}

export default function TopUpCard({ step, setStep }: TopUpCardProps) {
  const [sumValue, setSumValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleConfirmTopUp = () => {
    const token = localStorage.getItem('token');
    setIsSubmitting(true);

    fetch('/api/v1/TopUp', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: sumValue
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to top up');
        return response.json();
      })
      .then(() => {
        navigate('/'); 
      })
      .catch((error) => {
        console.error(error);
        alert('Something went wrong during the top-up transaction.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="transfer">
      <h2 className="transfer__title">Sum</h2>
      <input 
        type="number" 
        placeholder="0.00" 
        className="transfer__input"
        value={sumValue}
        onChange={(e) => setSumValue(e.target.value)}
        disabled={step === 2 || isSubmitting}
      />
      
      <div className="transfer__commission-info">
        <span>ⓘ</span>
        <span>Someone else's bank may require a commission</span>
      </div>

      {step === 1 ? (
        <div className="transfer__sources-list">
          {[
            { title: 'From your card', desc: 'Instant transfer between your own accounts' },
            { title: 'From card other bank', desc: 'Top up using Visa or MasterCard' },
            { title: 'For IBAN', desc: 'Bank transfer via international account number' },
            { title: 'QR/links', desc: 'Scan QR code or use payment link' },
            { title: 'Map with refill points', desc: 'Find the nearest terminal or bank branch' }
          ].map((item, index) => (
            <div 
              key={index} 
              className="transfer__source-item"
              onClick={() => {
                if (sumValue && parseFloat(sumValue) > 0) {
                  setStep(2);
                }
              }}
            >
              <div className="transfer__source-icon" />
              <div className="transfer__source-info">
                <span className="transfer__source-name">{item.title}</span>
                <span className="transfer__source-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="transfer__confirm-block">
          <div className="transfer__details">
            <p className="transfer__confirm-text">
              Total Top-up Amount: <strong>${parseFloat(sumValue).toFixed(2)}</strong>
            </p>
            <p>Please review the amount before confirming the payment transaction.</p>
          </div>
          <button 
            onClick={handleConfirmTopUp} 
            disabled={isSubmitting}
            className="transfer-form-visual__btn"
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      )}
    </div>
  );
}