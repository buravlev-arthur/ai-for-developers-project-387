import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import OwnerLayout from './components/OwnerLayout';
import OwnerCalendarPage from './pages/OwnerCalendarPage';
import EventTypesPage from './pages/EventTypesPage';
import GuestBookingPage from './pages/GuestBookingPage';
import GuestLayout from './components/GuestLayout';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/booking" element={<GuestBookingPage />} />
          </Route>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerCalendarPage />} />
            <Route path="event-types" element={<EventTypesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
