import './style/index.scss'
import { useSelector } from 'react-redux';
import { RootState } from './store/types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Topbar from './components/Topbar';
import MapView from './pages/MapView';
import SensorData from './pages/SensorData';
import UserGroup from './pages/UserGroup';
import Reports from './pages/Reports';
import Account from './pages/Account';

const App = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return     <>
   <Router>
      {!isAuthenticated ? (
        <div>
          <LoginForm />
        </div>
      ) : (
        <div>
          <Sidebar />
          <div>
            <Topbar />
            <div>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/sensors" element={<SensorData />} />
                <Route path="/user-group" element={<UserGroup />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/account" element={<Account />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
    </>
}

    


export default App;