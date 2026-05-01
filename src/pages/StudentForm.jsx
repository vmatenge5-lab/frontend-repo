import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { studentService, courseService } from '../services/api';

const EMPTY_FORM = {
  student_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  course_id: '',
  year_of_study: 1,
  gpa: '',
};

export default function StudentForm() {
  const { id } = useParams();       // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    courseService.getAll().then((res) => setCourses(res.data.courses));

    if (isEdit) {
      studentService.getById(id).then((res) => {
        const s = res.data.student;
        setForm({
          student_id: s.student_id,
          first_name: s.first_name,
          last_name: s.last_name,
          email: s.email,
          phone: s.phone || '',
          course_id: s.course_id || '',
          year_of_study: s.year_of_study,
          gpa: s.gpa,
        });
      });
    }
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.student_id.trim()) e.student_id = 'Student ID is required';
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.year_of_study || form.year_of_study < 1 || form.year_of_study > 7) {
      e.year_of_study = 'Year must be between 1 and 7';
    }
    if (form.gpa !== '' && (form.gpa < 0 || form.gpa > 4)) {
      e.gpa = 'GPA must be between 0.00 and 4.00';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      if (isEdit) {
        await studentService.update(id, form);
      } else {
        await studentService.create(form);
      }
      navigate('/students');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label, name, type = 'text', extra = {}) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]}
        onChange={handleChange}
        {...extra}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/students">Students</Link></li>
          <li className="breadcrumb-item active">{isEdit ? 'Edit Student' : 'Add Student'}</li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="mb-4">{isEdit ? 'Edit Student' : 'Add New Student'}</h3>

          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">{field('Student ID', 'student_id', 'text', { placeholder: 'e.g. STU-2024-006' })}</div>
              <div className="col-md-6">{field('First Name', 'first_name')}</div>
              <div className="col-md-6">{field('Last Name', 'last_name')}</div>
              <div className="col-md-6">{field('Email Address', 'email', 'email')}</div>
              <div className="col-md-6">{field('Phone (optional)', 'phone', 'tel')}</div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Course</label>
                <select
                  name="course_id"
                  className="form-select"
                  value={form.course_id}
                  onChange={handleChange}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">{field('Year of Study', 'year_of_study', 'number', { min: 1, max: 7 })}</div>
              <div className="col-md-3">{field('GPA (0.00 – 4.00)', 'gpa', 'number', { step: '0.01', min: 0, max: 4 })}</div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  : <><i className="bi bi-check-lg me-2"></i>{isEdit ? 'Update Student' : 'Add Student'}</>
                }
              </button>
              <Link to="/students" className="btn btn-outline-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
