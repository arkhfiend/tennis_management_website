import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch feedbacks when component mounts
    axios.get('/api/get_feedbacks/')
      .then(response => setFeedbacks(response.data))
      .catch(error => console.error('Error fetching feedbacks:', error));
  }, []);

  const handleReplyPopupOpen = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage('');
    setShowPopup(true);
  };

  const handleReplySubmit = () => {
    axios.post('/api/student_feedback_message_replied/', {
      id: selectedFeedback.id,
      message: replyMessage,
      csrfmiddlewaretoken: '{{ csrf_token }}' // Replace with actual CSRF token if needed
    })
      .then(response => {
        if (response.data === "True") {
          alert("Reply sent successfully");
          // Optionally refetch feedbacks to update the list
          axios.get('/api/get_feedbacks/')
            .then(response => setFeedbacks(response.data))
            .catch(error => console.error('Error fetching feedbacks:', error));
        } else {
          alert("Error in sending reply");
        }
      })
      .catch(error => {
        alert("Error in sending reply");
        console.error(error);
      })
      .finally(() => {
        setShowPopup(false);
      });
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Student Feedback</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Student ID</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Staff Name</th>
                      <th className="px-4 py-2">Message</th>
                      <th className="px-4 py-2">Sent On</th>
                      <th className="px-4 py-2">Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr key={feedback.id}>
                        <td className="border px-4 py-2">{feedback.id}</td>
                        <td className="border px-4 py-2">{feedback.student_id.admin.id}</td>
                        <td className="border px-4 py-2">{`${feedback.student_id.admin.first_name} ${feedback.student_id.admin.last_name}`}</td>
                        <td className="border px-4 py-2">{feedback.staff_id.admin.first_name}</td>
                        <td className="border px-4 py-2">{feedback.feedback}</td>
                        <td className="border px-4 py-2">{feedback.created_at}</td>
                        <td className="border px-4 py-2">
                          {feedback.feedback_reply ? (
                            feedback.feedback_reply
                          ) : (
                            <button
                              className="btn btn-success"
                              onClick={() => handleReplyPopupOpen(feedback)}
                            >
                              Reply
                            </button>
                          )}
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

      {/* Popup for Reply */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Reply to Feedback</h2>
            <p className="mb-4">Reply To: <span>{selectedFeedback ? `${selectedFeedback.student_id.admin.first_name} ${selectedFeedback.student_id.admin.last_name}` : ''}</span></p>
            <textarea
              className="form-control w-full p-2 border border-gray-300 rounded-md"
              rows="5"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your reply here..."
            />
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
              <button
                className="btn btn-info"
                onClick={handleReplySubmit}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentFeedback;