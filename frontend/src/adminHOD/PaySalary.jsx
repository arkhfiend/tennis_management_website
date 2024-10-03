import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaySalary = () => {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [amount, setAmount] = useState('');

  // Fetch staff members on component mount
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get('/api/get_staffs/'); // Replace with your API endpoint
        setStaffs(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaffs();
  }, []);

  // Fetch staff salary when staff is selected
  const fetchSalary = async (staffId) => {
    if (staffId) {
      try {
        const response = await axios.get(`/get_staff_salary/?staff_id=${staffId}`); // Replace with your API endpoint
        setAmount(response.data.salary);
      } catch (error) {
        console.error('Error fetching salary:', error);
      }
    } else {
      setAmount('');
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/pay_salary/', {
        staff: selectedStaff,
        amount: amount,
      }); // Replace with your API endpoint
      alert('Salary paid successfully');
    } catch (error) {
      console.error('Error paying salary:', error);
      alert('Error in paying salary');
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="staff">Select Staff</label>
            <select
              name="staff"
              id="staff"
              className="form-control"
              onChange={(e) => {
                setSelectedStaff(e.target.value);
                fetchSalary(e.target.value);
              }}
            >
              <option value="">Select Staff</option>
              {staffs.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.admin.username}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="form-control"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Pay Salary</button>
        </form>
      </div>
    </section>
  );
};

export default PaySalary;
