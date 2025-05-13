import { BrowserRouter as Router, Route, Routes } from 'react-router';
import App from './components/App/index';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

export const RouterComponent = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>
);
