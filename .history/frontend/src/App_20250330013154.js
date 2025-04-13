import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookRoomPage from "./pages/User/BookRoomPage"; // Import the booking page component


import { CustomerProvider } from "./pages/Loginpage/adminContext";

function App() {
  return (
    <div className="app">
      <CustomerProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
    
  );
}

export default App;
