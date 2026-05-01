import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>Student Directory
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/students">Students</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/students/add">Add Student</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
