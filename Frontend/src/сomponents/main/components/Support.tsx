import './styles/support.scss';
import qa from '../../../assets/qa.png'
import support from '../../../assets/support.png';
import documentation from '../../../assets/documentation.png';

export default function Support() {
  return (
    <div className="support">
      <div className="support__top">
        <div className="support__currency">
          <span className="support__symbol">$</span>
          <span className="support__value">44/42</span>
        </div>
        <div className="support__currency">
          <span className="support__symbol">€</span>
          <span className="support__value">52/50</span>
        </div>
      </div>
      <div className="support__blocks">
        <div className="support__block">
          <img src={qa} alt="qa" />
        </div>
        <div className="support__block">
          <img src={support} alt="support" />
        </div>
        <div className="support__block">
          <img src={documentation} alt="documentation" />
        </div>
      </div>
    </div>
  )
}
