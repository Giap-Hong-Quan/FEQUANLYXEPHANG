import React,{useState} from 'react';
import './App.css';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { SignalRProvider } from './helpers/SignalRProvider';
function App() {
  const [isLogined, setIsLogined] = useState(false);
  const receiveLogin = (isLogined:boolean) => {
    setIsLogined(isLogined);
  }
  return (
    <div>
    {localStorage.getItem('token')?
    <SignalRProvider>
        <Dashboard />
    </SignalRProvider>
    :
    !isLogined?<Login handleSuccess={receiveLogin} />:
    <SignalRProvider>
      <Dashboard />
    </SignalRProvider>
    }   
    </div>
  );
}
export default App;
