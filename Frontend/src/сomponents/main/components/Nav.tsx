import transaction from '../../../assets/transaction.png';
import withdrawal from '../../../assets/withdrawal.png';
import topUp from '../../../assets/topUp.png';
import './styles/nav.scss';

export default function Nav() {
  return (
    <div className="nav">
      <div className="nav__dots">
        <span className="nav__dot nav__dot--active"></span>
        <span className="nav__dot"></span>
        <span className="nav__dot"></span>
      </div>
      
      <div className="nav__icons">
        <a href="/transfer" className="nav__icon">
          <img src={transaction} alt="transaction" />
        </a>
        <a href="/withdraw" className="nav__icon">
          <img src={withdrawal} alt="withdrawal" />
        </a>
        <a href="/topup" className="nav__icon">
          <img src={topUp} alt="topUp" />
        </a>
      </div>
    </div>
  );
}