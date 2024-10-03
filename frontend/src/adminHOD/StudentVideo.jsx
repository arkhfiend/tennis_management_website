import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentVideo = () => {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [Branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    // Fetch branches on mount
    axios.get('/api/get_branches/')
      .then(response => setBranches(response.data))
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value;
    setBranchId(selectedBranchId);

    // Fetch batches based on selected branch
    if (selectedBranchId) {
      axios.get(`/api/get_batches_Upload_Video/?branch_id=${selectedBranchId}`)
        .then(response => setBatches(response.data))
        .catch(error => console.error('Error fetching batches:', error));
    } else {
      setBatches([]);
      setStudents([]);
    }
  };

  const handleBatchChange = (e) => {
    const selectedBatchId = e.target.value;
    setBatchId(selectedBatchId);

    // Fetch students based on selected batch
    if (branchId && selectedBatchId) {
      axios.post('/api/get_students_up/', {
        branch_id: branchId,
        batch_id: selectedBatchId,
        csrfmiddlewaretoken: '{{ csrf_token }}' // Replace with actual CSRF token if needed
      })
        .then(response => setStudents(response.data))
        .catch(error => console.error('Error fetching students:', error));
    } else {
      setStudents([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);
    formData.append('branch', branchId);
    formData.append('batch', batchId);
    formData.append('student', studentId);
    formData.append('csrfmiddlewaretoken', '{{ csrf_token }}'); // Replace with actual CSRF token

    axios.post('/api/upload_video/', formData)
      .then(response => {
        alert('Video uploaded successfully');
      })
      .catch(error => console.error('Error uploading video:', error));
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Upload and Assign Video</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="title">Video Title:</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="video">Select Video:</label>
                    <input
                      type="file"
                      name="video"
                      id="video"
                      className="form-control"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files[0])}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="branch">Select Branch:</label>
                    <select
                      name="branch"
                      id="branch"
                      className="form-control"
                      value={branchId}
                      onChange={handleBranchChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {Branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="batch">Select Batch:</label>
                    <select
                      name="batch"
                      id="batch"
                      className="form-control"
                      value={batchId}
                      onChange={handleBatchChange}
                      required
                    >
                      <option value="">Select Batch</option>
                      {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {batch.template__name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="student">Select Student:</label>
                    <select
                      name="student"
                      id="student-list"
                      className="form-control"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">Upload Video</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentVideo;
