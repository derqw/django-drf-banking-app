import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/withdraw.scss';

export default function WithdrawCard({ step, setStep }: { step: number, setStep: (s: number) => void }) {
  const [sum, setSum] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'error' | 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showNotification('Code copied to clipboard', 'success');
    } catch (err) {
      showNotification('Failed to copy code', 'error');
    }
  };

  const handleGenerate = async () => {
    if (!sum || parseFloat(sum) <= 0) {
      showNotification('Please enter a valid sum', 'error');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/v1/Withdraw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(sum) })
      });

      const data = await response.json();

      if (response.ok) {
        setCode(data.code);
        showNotification('Code generated successfully', 'success');
        setStep(2);
      } else {
        showNotification(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showNotification('Network error, please try again', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <div className={`transfer__notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="withdraw-card">
        {step === 1 && (
          <div className="withdraw-card__step1">
            <label>Sum</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={sum} 
              onChange={(e) => setSum(e.target.value)} 
              disabled={isLoading}
            />
            <p className="withdraw-card__note">Someone else's bank may require a commission</p>
            <button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Generate code'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="withdraw-card__step2">
            <h3>Your code</h3>
            <div className="withdraw-card__code" onClick={handleCopyCode} title="Click to copy">
              {code}
            </div>
            <p>Your code is active for 3 days. Click on the code to copy it.</p>
            <button onClick={() => navigate('/')}>Continue</button>
          </div>
        )}
      </div>
    </>
  );
}