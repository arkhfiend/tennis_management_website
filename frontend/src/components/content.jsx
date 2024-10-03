import React, { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './content.css'
function Content() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();   

    // Perform validation here (e.g., check if fields are empty)

    // Send the form data (e.g., using fetch or an API)

    // Show a success toast message
    toast.success('Message sent successfully!');
  };
  return (<div className="shift collapse collapse-arrow border-base-300 bg-base-200 border">
    <input type="checkbox" />
    <div className="collapse-title text-xl font-medium">Click here to contact us for more information</div>
    <div className="collapse-content">
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name:</label>   

          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight   
 focus:outline-none focus:shadow-outline"   

            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700   
 font-bold mb-2">Email:</label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none   
 focus:shadow-outline"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold   
 mb-2">Message:</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none   
 focus:shadow-outline"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}   

            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
    </div>
    </div>
  </div>
  )
}

export default Content