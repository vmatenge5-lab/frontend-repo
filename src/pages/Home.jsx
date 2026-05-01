import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div className="bg-primary text-white py-5">
        <div className="container py-3 text-center">
          <i className="bi bi-mortarboard-fill display-3 mb-3 d-block"></i>
          <h1 className="display-5 fw-bold">Student Directory</h1>
          <p className="lead col-md-7 mx-auto">
            A centralised platform to manage and browse student profiles, courses, and academic records.
          </p>
          <div className="mt-4 d-flex gap-3 justify-content-center">
            {user ? (
              <Link to="/students" className="btn btn-light btn-lg px-4">
                <i className="bi bi-people-fill me-2"></i>View Students
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-light btn-lg px-4">Login</Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container py-5">
        <h2 className="text-center mb-4">What you can do</h2>
        <div className="row g-4">
          {[
            { icon: 'bi-search', title: 'Search Students', text: 'Find students by name, ID, or course quickly.' },
            { icon: 'bi-person-plus-fill', title: 'Add Students', text: 'Register new students with full profile details.' },
            { icon: 'bi-pencil-square', title: 'Edit Records', text: 'Keep student information up to date at all times.' },
          ].map((f) => (
            <div className="col-md-4" key={f.title}>
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <i className={`bi ${f.icon} display-5 text-primary mb-3`}></i>
                <h5 className="fw-semibold">{f.title}</h5>
                <p className="text-muted">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
