import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Registration from './components/registration/registration';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="home-container">
          <div className="hero-content">
            <h1>Welcome to Auth App</h1>
            <p className="subtitle">Secure, fast, and modern authentication for your apps.</p>
            <div className="cta-buttons">
              <a href="/login" className="btn btn-primary">Login</a>
              <a href="/register" className="btn btn-outline">Register</a>
            </div>
          </div>
        </div>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
    </Routes>


  );
}

export default App;
