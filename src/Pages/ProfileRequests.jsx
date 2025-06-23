import React, { useEffect, useState } from "react";

const ProfileRequests = () => {
  const [requests, setRequests] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://hardware-hive-backend.vercel.app/api/profile/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`https://hardware-hive-backend.vercel.app/api/profile/approve/${id}`, {
        method: "PUT",
      });
      alert("Request approved");
      fetchRequests();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`https://hardware-hive-backend.vercel.app/api/profile/reject/${id}`, {
        method: "PUT",
      });
      alert("Request rejected");
      fetchRequests();
    } catch (err) {
      alert("Failed to reject");
    }
  };

  const startEditing = (request) => {
    setEditingRequestId(request._id);
    setEditedData({ ...request.newData });
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      await fetch(`https://hardware-hive-backend.vercel.app/api/profile/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newData: editedData }),
      });
      alert("Updated and approved");
      setEditingRequestId(null);
      fetchRequests();
    } catch (err) {
      alert("Error updating");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Profile Update Requests</h2>
      {requests.length === 0 && <p>No pending requests.</p>}
      <div className="space-y-6">
        {requests.map((req) => (
          <div key={req._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold text-lg mb-2">{req.userId.name} ({req.userId.email})</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.keys(req.newData).map((field) => (
                <div key={field}>
                  <strong>{field}:</strong>
                  {editingRequestId === req._id ? (
                    <input
                      className="border rounded w-full p-1 mt-1"
                      value={editedData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                  ) : (
                    <div>
                      <span className="text-gray-500 line-through">{req.oldData[field] || "N/A"}</span>{" "}
                      ➜ <span className="text-green-600">{req.newData[field]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              {editingRequestId === req._id ? (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleSaveEdit(req._id)}
                  >
                    Save & Approve
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setEditingRequestId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {/* <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => startEditing(req)}
                  >
                    Edit
                  </button> */}
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={() => handleApprove(req._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleReject(req._id)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileRequests;
