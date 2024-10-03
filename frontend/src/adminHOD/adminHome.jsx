import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'animate.css';

const AdminHome = () => {
  const [data, setData] = useState({
    student_count: 0,
    staff_count: 0,
    branch_count: 0,
    batch_count: 0,
    total_payments: 0,
    total_salaries: 0,
    profit: 0,
    branch_data: [],
    notifications_list: [],
    feedback_list: []
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin_home')
      .then(response => setData(response.data))
      .catch(error => console.error('There was an error fetching the data!', error));
  }, []);

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="card bg-primary text-primary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">{data.student_count}</h3>
              <p className="text-lg">Total Students</p>
              <a href="/branch_list" className="btn btn-secondary">More info</a>
            </div>
          </div>
          <div className="card bg-secondary text-secondary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">{data.staff_count}</h3>
              <p className="text-lg">Total Staff</p>
              <a href="/manage_staff" className="btn btn-primary">More info</a>
            </div>
          </div>
          <div className="card bg-accent text-accent-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">{data.branch_count}</h3>
              <p className="text-lg">Total Branches</p>
              <a href="/manage_branch" className="btn btn-primary">More info</a>
            </div>
          </div>
          <div className="card bg-neutral text-neutral-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">{data.batch_count}</h3>
              <p className="text-lg">Total Batches</p>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card bg-primary text-primary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">₹{data.total_payments}</h3>
              <p className="text-lg">Total Payments</p>
            </div>
          </div>
          <div className="card bg-secondary text-secondary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">₹{data.total_salaries}</h3>
              <p className="text-lg">Total Salaries Paid</p>
            </div>
          </div>
          <div className="card bg-accent text-accent-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-body">
              <h3 className="text-3xl">₹{data.profit}</h3>
              <p className="text-lg">Total Profit</p>
            </div>
          </div>
        </div>

        {/* Branch Overview */}
        <div className="card bg-neutral text-neutral-content shadow-xl animate__animated animate__fadeIn">
          <div className="card-header">
            <h3 className="text-lg font-bold">Branch Overview</h3>
          </div>
          <div className="card-body">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Number of Batches</th>
                  <th>Number of Students</th>
                </tr>
              </thead>
              <tbody>
                {data.branch_data.map((branch, index) => (
                  <tr key={index}>
                    <td>{branch.name}</td>
                    <td>{branch.batches}</td>
                    <td>{branch.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card bg-primary text-primary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-header">
              <h3 className="text-lg font-bold">Recent Notifications</h3>
            </div>
            <div className="card-body">
              <ul className="list-none">
                {data.notifications_list.map((notifications, index) => (
                  <li key={index} className="mb-2 p-2 bg-base-100 shadow-md rounded-lg">
                    {notifications.map((notification, notifIndex) => (
                      <div key={notifIndex}>
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                        <small className="text-gray-500">Created At: {new Date(notification.created_at).toLocaleString()}</small>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card bg-secondary text-secondary-content shadow-xl animate__animated animate__fadeIn">
            <div className="card-header">
              <h3 className="text-lg font-bold">Recent Feedback</h3>
            </div>
            <div className="card-body">
              <ul className="list-none">
                {data.feedback_list.map((feedback, index) => (
                  <li key={index} className="mb-2 p-2 bg-base-100 shadow-md rounded-lg">
                    <div>
                      {feedback.student_id ? (
                        <>
                          <strong>Feedback from Student: {feedback.student_id.admin.username}</strong>
                          <p className="text-sm">Branch: {feedback.student_id.branch.branch_name}, Batch: {feedback.student_id.batch.template.name}</p>
                        </>
                      ) : feedback.staff_id ? (
                        <>
                          <strong>Feedback from Staff: {feedback.staff_id.full_name}</strong>
                          <p className="text-sm">Branch: {feedback.staff_id.branch.branch_name}, Batch: {feedback.staff_id.batch.template.name}</p>
                        </>
                      ) : null}
                      <small className="text-gray-500">Created At: {new Date(feedback.created_at).toLocaleString()}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;