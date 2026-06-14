import { useState, useEffect } from 'react';
import './styles/analytics.scss';

interface AnalyticsData {
  transfer: number;
  receive: number;
  withdraw: number;
  replenishment: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/Analytics', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return null;

  const items = [
    { label: 'Transfer', value: Number(data.transfer) || 0, color: '#69488d' },
    { label: 'Receive', value: Number(data.receive) || 0, color: '#482f69' },
    { label: 'Withdraw', value: Number(data.withdraw) || 0, color: '#23172f' },
    { label: 'Replenishment', value: Number(data.replenishment) || 0, color: '#0d0407' },
  ].filter(item => item.value > 0);

  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="analytics">
        <h2 className="analytics__title">Analytics</h2>
        <p className='analytics__no-data'>No data available</p>
      </div>
    );
  }

  let currentPercent = 0;
  const gradientParts = items.map(item => {
    const percent = (item.value / total) * 100;
    const start = currentPercent;
    currentPercent += percent;
    return `${item.color} ${start}% ${currentPercent}%`;
  }).join(', ');

  const chartStyle = {
    background: `conic-gradient(${gradientParts})`
  };

  return (
    <div className="analytics">
      <div className="analytics__top">
        <h2 className="analytics__title">Analytics</h2>
      </div>
      
      <div className="analytics__content">
        <div className="analytics__chart-block">
          <div className="analytics__chart" style={chartStyle}>
            <div className="analytics__chart-inner"></div>
          </div>
        </div>

        <div className="analytics__info">
          <div className="analytics__list">
            {items.map((item, index) => (
              <div key={index} className="analytics__item">
                <div 
                  className="analytics__indicator" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="analytics__label">
                  {item.label}: {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
          
          <button className="analytics__view-all">View all</button>
        </div>
      </div>
    </div>
  );
}