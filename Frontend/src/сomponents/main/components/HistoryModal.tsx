import { useEffect, useState, useRef } from 'react';
import logo from '../../../assets/logo.png';
import './styles/operation.scss';

export default function HistoryModal({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/v1/history/long/', { 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    })
    .then(res => res.json())
    .then(setData);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" ref={modalRef}>
        {!selected ? (
          <>
            <div className="modal-header">
              <h2>Operations</h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>
            <div className="modal-scroll">
              {data.map((op, i) => (
                <div key={i} className="op-row" onClick={() => setSelected(op)}>
                  <div className="op-left">
                    <img src={logo} alt="logo" className="op-logo" />
                    <span className="op-title">Unibank</span>
                  </div>
                  <div className="op-right">
                    <span className={`op-amount ${op.amount_display === 'plus' ? 'positive' : 'negative'}`}>
                      {op.amount_display === 'plus' ? '+' : '-'} {op.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="modal-detail">
            <button className="back-btn" onClick={() => setSelected(null)}>← Back</button>
            <img src={logo} alt="logo" className="detail-logo" />
            <h2 className={`detail-amount ${selected.amount_display === 'plus' ? 'positive' : 'negative'}`}>
              {selected.amount_display === 'plus' ? '+' : '-'} {selected.amount}
            </h2>
            <div className="detail-info">
              <p><span>Sender:</span> {selected.sender_card_number}</p>
              <p><span>Date:</span> {new Date(selected.date).toLocaleDateString()}</p>
              <p><span>Time:</span> {new Date(selected.date).toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}