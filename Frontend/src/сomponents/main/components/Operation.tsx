import { useState } from 'react';
import ReactDOM from 'react-dom';
import OperationList from "./Operation_List";
import HistoryModal from "./HistoryModal";

export default function Operation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="operation">
      <div className="operation__top">
        <h2 className="operation__title">Operations</h2>
        <button className="operation__filter-btn" onClick={() => setIsModalOpen(true)}>All</button>
      </div>
      <OperationList />
      
      {isModalOpen && ReactDOM.createPortal(
        <HistoryModal onClose={() => setIsModalOpen(false)} />,
        document.body
      )}
    </div>
  );
}