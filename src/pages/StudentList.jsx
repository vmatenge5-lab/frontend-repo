import { useState, useEffect, useCallback } from 'react';
import { studentService, courseService } from '../services/api';
import StudentCard from '../components/StudentCard';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (courseFilter) params.course = courseFilter;
      if (yearFilter) params.year = yearFilter;

      const res = await studentService.getAll(params);
      setStudents(res.data.students);
      setError('');
    } catch {
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, courseFilter, yearFilter]);

  useEffect(() => {
    courseService.getAll().then((res) => setCourses(res.data.courses));
  }, []);

  useEffect(() => {
    const delay = setTimeout(fetchStudents, 300);
    return () => clearTimeout(delay);
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentService.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete student.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Students <span className="badge bg-secondary">{students.length}</span></h2>
        <a href="/students/add" className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i>Add Student
        </a>
      </div>

      {/* Filters */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="">All Years</option>
            {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-people display-4 d-block mb-2"></i>
          No students found.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {students.map((student) => (
            <div className="col" key={student.id}>
              <StudentCard student={student} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
