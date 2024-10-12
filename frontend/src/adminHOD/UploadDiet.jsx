import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadDiet = () => {
  const [branches, setBranches] = useState([]);
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
    axios.get('http://localhost:8000/api/branches')
      .then(response => {
        setBranches(response.data);
      })
      .catch(() => {
        console.error('Failed to fetch branches');
      });
  }, []);

  // Fetch batches when a branch is selected
  useEffect(() => {
    if (selectedBranch) {
      axios.get(`http://localhost:8000/api/branches/${selectedBranch}/batches/`)
        .then(response => {
          setBatches(response.data.batches);
        })
        .catch(() => {
          console.error('Failed to fetch batches');
        });
    } else {
      setBatches([]);
      setStudents([]);
    }
  }, [selectedBranch]);

  // Fetch students when a batch is selected
  useEffect(() => {
    if (selectedBatch) {
      axios.get(`/api/branch/${selectedBranch}/batch/${selectedBatch}/student-details/`)
        .then(response => {
          setStudents(response.data.students);
        })
        .catch(() => {
          console.error('Failed to fetch students');
        });
    } else {
      setStudents([]);
    }
  }, [selectedBatch]);

  // Handle branch change
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    setFormData({
      ...formData,
      branch: branchId,
      batch: '',
      students: []
    });
    setBatches([]);
    setSelectedBatch('');
    setStudents([]);
  };

  // Handle batch change
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    setFormData({
      ...formData,
      batch: batchId,
      students: []
    });
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

    axios.post('http://localhost:8000/api/upload_diet_plan/', uploadData) // Replace with actual upload API
      .then(response => {
        toast.success('Diet plan uploaded successfully');
        // Reset form or handle successful response
        setFormData({
          title: '',
          pdf: null,
          branch: '',
          batch: '',
          students: []
        });
        setSelectedBranch('');
        setSelectedBatch('');
        setMessages([]);
      })
      .catch(() => {
        toast.error('Failed to upload diet plan');
      });
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Upload Diet Plan</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-4" encType="multipart/form-data">
                <div className="p-4 space-y-4">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">PDF</label>
                    <input
                      type="file"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      id="pdf"
                      name="pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Select Branch</label>
                    <select
                      id="branch"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="branch"
                      value={formData.branch}
                      onChange={handleBranchChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Select Batch</label>
                    <select
                      id="batch-select"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="batch"
                      value={formData.batch}
                      onChange={handleBatchChange}
                      required
                    >
                      <option value="">Select Batch</option>
                      {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.template_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="students" className="block text-sm font-medium text-gray-700">Select Students</label>
                    <div id="students-list" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
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
                <div className="p-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Upload and Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default UploadDiet;