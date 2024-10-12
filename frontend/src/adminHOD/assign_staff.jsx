import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignStaff = () => {
  const [formData, setFormData] = useState({ staff: '', branch: '' });
  const [staffOptions, setStaffOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    // Fetch staff options
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/manage_staff'); // Adjust the endpoint as needed
        setStaffOptions(response.data); // Assuming response.data is an array of staff
      } catch (error) {
        toast.error('Failed to fetch staff options.');
      }
    };

    // Fetch branch options
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/branches'); // Adjust the endpoint as needed
        setBranchOptions(response.data); // Assuming response.data is an array of branches
      } catch (error) {
        toast.error('Failed to fetch branch options.');
      }
    };

    fetchStaff();
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/assign_staff/', formData); // Adjust the endpoint as needed
      console.log(response.data); // Log the response to debug
      if (response.data.message === 'Staff assigned successfully') {
        toast.success(response.data.message);
        setFormData({ staff: '', branch: '' }); // Reset form
      } else {
        toast.error('Failed to assign staff.');
      }
    } catch (error) {
      toast.error('Error while assigning staff.');
    }
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Assign Staff to Branch</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="p-4 space-y-4">
                  <div className="mb-4">
                    <label htmlFor="staff" className="block text-sm font-medium text-gray-700">Staff</label>
                    <select
                      id="staff"
                      name="staff"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900"
                      value={formData.staff}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Staff</option>
                      {staffOptions.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.first_name} {/* Adjust the property as per your data structure */}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                    <select
                      id="branch"
                      name="branch"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.branch_name} {/* Adjust the property as per your data structure */}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Assign Staff
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

export default AssignStaff;