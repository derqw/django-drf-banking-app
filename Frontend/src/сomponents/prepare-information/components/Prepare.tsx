import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading_Create from './Loading_Create';
import './styles.scss';

interface ApiErrors {
  full_name?: string[];
  mobile_number?: string[];
  country?: string[];
  city?: string[];
  date_of_birth?: string[];
  non_field_errors?: string[];
}

export default function Prepare() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [errors, setErrors] = useState<ApiErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const formatDateToBackend = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('mobile_number', phone);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('date_of_birth', formatDateToBackend(dateOfBirth));
    if (avatar) formData.append('avatar', avatar);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/v1/verification/', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {isSubmitted ? (
        <Loading_Create />
      ) : (
        <main className="prepare">
          <div className="prepare__left-block">
            <p className="prepare__text-1">Prepare...</p>
            <p className="prepare__text-2">Add some information about you.</p>
            <p className="prepare__text-3">This information helps our work. Please, write trusted info.</p>
            <button className="prepare__btn" type="button" onClick={() => navigate(-1)}>Return</button>
          </div>

          <div className="prepare__right-block">
            <form className="prepare__form" onSubmit={handleSave}>
              {errors.non_field_errors && (
                <div className="prepare__error-summary">
                  <p className="prepare__error-text">{errors.non_field_errors}</p>
                </div>
              )}

              <div className="prepare__avatar-block">
                <div className="prepare__avatar-placeholder">
                  {avatarPreview && <img src={avatarPreview} alt="Avatar" />}
                </div>
                <p className="prepare__avatar-text">Your avatar</p>
                <label htmlFor="avatar" className="prepare__avatar-upload">
                  <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} />
                  <span>Choose file</span>
                </label>
              </div>

              <div className="prepare__grid-block">
                <label>
                  Full name
                  <input type="text" name="fullName" placeholder="Full name" value={fullName} className={errors.full_name ? 'prepare__input--error' : ''} onChange={(e) => setFullName(e.target.value)} />
                  {errors.full_name && <p className="prepare__error-text">{errors.full_name}</p>}
                </label>
                <label>
                  Phone
                  <input type="text" name="phone" placeholder="+380665555555" value={phone} className={errors.mobile_number ? 'prepare__input--error' : ''} onChange={(e) => setPhone(e.target.value)} />
                  {errors.mobile_number && <p className="prepare__error-text">{errors.mobile_number}</p>}
                </label>
                <label>
                  Country
                  <input type="text" name="country" placeholder="Country" value={country} className={errors.country ? 'prepare__input--error' : ''} onChange={(e) => setCountry(e.target.value)} />
                  {errors.country && <p className="prepare__error-text">{errors.country}</p>}
                </label>
                <label>
                  City
                  <input type="text" name="city" placeholder="City" value={city} className={errors.city ? 'prepare__input--error' : ''} onChange={(e) => setCity(e.target.value)} />
                  {errors.city && <p className="prepare__error-text">{errors.city}</p>}
                </label>
              </div>

              <label>
                Date of Birth
                <input type="date" name="date" id='date' value={dateOfBirth} className={errors.date_of_birth ? 'prepare__input--error' : ''} onChange={(e) => setDateOfBirth(e.target.value)} />
                {errors.date_of_birth && <p className="prepare__error-text">{errors.date_of_birth}</p>}
              </label>

              <button className="prepare__btn" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}