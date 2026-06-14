import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Change_Password() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/change-password/', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        })
      });

      if (response.ok) {
        navigate('/');
      } else {
        const errorData = await response.json();
        
        if (errorData.old_password) {
          setError(Array.isArray(errorData.old_password) ? errorData.old_password[0] : errorData.old_password);
        } else if (errorData.new_password) {
          setError(Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          setError('Invalid old password or weak new password');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__grid profile-form__grid--password">
        <label className="profile-form__label">
          <p>Old Password</p>
          <input 
            className="profile-form__input" 
            name="old_password" 
            type="password" 
            required
            value={formData.old_password} 
            onChange={handleInputChange} 
          />
        </label>

        <label className="profile-form__label">
          <p>New Password</p>
          <input 
            className="profile-form__input" 
            name="new_password" 
            type="password" 
            required
            value={formData.new_password} 
            onChange={handleInputChange} 
          />
        </label>

        <label className="profile-form__label">
          <p>Confirm New Password</p>
          <input 
            className="profile-form__input" 
            name="confirm_password" 
            type="password" 
            required
            value={formData.confirm_password} 
            onChange={handleInputChange} 
          />
        </label>
      </div>

      {error && <p className="profile-form__error">{error}</p>}

      <button className="profile-form__btn profile-form__btn--save" type="submit">
        Save
      </button>
    </form>
  );
}