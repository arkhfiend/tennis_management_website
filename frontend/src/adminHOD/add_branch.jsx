import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBranch = () => {
    const [branch, setBranch] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/add_branch_save', { branch });
            setMessage(response.data.message);
            setMessageType('success');
            setBranch(''); // Clear the input after successful submission
            toast.success(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
            setMessageType('error');
            toast.error(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <section className="content p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                        <div className="bg-base-200 shadow-xl rounded-lg">
                            <div className="bg-primary text-primary-content p-4 rounded-t-lg">
                                <h3 className="text-xl font-bold">Add Branch</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4">
                                <div className="p-4 space-y-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            name="branch"
                                            placeholder="Enter Branch"
                                            value={branch}
                                            onChange={(e) => setBranch(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        {message && (
                                            <div
                                                className={`alert ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`}
                                                style={{ marginTop: '10px' }}
                                            >
                                                {message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <button type="submit" className="btn btn-primary w-full">
                                        Add Branch
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

export default AddBranch;