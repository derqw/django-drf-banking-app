import Analytics from './components/Analytics';
import Card from './components/Card';
import Header from './components/Header';
import Nav from './components/Nav';
import Operation from './components/Operation';
import Support from './components/Support';
import './styles.scss';

export default function Main_Page() {
  return (
    <div className="main-wrapper">
      <main className='main'>
        <Header/>
        <div className="main__block">
          <Card/>
          <Nav/> 
          <Support/>
          <Operation/>
          <Analytics/>
        </div>
        
      </main>
    </div>
  )
}
