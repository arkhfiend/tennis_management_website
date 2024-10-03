import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentDetails = () => {
  const [Branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [paymentData, setPaymentData] = useState([]);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('/api/get_branches/'); // Replace with your API endpoint
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    
    fetchBranches();
  }, []);

  // Fetch batches based on selected branch
  const fetchBatches = async (branchId) => {
    if (branchId) {
      try {
        const response = await axios.get(`/fetch_batches/${branchId}/`); // Replace with your API endpoint
        setBatches(response.data.batches);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    } else {
      setBatches([]);
    }
  };

  // Fetch payment data when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedBatch) {
      try {
        const response = await axios.post('/api/get_payment_details/', {
          branch: selectedBranch,
          batch: selectedBatch,
        }); // Replace with your API endpoint
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <select
                  name="branch"
                  id="branch"
                  className="form-control"
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    fetchBatches(e.target.value);
                  }}
                >
                  <option value="">Select Branch</option>
                  {Branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="batch">Batch</label>
                <select
                  name="batch"
                  id="batch"
                  className="form-control"
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  value={selectedBatch}
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Show Payment Details</button>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Sessions Attended</th>
              <th>Payment Due</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((data, index) => (
              <tr key={index}>
                <td>{data.student.admin.username}</td>
                <td>{data.sessions}</td>
                <td>{data.due_amount}</td>
                <td>{data.payment_done ? 'Paid' : 'Not Paid'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PaymentDetails;
