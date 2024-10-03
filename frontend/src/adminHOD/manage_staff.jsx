import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch staff data from the API
    const fetchStaffs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/manage_staff'); // Change to your API endpoint
        setStaffs(response.data);
      } catch (error) {
        console.error('Error fetching staff data', error);
      }
    };

    fetchStaffs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this staff member?');
    if (confirmDelete) {
      try {
        await axios.post(`http://localhost:8000/api/delete_staff/${id}/`);
        setStaffs(staffs.filter(staff => staff.id !== id));
        toast.success('Staff deleted successfully!');
      } catch (error) {
        console.error('Error deleting staff', error);
        toast.error('Error deleting staff!');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffs = staffs.filter(staff =>
    staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Staff Details</h3>
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
                      <th className="px-4 py-2">First Name</th>
                      <th className="px-4 py-2">Last Name</th>
                      <th className="px-4 py-2">Username</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Salary</th>
                      <th className="px-4 py-2">Last Login</th>
                      <th className="px-4 py-2">Date Joined</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaffs.map((staff, index) => (
                      <tr key={staff.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{staff.first_name}</td>
                        <td className="border px-4 py-2">{staff.last_name}</td>
                        <td className="border px-4 py-2">{staff.username}</td>
                        <td className="border px-4 py-2">{staff.email}</td>
                        <td className="border px-4 py-2">{staff.salary}</td>
                        <td className="border px-4 py-2">{staff.last_login}</td>
                        <td className="border px-4 py-2">{staff.date_joined}</td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/edit_staff/${staff.id}`, { state: { staff } })}
                              className="btn btn-success"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(staff.id)}
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

export default ManageStaff;