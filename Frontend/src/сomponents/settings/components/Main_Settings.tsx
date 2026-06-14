import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Main_Settings() {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    country: '',
    city: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/profile/', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
          }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const profile = data[0];
          setFormData({ 
            full_name: profile.full_name || '',
            mobile_number: profile.mobile_number || '', 
            country: profile.country || '', 
            city: profile.city || ''
          });
          
          if (profile.avatar) {
            setAvatarPreview(profile.avatar);
          }
        }
      } catch {
      }
    };
    
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('mobile_number', formData.mobile_number);
    data.append('country', formData.country);
    data.append('city', formData.city);
    
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/update/profile', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      
      if (response.ok) {
        navigate('/');
      }
    } catch {
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__avatar-block">
        <div className="profile-form__avatar-placeholder">
          {avatarPreview && <img src={avatarPreview} alt="Avatar" className="profile-form__avatar-img" />}
        </div>
        <p className="profile-form__avatar-text">Your avatar</p>
        <label htmlFor="avatar-upload" className="profile-form__avatar-upload">
          <input 
            type="file" 
            id="avatar-upload" 
            className="profile-form__hidden-input" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <span>Choose file</span>
        </label>
      </div>

      <div className="profile-form__grid">
        <label className="profile-form__label">
          <p>Full Name</p>
          <input 
            className="profile-form__input" 
            name="full_name" 
            type="text" 
            value={formData.full_name} 
            onChange={handleInputChange} 
          />
        </label>
        <label className="profile-form__label">
          <p>Mobile Number</p>
          <input 
            className="profile-form__input" 
            name="mobile_number" 
            type="text" 
            value={formData.mobile_number} 
            onChange={handleInputChange} 
          />
        </label>
        <label className="profile-form__label">
          <p>Country</p>
          <input 
            className="profile-form__input" 
            name="country" 
            type="text" 
            value={formData.country} 
            onChange={handleInputChange} 
          />
        </label>
        <label className="profile-form__label">
          <p>City</p>
          <input 
            className="profile-form__input" 
            name="city" 
            type="text" 
            value={formData.city} 
            onChange={handleInputChange} 
          />
        </label>
      </div>

      <button className="profile-form__btn profile-form__btn--save" type="submit">Save</button>
    </form>
  );
}