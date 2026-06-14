import logo from '../../../assets/logo.png';

interface OperationItemProps {
  title: string;
  amount: number | string;
  amount_display: string;  
}

export default function Operation_Item({ title, amount, amount_display }: OperationItemProps) {
  const isPlus = amount_display.toLowerCase().includes('plus') || amount_display.includes('+');

  const displayValue = `${isPlus ? '+' : '-'}${amount}`;

  return (
    <div className="operation-list__item">
      <div className="operation-list__left">
        <img src={logo} alt="logo" className="operation-list__icon"/>
        <span className="operation-list__title">{title}</span>
      </div>
      <span className={`operation-list__amount ${isPlus ? 'operation-list__amount--plus' : 'operation-list__amount--minus'}`}>
        {displayValue}
      </span>
    </div>
  );
}