import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageDiet = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch diet plan assignments on component mount
  useEffect(() => {
    axios.get('/api/diet_plans')  // Replace with the actual API endpoint
      .then(response => {
        setDietPlans(response.data);
      })
      .catch(() => {
        console.error('Failed to fetch diet plans');
      });
  }, []);

  // Delete a diet plan assignment
  const handleDelete = (id) => {
    axios.delete(`/api/delete_diet/${id}`)  // Replace with the actual delete API endpoint
      .then(() => {
        setDietPlans(dietPlans.filter(plan => plan.id !== id));
        setMessages([{ text: 'Diet plan deleted successfully', type: 'success' }]);
      })
      .catch(() => {
        setMessages([{ text: 'Failed to delete diet plan', type: 'error' }]);
      });
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Diet Plan Assignments</h3>
              </div>
              <div className="card-body">
                {/* Display Messages */}
                {messages.length > 0 && messages.map((message, index) => (
                  <div key={index} className={`alert alert-${message.type}`} style={{ marginTop: '10px' }}>
                    {message.text}
                  </div>
                ))}

                {/* Diet Plan Table */}
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Branch</th>
                      <th>Batch</th>
                      <th>Student</th>
                      <th>Assigned At</th>
                      <th>PDF</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dietPlans.length > 0 ? (
                      dietPlans.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>{assignment.diet_plan.title}</td>
                          <td>{assignment.branch.branch_name}</td>
                          <td>{assignment.batch.template.name}</td>
                          <td>{assignment.student.admin.first_name}</td>
                          <td>{assignment.assigned_at}</td>
                          <td>
                            <a href={assignment.diet_plan.pdf_url} target="_blank" rel="noopener noreferrer">
                              View PDF
                            </a>
                          </td>
                          <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(assignment.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No diet plan assignments available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageDiet;
