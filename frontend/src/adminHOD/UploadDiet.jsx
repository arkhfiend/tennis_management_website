import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadDiet = () => {
  const [Branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    pdf: null,
    branch: '',
    batch: '',
    students: []
  });
  const [messages, setMessages] = useState([]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      pdf: e.target.files[0]
    });
  };

  // Fetch branches on component mount
  useEffect(() => {
    axios.get('/api/branches') // Replace with actual API endpoint for branches
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
      axios.post('/api/get_batch', { branch_id: branchId }) // Replace with actual API endpoint for batches
        .then(response => {
          setBatches(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch batches');
        });
    } else {
      setBatches([]);
      setStudents([]);
    }
  };

  // Fetch students when a batch is selected
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    if (selectedBranch && batchId) {
      axios.post('/api/get_student', { branch_id: selectedBranch, batch_id: batchId }) // Replace with actual API endpoint for students
        .then(response => {
          setStudents(response.data);
        })
        .catch(() => {
          console.error('Failed to fetch students');
        });
    } else {
      setStudents([]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('pdf', formData.pdf);
    uploadData.append('branch', formData.branch);
    uploadData.append('batch', formData.batch);
    uploadData.append('students', formData.students);

    axios.post('/api/upload_diet_plan', uploadData) // Replace with actual upload API
      .then(response => {
        setMessages([{ text: 'Diet plan uploaded successfully', type: 'success' }]);
        // Reset form or handle successful response
      })
      .catch(() => {
        setMessages([{ text: 'Failed to upload diet plan', type: 'error' }]);
      });
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Upload Diet Plan</h3>
              </div>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pdf">PDF</label>
                    <input
                      type="file"
                      className="form-control"
                      id="pdf"
                      name="pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="branch">Select Branch</label>
                    <select
                      id="branch"
                      className="form-control"
                      name="branch"
                      onChange={handleBranchChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {Branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="batch">Select Batch</label>
                    <select
                      id="batch-select"
                      className="form-control"
                      name="batch"
                      value={formData.batch}
                      onChange={handleBatchChange}
                      required
                    >
                      <option value="">Select Batch</option>
                      {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="students">Select Students</label>
                    <div id="students-list">
                      {students.length > 0 ? (
                        students.map(student => (
                          <div key={student.id}>
                            <input
                              type="checkbox"
                              name="students"
                              value={student.id}
                              onChange={(e) => {
                                const studentId = e.target.value;
                                setFormData(prevState => ({
                                  ...prevState,
                                  students: e.target.checked
                                    ? [...prevState.students, studentId]
                                    : prevState.students.filter(id => id !== studentId)
                                }));
                              }}
                            />
                            {' '}
                            {student.name}
                          </div>
                        ))
                      ) : (
                        <p>No students available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Messages */}
                {messages.length > 0 && messages.map((message, index) => (
                  <div key={index} className={`alert alert-${message.type}`} style={{ marginTop: '10px' }}>
                    {message.text}
                  </div>
                ))}

                <div className="card-footer">
                  <button type="submit" className="btn btn-primary">Upload and Assign</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadDiet;
