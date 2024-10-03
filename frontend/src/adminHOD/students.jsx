import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [Branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);

  // Fetch branches on component mount
  useEffect(() => {
    axios.get('http://localhost:8000/api/branches')
      .then(response => {
        setBranches(response.data);
      })
      .catch(() => {
        console.error('Failed to fetch branches');
      });
  }, []);

  // Fetch batches when a branch is selected
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);

    if (branchId) {
      axios.post('http://localhost:8000/api/branches/$(branchId)/batches/', { branch_id: branchId })
        .then(response => {
          setBatches(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch batches');
        });
    } else {
      setBatches([]);
    }
  };

  const handleFetchStudents = () => {
    if (selectedBatch) {
      axios.post('/api/students', { batch_id: selectedBatch })
        .then(response => {
          setStudents(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch students');
        });
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Students</h3>
                <div className="card-tools">
                  <button className="btn btn-primary" onClick={() => window.location.href='/add_student'}>
                    Add Student
                  </button>
                  <button className="btn btn-secondary" onClick={() => window.location.href='/manage_student'}>
                    Manage Students
                  </button>
                  <button className="btn btn-info" onClick={() => window.location.href='/student_feedback'}>
                    Student Feedback
                  </button>
                </div>
              </div>

              <div className="card-body">
                {/* Branch Selection */}
                <div className="form-group">
                  <label htmlFor="branch-select">Select Branch</label>
                  <select
                    className="form-control"
                    id="branch-select"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                  >
                    <option value="">Select Branch</option>
                    {Branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Selection */}
                <div className="form-group">
                  <label htmlFor="batch-select">Select Batch</label>
                  <select
                    className="form-control"
                    id="batch-select"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fetch Students Button */}
                <button className="btn btn-success" onClick={handleFetchStudents}>
                  Fetch Students
                </button>

                {/* Student Table */}
                <table className="table table-hover mt-3">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Profile Pic</th>
                      <th>Last Login</th>
                      <th>Date Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="11">No students available</td>
                      </tr>
                    ) : (
                      students.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>{student.id}</td>
                          <td>{student.first_name}</td>
                          <td>{student.last_name}</td>
                          <td>{student.username}</td>
                          <td>{student.email}</td>
                          <td>{student.gender}</td>
                          <td><img src={student.profile_pic} style={{ width: '100px' }} alt="Profile Pic"/></td>
                          <td>{student.last_login}</td>
                          <td>{student.date_joined}</td>
                          <td>
                            <button className="btn btn-success" onClick={() => window.location.href=`/edit_student/${student.id}`}>Edit</button>
                            <button className="btn btn-danger" onClick={() => window.location.href=`/delete_student/${student.id}`}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Students;
