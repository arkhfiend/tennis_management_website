import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/manage_students'); // Change to your API endpoint
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student data', error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      try {
        await axios.post(`http://localhost:8000/api/delete_student/${id}/`);
        setStudents(students.filter(student => student.admin.id !== id));
        toast.success('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student', error);
        toast.error('Error deleting student!');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Student Details</h3>
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
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">First Name</th>
                      <th className="px-4 py-2">Last Name</th>
                      <th className="px-4 py-2">Username</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Gender</th>
                      <th className="px-4 py-2">Profile Pic</th>
                      <th className="px-4 py-2">Last Login</th>
                      <th className="px-4 py-2">Date Joined</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student.admin.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{student.admin.id}</td>
                        <td className="border px-4 py-2">{student.admin.first_name}</td>
                        <td className="border px-4 py-2">{student.admin.last_name}</td>
                        <td className="border px-4 py-2">{student.admin.username}</td>
                        <td className="border px-4 py-2">{student.admin.email}</td>
                        <td className="border px-4 py-2">{student.gender}</td>
                        <td className="border px-4 py-2">
                          <img src={student.profile_pic} alt="Profile" className="w-24" />
                        </td>
                        <td className="border px-4 py-2">{student.admin.last_login}</td>
                        <td className="border px-4 py-2">{student.admin.date_joined}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/edit_student/${student.admin.id}`, { state: { student } })}
                              className="btn btn-success"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.admin.id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default ManageStudent;