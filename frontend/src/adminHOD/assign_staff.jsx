import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assign_staff.module.css';

const AssignStaff = () => {
  const [formData, setFormData] = useState({ staff: '', branch: '' });
  const [staffOptions, setStaffOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    // Fetch staff options
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/staff'); // Adjust the endpoint as needed
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
      const response = await axios.post('http://localhost:8000/api/assign_staff', formData); // Adjust the endpoint as needed
      if (response.data.success) {
        toast.success('Staff assigned successfully.');
        setFormData({ staff: '', branch: '' }); // Reset form
      } else {
        toast.error('Failed to assign staff.');
      }
    } catch (error) {
      toast.error('Error while assigning staff.');
    }
  };

  return (
    <section className="content main-div ml-20 pr-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Assign Staff to Branch</h3>
              </div>
              <form role="form" onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="staff">Staff</label>
                    <select
                      id="staff"
                      name="staff"
                      className="form-control"
                      value={formData.staff}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Staff</option>
                      {staffOptions.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} {/* Adjust the property as per your data structure */}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="branch">Branch</label>
                    <select
                      id="branch"
                      name="branch"
                      className="form-control"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} {/* Adjust the property as per your data structure */}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ToastContainer />
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary btn-block">
                    Assign Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssignStaff;