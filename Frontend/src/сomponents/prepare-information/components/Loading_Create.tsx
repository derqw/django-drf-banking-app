import { useEffect, useState } from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';

export default function Loading_Create() {
  const [first, setFirst] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirst(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!first) {
      navigate('/');
    }
  }, [first, navigate]);

  return (
    <>
      {first && (
        <div className="wrapper">
        <main className='prepare'>
          <div className="prepare__left-block">
            <p className="prepare__text">Complete?</p>
          </div>
          <div className="prepare__right-block">
            <p className="prepare__text">Wait, we create your card...</p>
            <div className="prepare__animation-block"></div>
          </div>
        </main>
        </div>
      )}
    </>
  );
}
