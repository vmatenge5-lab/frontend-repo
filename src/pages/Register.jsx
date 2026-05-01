import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
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
      await register(form.name, form.email, form.password);
      navigate('/students');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <h3 className="text-center mb-1">Create an account</h3>
              <p className="text-center text-muted mb-4">Get access to the student directory</p>

              {serverError && <div className="alert alert-danger">{serverError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                {[
                  { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
                  { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
                  { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: 'Repeat password' },
                ].map(({ label, name, type, placeholder }) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type} name={name}
                      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                      value={form[name]} onChange={handleChange}
                      placeholder={placeholder}
                    />
                    {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                  </div>
                ))}

                <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Create Account'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
