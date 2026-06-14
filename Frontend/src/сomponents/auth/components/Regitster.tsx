import { useEffect, useState } from 'react';
import logo from '../../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

interface ApiErrors {
  login?: string[];
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

export default function Register() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const [login, setLogin] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<ApiErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const register = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/v1/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ login, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token || data.access;
        if (token) {
          localStorage.setItem('token', token);
        }
        navigate('/prepare');
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ non_field_errors: ['Server connection error. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth__right-block">
      <span className='auth__span'>
        <img src={logo} alt="UniBank" />
        <p>Sign up</p>
      </span>

      <form className="auth__form" onSubmit={register}>
        {errors.non_field_errors && (
          <div className="auth__error-summary">
            <p className="auth__error-text">{errors.non_field_errors[0]}</p>
          </div>
        )}

        <div className="auth__input-group">
          <label htmlFor="login">Login</label>
          <input 
            type="text" 
            name="login" 
            id="login" 
            placeholder='Uni user'
            value={login}
            autoComplete="username"
            className={errors.login ? 'auth__input--error' : ''}
            onChange={(e) => {
              setLogin(e.target.value);
              if (errors.login) setErrors(prev => ({ ...prev, login: undefined }));
            }}
          />
          {errors.login && <p className="auth__error-text">{errors.login[0]}</p>}
        </div>

        <div className="auth__input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder='UniBank@gmail.com'
            value={email}
            autoComplete="email"
            className={errors.email ? 'auth__input--error' : ''}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && <p className="auth__error-text">{errors.email[0]}</p>}
        </div>

        <div className="auth__input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder='*********'
            value={password}
            autoComplete="new-password"
            className={errors.password ? 'auth__input--error' : ''}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
            }}
          />
          {errors.password && <p className="auth__error-text">{errors.password[0]}</p>}
        </div>

        <input 
          type="submit" 
          value={isLoading ? "Registering..." : "Sign up"} 
          disabled={isLoading}
        />
      </form>

      {isMobile && (
        <p className='auth__nav'>Have account? <Link to='/login'>Sign in</Link></p>
      )}
    </div>
  );
}