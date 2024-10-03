import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    // Fetch salary data from the API when the component mounts
    axios.get('/api/get_salaries/')
      .then(response => {
        setSalaries(response.data);
      })
      .catch(error => {
        console.error('Error fetching salary data:', error);
      });
  }, []);

  return (
    <section className="content">
      <div className="container-fluid">
        <table className="table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => (
              <tr key={index}>
                <td>{salary.coach.admin.username}</td>
                <td>{salary.amount}</td>
                <td>{salary.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SalaryManagement;
