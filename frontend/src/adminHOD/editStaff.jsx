import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditStaff = () => {
  const { staffId } = useParams();
  const location = useLocation();
  const [staff, setStaff] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    salary: '',
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (location.state && location.state.staff) {
      const staffData = location.state.staff;
      setStaff({
        email: staffData.email,
        firstName: staffData.first_name,
        lastName: staffData.last_name,
        username: staffData.username,
        salary: staffData.salary,
      });
    } else {
      // Fetch staff data from API if not passed through state
      axios.get(`http://localhost:8000/api/edit_staff_save/${staffId}`).then((response) => {
        const staffData = response.data;
        setStaff({
          email: staffData.admin.email,
          firstName: staffData.admin.first_name,
          lastName: staffData.admin.last_name,
          username: staffData.admin.username,
          salary: staffData.salary,
        });
      });
    }
  }, [staffId, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaff({
      ...staff,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/edit_staff_save', {
        email: staff.email,
        first_name: staff.firstName,
        last_name: staff.lastName,
        username: staff.username,
        salary: staff.salary,
        staff_id: staffId,
      })
      .then((response) => {
        toast.success('Staff updated successfully!');
        setMessages([{ tags: 'success', text: 'Staff updated successfully!' }]);
      })
      .catch((error) => {
        toast.error('Error updating staff!');
        setMessages([{ tags: 'error', text: 'Error updating staff!' }]);
      });
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Edit Staff</h3>
              </div>
              <form role="form" onSubmit={handleSubmit} className="p-4">
                <div className="p-4 space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email salary</label>
                    <input
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="email"
                      placeholder="Enter email"
                      value={staff.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="First Name"
                      name="firstName"
                      value={staff.firstName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Last Name"
                      name="lastName"
                      value={staff.lastName}
                      onChange={handleInputChange}
                    />
                    <input type="hidden" name="staff_id" value={staffId} />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Username"
                      name="username"
                      value={staff.username}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">salary</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="salary"
                      name="salary"
                      value={staff.salary}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    {messages.length > 0 &&
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`alert alert-${
                            message.tags === 'error' ? 'danger' : 'success'
                          }`}
                          style={{ marginTop: '10px' }}
                        >
                          {message.text}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Save Staff
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

export default EditStaff;