import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyId, setReplyId] = useState('');
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/staff_feedback_message');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleReplyClick = (id, name) => {
    setReplyId(id);
    setReplyName(name);
  };

  const handleReplySubmit = async () => {
    try {
      await axios.post('http://localhost:8000/api/staff_feedback_message_replied', {
        id: replyId,
        message: replyMessage,
      });
      alert('Reply Sent');
      window.location.reload();
    } catch (error) {
      alert('Error in Sending Reply');
      console.error('Error sending reply:', error);
    }
  };

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Staff Feedback</h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Staff ID</th>
                      <th className="px-4 py-2">Staff Name</th>
                      <th className="px-4 py-2">Message</th>
                      <th className="px-4 py-2">Sended On</th>
                      <th className="px-4 py-2">Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr key={feedback.id}>
                        <td className="border px-4 py-2">{feedback.id}</td>
                        <td className="border px-4 py-2">{feedback.staff_id}</td>
                        <td className="border px-4 py-2">{feedback.staff_name}</td>
                        <td className="border px-4 py-2">{feedback.message}</td>
                        <td className="border px-4 py-2">{feedback.created_at}</td>
                        <td className="border px-4 py-2">
                          {feedback.reply === '' ? (
                            <button
                              className="btn btn-success"
                              onClick={() => handleReplyClick(feedback.id, feedback.staff_name)}
                            >
                              Reply
                            </button>
                          ) : (
                            feedback.reply
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

      {/* Popup Form */}
      {replyId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold mb-4">Reply to {replyName}</h4>
            <div className="form-group">
              <label htmlFor="replyMessage">Message</label>
              <textarea
                className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                id="replyMessage"
                rows="4"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group mt-4">
              <button className="btn btn-info btn-block" type="button" onClick={handleReplySubmit}>
                Send Reply
              </button>
              <button className="btn btn-default btn-block mt-2" type="button" onClick={() => setReplyId('')}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffFeedback;