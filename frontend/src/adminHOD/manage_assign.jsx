import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageAssign = () => {
  const [assigns, setAssign] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assign data from the API
    const fetchAssign = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/manage_assign');
        setAssign(response.data); // Assuming response.data is an array of assigns
      } catch (error) {
        toast.error('Failed to fetch assigns.');
      }
    };

    fetchAssign();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this assign?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/delete-assign/${id}/`); // Changed to DELETE method
        if (response.data.message === "Assignment deleted successfully") {
          toast.success('Assign deleted successfully.');
          setAssign(assigns.filter((assign) => assign.id !== id)); // Remove the deleted assign from state
        } else {
          toast.error('Failed to delete assign.');
        }
      } catch (error) {
        toast.error('Error while deleting assign.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssigns = assigns.filter((assign) =>
    assign.staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assign.branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Assign Details</h3>
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
                    {filteredAssigns.length > 0 ? (
                      filteredAssigns.map((assign, index) => (
                        <tr key={assign.id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{assign.staff.name}</td>
                          <td className="border px-4 py-2">{assign.branch.name}</td>
                          <td className="border px-4 py-2">
                            <div className="flex space-x-2">
                              <FaEdit
                                onClick={() => navigate(`/admin/edit_assign/${assign.id}`, { state: { assign } })}
                                className="text-green-500 cursor-pointer"
                                size={20}
                              />
                              <FaTrash
                                onClick={() => handleDelete(assign.id)}
                                className="text-red-500 cursor-pointer"
                                size={20}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="border px-4 py-2 text-center">No assigns found.</td>
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

export default ManageAssign;