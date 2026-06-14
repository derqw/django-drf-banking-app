import { Link } from 'react-router-dom';
import qr from '../../../assets/qr.png';
export default function Left_Block() {
  return (
    <div className="auth__left-block">
          <img src={qr} alt="qr" className='auth__qr'/>
        <p className='auth__qr-text'>Open on your mobile device for quick authorization</p>
        {location.pathname === '/register' ? (<p className='auth__nav'>Have account? <Link to = '/login'>Sign up</Link></p>) : (<p className='auth__nav'>Haven`t account? <Link to = '/register'>Sign in</Link></p>)}
      </div>
  )
}
