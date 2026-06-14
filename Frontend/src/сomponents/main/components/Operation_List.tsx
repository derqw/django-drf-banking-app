import { useState, useEffect } from 'react';
import OperationItem from "./Operation_Item";

interface OperationDataType {
  amount: string;
  amount_display: string;
  sender_card_number: string;
  date: string;
}

export default function OperationList() {
  const [operations, setOperations] = useState<OperationDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/v1/history/short/', {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        setOperations(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (operations.length === 0) {
    return (
      <div className="operation-list-empty">
        <p>Operation not found</p>
      </div>
    );
  }

  return (
    <div className="operation__list operation-list">
      {operations.map((op, index) => (
        <OperationItem 
          key={index} 
          title="Unibank" 
          amount={op.amount} 
          amount_display={op.amount_display} 
        />
      ))}
    </div>
  );
}