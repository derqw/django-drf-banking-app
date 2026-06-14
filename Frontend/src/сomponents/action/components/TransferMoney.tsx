import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import visaLogo from '../../../assets/visa.png';
import bankLogo from '../../../assets/logo.png';
import './styles/transfer.scss';

interface TransferProps {
  step: number;
  setStep: (step: number) => void;
}

export default function TransferMoney({ step, setStep }: TransferProps) {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success' | 'warning'} | null>(null);
  const [cardHolder, setCardHolder] = useState('Valery Ov');
  const isRequesting = useRef(false);

  const showNotification = (message: string, type: 'error' | 'success' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const secureFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...options.headers }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { status: response.status, data: errorData };
    }
    return response;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await secureFetch('/api/v1/UniBank');
        const data = await res.json();
        if (data?.[0]?.balance) setAvailableBalance(parseFloat(data[0].balance));
      } catch (err) {
        console.log(err);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    if (step !== 1 || cardNumber.length !== 16 || isRequesting.current) return;

    const validateCard = async () => {
      isRequesting.current = true;
      setIsValidating(true);
      setApiError(null);
      try {
        const res = await secureFetch(`/api/v1/transfer/step1/?q=${cardNumber}`);
        const data = await res.json();
        if (data && data.length > 0 && data[0].full_name) {
          setCardHolder(data[0].full_name);
          setStep(2);
        } else {
          showNotification("Card not found", "warning");
        }
      } catch (err: any) {
        setApiError('Card not found or invalid');
        showNotification("Card not found or invalid", "error");
        isRequesting.current = false;
      } finally {
        setIsValidating(false);
      }
    };
    validateCard();
  }, [cardNumber, step, setStep]);

  const currentAmount = parseFloat(amount) || 0;
  const resultingBalance = availableBalance - currentAmount;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount > availableBalance) {
      showNotification("Insufficient funds", "error");
      return;
    }
    if (amount && step === 2) setStep(3);
  };

  const handleFinalPay = async () => {
    if (!isConfirmed) return;
    try {
      await secureFetch('/api/v1/Transfer', {
        method: 'POST',
        body: JSON.stringify({
          recipient_card: cardNumber,
          amount: currentAmount,
          payment_description: description
        })
      });
      showNotification('Transfer successful!', 'success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      showNotification(`Transfer failed: ${err.data?.detail || 'Error occurred'}`, 'error');
    }
  };

  const formatCardVisual = (value: string) => value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();

  return (
    <>
      {notification && (
        <div className={`transfer__notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {step === 1 && (
        <div className="transfer">
          <input 
            type="text" 
            placeholder="Enter card numbers" 
            maxLength={19} 
            value={formatCardVisual(cardNumber)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              if (rawValue.length <= 16) setCardNumber(rawValue);
            }}
            className="transfer__input"
            disabled={isValidating}
          />
          {isValidating && <p>Checking card...</p>}
          {apiError && <p className="transfer__error" style={{ color: 'red' }}>{apiError}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="transfer-step2-container">
          <div className="bank-card-visual">
            <div className="bank-card-visual__header">
              <img src={bankLogo} alt="Bank Logo" className="bank-card-visual__img-logo" />
            </div>
            <div className="bank-card-visual__number">{formatCardVisual(cardNumber) || "0000 0000 0000 0000"}</div>
            <div className="bank-card-visual__footer">
              <span className="bank-card-visual__holder">{cardHolder}</span>
              <img src={visaLogo} alt="Visa" className="bank-card-visual__img-visa" />
            </div>
          </div>
          <form className="transfer-form-visual" onSubmit={handleNextStep}>
            <div className="transfer-form-visual__group">
              <label>Enter sum</label>
              <input type="number" placeholder="100$" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="transfer-form-visual__info-row">
              <span>Available balance:</span>
              <span className="val_green">{availableBalance.toLocaleString()}$</span>
            </div>
            <div className="transfer-form-visual__info-row">
              <span>Resulting balance:</span>
              <span className={resultingBalance < 0 ? "val_red" : "val_green"}>{resultingBalance.toLocaleString()}$</span>
            </div>
            <div className="transfer-form-visual__group">
              <label>Enter description*</label>
              <input type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="transfer-form-visual__btn">Confirm</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="transfer-step3-container">
          <div className="bank-card-visual">
            <div className="bank-card-visual__header">
              <img src={bankLogo} alt="Bank" className="bank-card-visual__img-logo" />
            </div>
            <div className="bank-card-visual__number">{formatCardVisual(cardNumber)}</div>
            <div className="bank-card-visual__footer">
              <span className="bank-card-visual__holder">{cardHolder}</span>
              <img src={visaLogo} alt="Visa" className="bank-card-visual__img-visa" />
            </div>
          </div>

          <div className="transfer-details-box">
            <h3 className="transfer-details-box__title">Payment Summary</h3>
            <div className="transfer-details-box__row"><span>Amount:</span> <b>{amount} USD</b></div>
            <div className="transfer-details-box__row"><span>Purpose:</span> <b>{description || 'Not specified'}</b></div>
            
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                checked={isConfirmed} 
                onChange={(e) => setIsConfirmed(e.target.checked)}/>
              <span className="custom-checkbox__checkmark"></span>
              <span className="custom-checkbox__label">I confirm the payment details above</span>
            </label>

            <button 
              className="transfer-form-visual__btn" 
              onClick={handleFinalPay} 
              disabled={!isConfirmed}>
              Pay Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}