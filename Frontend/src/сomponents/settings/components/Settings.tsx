import { useState } from 'react';
import Left_Block from './Left_Block';
import Main_Settings from './Main_Settings';
import Change_Password from './Change_Password';
import Header from '../../main/components/Header';
import '../styles.scss';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  return (
    <div className="settings">
      <Header />
      <Left_Block activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="settings__main">
        {activeTab === 'profile' ? <Main_Settings /> : <Change_Password />}
      </div>
    </div>
  );
}