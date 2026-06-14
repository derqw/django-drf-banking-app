import { useNavigate } from 'react-router-dom';

interface LeftBlockProps {
  activeTab: 'profile' | 'password';
  setActiveTab: (tab: 'profile' | 'password') => void;
}

export default function Left_Block({ activeTab, setActiveTab }: LeftBlockProps) {
  const navigate = useNavigate();

  return (
    <div className="settings__left-block left-block">
      <button className={`left-block__btn ${activeTab === 'profile' ? 'left-block__btn--active' : ''}`} onClick={() => setActiveTab('profile')}>
        Edit Profile
      </button>
      <button className={`left-block__btn ${activeTab === 'password' ? 'left-block__btn--active' : ''}`} onClick={() => setActiveTab('password')}>
        Change Password
      </button>
      
      <button className="left-block__btn left-block__btn--back" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}