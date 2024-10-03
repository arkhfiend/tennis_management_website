import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assignment data from the API
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/manage_assign');
        setAssignments(response.data); // Assuming response.data is an array of assignments
      } catch (error) {
        toast.error('Failed to fetch assignments.');
      }
    };

    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    if (confirmDelete) {
      try {
        const response = await axios.post(`http://localhost:8000/api/delete-assign/${id}`); // Adjust the endpoint as needed
        if (response.data.success) {
          toast.success('Assignment deleted successfully.');
          setAssignments(assignments.filter((assignment) => assignment.id !== id)); // Remove the deleted assignment from state
        } else {
          toast.error('Failed to delete assignment.');
        }
      } catch (error) {
        toast.error('Error while deleting assignment.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    `${assignment.staff.first_name} ${assignment.staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Assignment Details</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">No.</th>
                      <th className="px-4 py-2">Staff Name</th>
                      <th className="px-4 py-2">Branch Name</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.map((assignment, index) => (
                        <tr key={assignment.id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{`${assignment.staff.first_name} ${assignment.staff.last_name}`}</td>
                          <td className="border px-4 py-2">{assignment.branch.branch_name}</td>
                          <td className="border px-4 py-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/edit_assign/${assignment.id}`, { state: { assignment } })}
                                className="btn btn-success"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(assignment.id)}
                                className="btn btn-danger"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="border px-4 py-2 text-center">No assignments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ManageAssignments;