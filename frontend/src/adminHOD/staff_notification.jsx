import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffNotification = () => {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({ id: "", name: "" });
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch staff data from API
    const fetchStaffs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/manage_staff");
        setStaffs(response.data);
      } catch (error) {
        console.error("There was an error fetching the staff data!", error);
      }
    };

    fetchStaffs();
  }, []);

  const handleSendNotification = async () => {
    console.log("Sending notification to:", selectedStaff.id, "with message:", message);
    try {
      const response = await axios.post("http://localhost:8000/api/send_staff_notification", {
        id: selectedStaff.id,
        message: message,
      });
      console.log("Server response:", response);
      if (response.data === "True") {
        alert("Message Sent");
      } else {
        alert("Failed to Send Message");
      }
      setShowPopup(false); // Close the popup after sending the notification
    } catch (error) {
      console.error("There was an error sending the notification!", error);
      console.error("Error details:", error.response ? error.response.data : error.message);
    }
  };

  const handleShowNotification = (id, name) => {
    setSelectedStaff({ id, name });
    setShowPopup(true); // Show the popup when the button is clicked
    console.log("Selected staff:", id, name);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffs = staffs.filter(staff =>
    staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="content p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-base-200 shadow-xl rounded-lg">
              <div className="bg-primary text-primary-content p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xl font-bold">Staff Notifications</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">First Name</th>
                      <th className="px-4 py-2">Last Name</th>
                      <th className="px-4 py-2">Username</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaffs.map((staff) => (
                      <tr key={staff.id}>
                        <td className="border px-4 py-2">{staff.id}</td>
                        <td className="border px-4 py-2">{staff.first_name}</td>
                        <td className="border px-4 py-2">{staff.last_name}</td>
                        <td className="border px-4 py-2">{staff.username}</td>
                        <td className="border px-4 py-2">{staff.email}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="btn btn-success"
                            onClick={() => handleShowNotification(staff.id, staff.username)}
                          >
                            Send Notification
                          </button>
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold mb-4">Send Notification to {selectedStaff.name}</h4>
            <div className="form-group">
              <label htmlFor="notificationMessage">Message</label>
              <textarea
                className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                id="notificationMessage"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group mt-4">
              <button className="btn btn-info btn-block" type="button" onClick={handleSendNotification}>
                Send Notification
              </button>
              <button className="btn btn-default btn-block mt-2" type="button" onClick={() => setShowPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StaffNotification;