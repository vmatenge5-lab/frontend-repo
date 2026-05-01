import { Link } from 'react-router-dom';

export default function StudentCard({ student, onDelete }) {
  const gpaColor = student.gpa >= 3.5 ? 'success' : student.gpa >= 2.5 ? 'warning' : 'danger';

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title mb-0">
              {student.first_name} {student.last_name}
            </h5>
            <small className="text-muted">{student.student_id}</small>
          </div>
          <span className={`badge bg-${gpaColor}`}>GPA {Number(student.gpa).toFixed(2)}</span>
        </div>

        <p className="card-text mb-1">
          <i className="bi bi-envelope me-2 text-muted"></i>
          <small>{student.email}</small>
        </p>
        <p className="card-text mb-1">
          <i className="bi bi-book me-2 text-muted"></i>
          <small>{student.course_name || 'No course assigned'}</small>
        </p>
        <p className="card-text mb-3">
          <i className="bi bi-calendar me-2 text-muted"></i>
          <small>Year {student.year_of_study}</small>
        </p>

        <div className="d-flex gap-2">
          <Link to={`/students/${student.id}`} className="btn btn-sm btn-outline-primary flex-fill">
            <i className="bi bi-eye me-1"></i>View
          </Link>
          <Link to={`/students/${student.id}/edit`} className="btn btn-sm btn-outline-secondary flex-fill">
            <i className="bi bi-pencil me-1"></i>Edit
          </Link>
          <button
            onClick={() => onDelete(student.id)}
            className="btn btn-sm btn-outline-danger"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
