import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../../pages/Dashboard';
import Reports from '../../pages/Reports';
import NotFoundPage from '../../pages/NotFoundPage';
import UsersPage from '../../pages/UsersPage';
import SensorDetailsPage from '../../pages/SensorDetailsPage';
import MapPage from '../../pages/Map';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/main_window" element={<DashboardPage />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/sensors/:networkId/:sensorId" element={<SensorDetailsPage />} /> 
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
