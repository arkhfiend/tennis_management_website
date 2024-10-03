import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageBranches = () => {
    const [Branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/manage_branch'); // Adjust the endpoint as needed
                setBranches(response.data); // Assuming response data is an array of branches
            } catch (error) {
                toast.error('Failed to fetch branches.');
            }
        };

        fetchBranches();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this branch?');
        if (confirmDelete) {
            try {
                await axios.post(`http://localhost:8000/api/delete_branch/${id}`); // Adjust the endpoint as needed
                setBranches(Branches.filter(branch => branch.id !== id));
                toast.success('Branch deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete branch.');
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBranches = Branches.filter(branch =>
        branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="content p-4">
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <div className="w-full max-w-7xl">
                        <div className="bg-base-200 shadow-xl rounded-lg">
                            <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                                <h3 className="text-xl font-bold">Branch Details</h3>
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
                                            <th className="px-4 py-2">Branch Name</th>
                                            <th className="px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBranches.map((branch, index) => (
                                            <tr key={branch.id}>
                                                <td className="border px-4 py-2">{index + 1}</td>
                                                <td className="border px-4 py-2">{branch.branch_name}</td>
                                                <td className="border px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/edit_branch/${branch.id}`, { state: { branch: { id: branch.id, name: branch.branch_name } } })}
                                                            className="btn btn-success"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(branch.id)}
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

export default ManageBranches;
