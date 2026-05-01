import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './pages/StudentForm';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/students/add" element={<PrivateRoute><StudentForm /></PrivateRoute>} />
            <Route path="/students/:id" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
            <Route path="/students/:id/edit" element={<PrivateRoute><StudentForm /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
