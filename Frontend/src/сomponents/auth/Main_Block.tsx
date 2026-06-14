import Login from './components/Login';
import './styles.scss';
import { useLocation } from 'react-router-dom';
import Regitster from './components/Regitster';
import Left_Block from './components/Left_Block';
import Prepare from '../prepare-information/components/Prepare';

export default function Main_Block() {
  const location = useLocation();
  return (
    <div className='wrapper'>
    <main className="auth">

      {location.pathname === '/prepare' ? <Prepare/> : (
        <>
          <Left_Block/>
          {location.pathname === '/register' ? <Regitster/> : <Login/>}
        </>
      )}

    </main>
    </div>
  )
}
