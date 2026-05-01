import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentService } from '../services/api';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentService.getById(id)
      .then((res) => setStudent(res.data.student))
      .catch(() => setError('Student not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this student permanently?')) return;
    await studentService.delete(id);
    navigate('/students');
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  const gpaColor = student.gpa >= 3.5 ? 'success' : student.gpa >= 2.5 ? 'warning' : 'danger';

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/students">Students</Link></li>
          <li className="breadcrumb-item active">{student.first_name} {student.last_name}</li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 className="mb-1">{student.first_name} {student.last_name}</h2>
              <span className="text-muted">{student.student_id}</span>
            </div>
            <span className={`badge bg-${gpaColor} fs-6`}>GPA {Number(student.gpa).toFixed(2)}</span>
          </div>

          <div className="row g-3">
            {[
              { icon: 'bi-envelope', label: 'Email', value: student.email },
              { icon: 'bi-telephone', label: 'Phone', value: student.phone || 'Not provided' },
              { icon: 'bi-book', label: 'Course', value: student.course_name || 'Not assigned' },
              { icon: 'bi-calendar2', label: 'Year of Study', value: `Year ${student.year_of_study}` },
              { icon: 'bi-clock-history', label: 'Registered', value: new Date(student.created_at).toLocaleDateString() },
            ].map((item) => (
              <div className="col-sm-6" key={item.label}>
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block mb-1">
                    <i className={`bi ${item.icon} me-1`}></i>{item.label}
                  </small>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link to={`/students/${id}/edit`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-outline-danger">
              <i className="bi bi-trash me-2"></i>Delete
            </button>
            <Link to="/students" className="btn btn-outline-secondary ms-auto">
              <i className="bi bi-arrow-left me-2"></i>Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
