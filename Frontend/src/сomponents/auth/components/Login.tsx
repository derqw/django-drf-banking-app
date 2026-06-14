import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

interface ApiErrors {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

export default function Login() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token || data.access;
        if (token) {
          localStorage.setItem('token', token);
        }
        
        if (data.flag === true) {
          navigate('/');
        } else {
          navigate('/prepare');
        }
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ non_field_errors: ['Server connection error. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth__right-block">
      <span className='auth__span'>
        <img src={logo} alt="UniBank" />
        <p>Sign in</p>
      </span>

      <form className="auth__form" onSubmit={loginUser}>
        {errors.non_field_errors && (
          <div className="auth__error-summary">
            <p className="auth__error-text">{errors.non_field_errors[0]}</p>
          </div>
        )}

        <div className="auth__input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder='UniBank@gmail.com'
            value={email}
            autoComplete="username"
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
            autoComplete="current-password"
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
          value={isLoading ? "Signing in..." : "Sign in"} 
          disabled={isLoading}
        />
      </form>

      <p className="auth__forgot-passwd">Forgot password? <span>Remind</span></p>
      
      {isMobile && (
        <p className='auth__nav'>Don't have an account? <Link to='/register'>Sign up</Link></p>
      )}
    </div>
  );
}