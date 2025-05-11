import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../../pages/Dashboard';
import Reports from '../../pages/Reports';
import NotFoundPage from '../../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/main_window" element={<DashboardPage />} />
      <Route path="/reports" element={<Reports />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;