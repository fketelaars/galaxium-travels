import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';
import { LanguageProvider } from './hooks/useLanguage';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Flights } from './pages/Flights';
import { MyBookings } from './pages/MyBookings';
import { DestinationDetail } from './pages/DestinationDetail';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <UserProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/destinations/:slug" element={<DestinationDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </UserProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

// Made with Bob
