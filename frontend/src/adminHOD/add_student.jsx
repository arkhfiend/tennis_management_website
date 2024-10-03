import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');

  const checkEmailExist = (email) => {
    axios.post('/check_email_exist', { email })
      .then((response) => {
        if (response.data === "True") {
          setEmailStatus('Email Not Available');
        } else {
          setEmailStatus('Email Available');
        }
      })
      .catch(() => {
        console.log('Failed to check email');
      });
  };

  const checkUsernameExist = (username) => {
    axios.post('/check_username_exist', { username })
      .then((response) => {
        if (response.data === "True") {
          setUsernameStatus('Username Not Available');
        } else {
          setUsernameStatus('Username Available');
        }
      })
      .catch(() => {
        console.log('Failed to check username');
      });
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Add Student</h3>
              </div>

              {/* Form */}
              <form action="/add_student_save" method="POST">
                <div className="card-body">
                  {/* Email Input */}
                  <div className="form-group">
                    <label htmlFor="id_email">Email</label>
                    <input
                      type="email"
                      id="id_email"
                      name="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value !== '') {
                          checkEmailExist(e.target.value);
                        } else {
                          setEmailStatus('');
                        }
                      }}
                    />
                    <span className="email_error" style={{ padding: '5px', fontWeight: 'bold', color: emailStatus === 'Email Available' ? 'green' : 'red' }}>
                      {emailStatus}
                    </span>
                  </div>

                  {/* Username Input */}
                  <div className="form-group">
                    <label htmlFor="id_username">Username</label>
                    <input
                      type="text"
                      id="id_username"
                      name="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value !== '') {
                          checkUsernameExist(e.target.value);
                        } else {
                          setUsernameStatus('');
                        }
                      }}
                    />
                    <span className="username_error" style={{ padding: '5px', fontWeight: 'bold', color: usernameStatus === 'Username Available' ? 'green' : 'red' }}>
                      {usernameStatus}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary">Add Student</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddStudent;
