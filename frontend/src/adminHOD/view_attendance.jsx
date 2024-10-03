import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAttendance = ({ branches }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch batches when a branch is selected
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);

    if (branchId) {
      axios.post('/admin_get_batches', { branch_id: branchId })
        .then((response) => {
          setBatches(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch batches');
        });
    } else {
      setBatches([]);
    }
  };

  // Fetch attendance data when a batch is selected
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);

    if (batchId) {
      axios.post('/admin_get_attendance_students', { batch_id: batchId })
        .then((response) => {
          setAttendanceData(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch attendance data');
        });
    } else {
      setAttendanceData([]);
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Student Attendance Report</h3>
              </div>

              <div className="card-body">
                {/* Branch Selection */}
                <div className="form-group">
                  <label htmlFor="branch-select">Branch</label>
                  <select
                    className="form-control"
                    id="branch-select"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                  >
                    <option value="">Select Branch</option>
                    {Branches.map((branch) => (
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
                    id="batch-select"
                    className="form-control"
                    value={selectedBatch}
                    onChange={handleBatchChange}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attendance Table */}
                <table id="attendance_table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Sessions Attended</th>
                      <th>Attendance Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.length === 0 ? (
                      <tr>
                        <td colSpan="3">No attendance data available</td>
                      </tr>
                    ) : (
                      attendanceData.map((student) => (
                        <tr key={student.name}>
                          <td>{student.name}</td>
                          <td>{student.sessions_attended}</td>
                          <td>
                            <ul>
                              {student.attendance_dates.map((date, index) => (
                                <li key={index}>
                                  {date.date} {date.time}
                                </li>
                              ))}
                            </ul>
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

export default ViewAttendance;
