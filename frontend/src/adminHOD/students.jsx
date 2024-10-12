import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Students = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('selectedBranch') || '');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(localStorage.getItem('selectedBatch') || '');
  const [students, setStudents] = useState(JSON.parse(localStorage.getItem('students')) || []);
  const [showButtons, setShowButtons] = useState(students.length > 0);
  const navigate = useNavigate();

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
    }
  }, [selectedBranch]);

  // Save selected branch to localStorage
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    localStorage.setItem('selectedBranch', branchId);
    setBatches([]);
    setSelectedBatch('');
    localStorage.removeItem('selectedBatch');
    localStorage.removeItem('students');
    setStudents([]);
    setShowButtons(false);
  };

  // Save selected batch to localStorage
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    localStorage.setItem('selectedBatch', batchId);
  };

  // Fetch students based on selected batch and save to localStorage
  const handleFetchStudents = () => {
    if (selectedBatch) {
      axios.get(`http://localhost:8000/api/branch/${selectedBranch}/batch/${selectedBatch}/student-details/`)
        .then(response => {
          setStudents(response.data.students);
          localStorage.setItem('students', JSON.stringify(response.data.students));
          setShowButtons(true); // Show buttons after fetching students
        })
        .catch(() => {
          console.error('Failed to fetch students');
        });
    }
  };

  const handleDelete = async (id) => {
    console.log(`Attempting to delete student with id ${id}`);
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/delete_student/${id}/`);  // Use DELETE method
        const updatedStudents = students.filter(student => student.id !== id);  // Remove deleted student from state
        setStudents(updatedStudents);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        toast.success('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student', error.response ? error.response.data : error.message);
        toast.error('Error deleting student!');
      }
    }
  };
  
  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Students</h3>
                {showButtons && (
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-primary border border-black-500 shadow-lg"
                      onClick={() => navigate('/admin/add_student', { state: { branchId: selectedBranch, batchId: selectedBatch } })}
                    >
                      Add Student
                    </button>
                    <button className="btn btn-info" onClick={() => navigate('/admin/student_feedback')}>
                      Student Feedback
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4">
                {/* Branch Selection */}
                <div className="form-group mb-4">
                  <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700">Select Branch</label>
                  <select
                    className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    id="branch-select"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Selection */}
                <div className="form-group mb-4">
                  <label htmlFor="batch-select" className="block text-sm font-medium text-gray-700">Select Batch</label>
                  <select
                    className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    id="batch-select"
                    value={selectedBatch}
                    onChange={handleBatchChange}
                  >
                    <option value="">Select Batch</option>
                    {Array.isArray(batches) && batches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.template_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fetch Students Button */}
                <button className="btn btn-success mb-4" onClick={handleFetchStudents}>
                  Fetch Students
                </button>

                {/* Student Table */}
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">First Name</th>
                        <th className="px-4 py-2">Last Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Contact</th>
                        <th className="px-4 py-2">Gender</th>
                        <th className="px-4 py-2">Date of Birth</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="border px-4 py-2 text-center">No students available</td>
                        </tr>
                      ) : (
                        students.map((student, index) => (
                          <tr key={student.id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{student.username}</td>
                            <td className="border px-4 py-2">{student.first_name}</td>
                            <td className="border px-4 py-2">{student.last_name}</td>
                            <td className="border px-4 py-2">{student.email}</td>
                            <td className="border px-4 py-2">{student.contact}</td>
                            <td className="border px-4 py-2">{student.gender}</td>
                            <td className="border px-4 py-2">{student.dob}</td>
                            <td className="border px-4 py-2">
                              <div className="flex space-x-2">
                                <FaEdit
                                  onClick={() => navigate(`/admin/edit_student/${student.id}`, { state: { student } })}
                                  className="text-green-500 cursor-pointer"
                                  size={20}
                                />
                                <FaTrash
                                  onClick={() => handleDelete(student.id)}
                                  className="text-red-500 cursor-pointer"
                                  size={20}
                                />
                              </div>
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
      </div>
      <ToastContainer />
    </section>
  );
};

export default Students;