import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    salary: ''
  });

  const [emailStatus, setEmailStatus] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailCheck = async (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (email !== '') {
      try {
        const response = await axios.post('http://localhost:8000/api/check_email_exist', { email });
        if (response.data === 'True') {
          setEmailStatus('Email Not Available');
        } else {
          setEmailStatus('Email Available');
        }
      } catch (error) {
        console.error('Email check failed', error);
      }
    } else {
      setEmailStatus('');
    }
  };

  const handleUsernameCheck = async (e) => {
    const username = e.target.value;
    setFormData({ ...formData, username });

    if (username !== '') {
      try {
        const response = await axios.post('http://localhost:8000/api/check_username_exist', { username });
        if (response.data === 'True') {
          setUsernameStatus('Username Not Available');
        } else {
          setUsernameStatus('Username Available');
        }
      } catch (error) {
        console.error('Username check failed', error);
      }
    } else {
      setUsernameStatus('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/add_staff_save', formData);
      toast.success('Staff added successfully!');
      console.log('Form submitted successfully:', response);
    } catch (error) {
      toast.error('Error adding staff!');
      console.error('Form submission failed:', error);
    }
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Add Staff</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="p-4 space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleEmailCheck}
                      autoComplete="on"
                    />
                    {emailStatus && (
                      <span
                        className={`block mt-1 text-sm font-bold ${emailStatus.includes('Not') ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {emailStatus}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleUsernameCheck}
                      autoComplete="on"
                    />
                    {usernameStatus && (
                      <span
                        className={`block mt-1 text-sm font-bold ${usernameStatus.includes('Not') ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {usernameStatus}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="first_name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="last_name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                      type="number"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="salary"
                      placeholder="Enter salary"
                      value={formData.salary}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Add Staff
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

export default AddStaff;