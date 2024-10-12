import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const AddStudent = () => {
  const location = useLocation();
  const { branchId, batchId } = location.state || {};

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    dob: '',
    contact: '',
    gender: '',
    profile_pic: null,
  });

  const [emailStatus, setEmailStatus] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_pic: e.target.files[0] });
  };

  const handleEmailCheck = async (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
  
    if (email !== '') {
      try {
        const response = await axios.post('http://localhost:8000/api/check_email_exist', { email });
        
        if (response.data.exists) {
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
        
        if (response.data.exists) {
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
  


  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('Weak');
    } else if (password.length < 10) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name || /[^a-zA-Z]/.test(formData.first_name)) {
      newErrors.first_name = 'First name should not be empty or contain any number or special character';
    }

    if (!formData.last_name || /[^a-zA-Z]/.test(formData.last_name)) {
      newErrors.last_name = 'Last name should not be empty or contain any number or special character';
    }

    if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact number should be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/branch/${branchId}/batch/${batchId}/add_student_save/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Student added successfully!');
      console.log('Form submitted successfully:', response);

      // Reset form values to initial state
      setFormData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        dob: '',
        contact: '',
        gender: '',
        profile_pic: null,
      });
      setEmailStatus('');
      setUsernameStatus('');
      setPasswordStrength('');
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast.error('Error adding student!');
      } else {
        toast.error('An unexpected error occurred!');
      }
      console.error('Form submission failed:', error);
    }
  };

  // Calculate the maximum date for the date of birth (6 years before today)
  const today = new Date();
  const maxDate = new Date(today.setFullYear(today.getFullYear() - 6)).toISOString().split('T')[0];

  return (
    <section className="content p-4">
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Add Student</h3>
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
                    {errors.email && <span className="text-red-500 text-sm">{errors.email[0]}</span>}
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
                    {errors.username && <span className="text-red-500 text-sm">{errors.username[0]}</span>}
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
                    {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
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
                    {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>}
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
                    {passwordStrength && (
                      <span
                        className={`block mt-1 text-sm font-bold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}
                      >
                        Password Strength: {passwordStrength}
                      </span>
                    )}
                    {errors.password && <span className="text-red-500 text-sm">{errors.password[0]}</span>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="dob"
                      placeholder="Enter date of birth"
                      value={formData.dob}
                      onChange={handleChange}
                      autoComplete="off"
                      max={maxDate} // Set the max attribute to ensure the student is at least 6 years old
                    />
                    {errors.dob && <span className="text-red-500 text-sm">{errors.dob[0]}</span>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="contact"
                      placeholder="Enter contact number"
                      value={formData.contact}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender[0]}</span>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input
                      type="file"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      name="profile_pic"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {errors.profile_pic && <span className="text-red-500 text-sm">{errors.profile_pic[0]}</span>}
                  </div>
                </div>
                <div className="p-4">
                  <button type="submit" className="btn btn-primary w-full border border-blue-500 shadow-lg">
                    Add Student
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

export default AddStudent;