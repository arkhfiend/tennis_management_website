import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBranch = () => {
    const location = useLocation();
    const [branch, setBranch] = useState({ id: '', name: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.branch) {
            const branchData = location.state.branch;
            setBranch({ id: branchData.id, name: branchData.name });
        } else {
            toast.error('Branch details not available.');
            // Optionally redirect to the manage branches page
            // navigate('/manage_branches');
        }
    }, [location.state]);

    const handleChange = (e) => {
        setBranch({ ...branch, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/edit_branch_save', {
                branch_id: branch.id,
                branch: branch.name,
            });
            toast.success('Branch updated successfully.');
            // Optionally redirect to the manage branches page
            // navigate('/manage_branches');
        } catch (error) {
            toast.error('Failed to update branch.');
        }
    };

    return (
        <section className="content p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                        <div className="bg-base-200 shadow-xl rounded-lg">
                            <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                                <h3 className="text-xl font-bold">Edit Branch | Branch ID: {branch.id}</h3>
                                <p className="text-lg">Branch Name: {branch.name}</p>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4">
                                <div className="p-4 space-y-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            name="name"
                                            placeholder="Enter Branch"
                                            value={branch.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input type="hidden" name="branch_id" value={branch.id} />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <button type="submit" className="btn btn-primary w-full">
                                        Save Branch
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

export default EditBranch;