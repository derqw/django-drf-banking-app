import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import LeftBlock from './Left_Block';
import TransferMoney from './components/TransferMoney';
import TopUpCard from './components/TopUpCard';
import WithdrawCard from './components/WithdrawCard';
import Header from '../main/components/Header';
import './components/styles/styles.scss';

export default function Transactions() {
  const { pathname } = useLocation();
  const [step, setStep] = useState(1);

  const { isTopup, isWithdraw } = useMemo(() => ({
    isTopup: pathname.includes('/topup'),
    isWithdraw: pathname.includes('/withdraw')
  }), [pathname]);

  useEffect(() => {
    setStep(1);
  }, [pathname]);

  const totalSteps = useMemo(() => (isWithdraw || isTopup ? 2 : 3), [isWithdraw, isTopup]);

  const leftBlockText = useMemo(() => {
    if (isWithdraw) return step === 1 ? 'Please enter sum' : 'Save code';
    if (isTopup) return step === 1 ? 'Please enter sum and select source' : 'Confirm';
    
    const transferTexts: Record<number, string> = { 
      1: 'Please enter card number or IBAN', 
      2: 'Please enter sum and description', 
      3: 'Confirm payment' 
    };
    return transferTexts[step] || '';
  }, [isWithdraw, isTopup, step]);

  return (
    <main className="transactions">
      <Header />
      <div className="transactions__block">
        <LeftBlock step={step} text={leftBlockText} totalSteps={totalSteps} />
        {isTopup ? (
          <TopUpCard step={step} setStep={setStep} />
        ) : isWithdraw ? (
          <WithdrawCard step={step} setStep={setStep} />
        ) : (
          <TransferMoney step={step} setStep={setStep} />
        )}
      </div>
    </main>
  );
}