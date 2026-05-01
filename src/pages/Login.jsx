import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      navigate('/students');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-1">Welcome back</h3>
              <p className="text-center text-muted mb-4">Sign in to your account</p>

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email" name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password" name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Sign In'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
