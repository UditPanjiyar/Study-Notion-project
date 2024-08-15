
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./Pages/Home"
import Navbar from './components/common/Navbar';
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgotPassword from './Pages/ForgotPassword';
import OpenRoute from './components/core/Auth/OpenRoute';
import UpdatePassword from './Pages/UpdatePassword';
import VerifyEmail from './Pages/VerifyEmail';




function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        {/* <Route path="/catalog/:catalog" element={<Catalog />} /> */}

        <Route path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/update-password/:id" element={<UpdatePassword />} />

        <Route path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />



      </Routes>
    </div>
  );
}

export default App;
