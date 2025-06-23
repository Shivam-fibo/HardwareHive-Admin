import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending"); // 'pending' or 'approved'

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/admin/registrations");
      const data = await response.json();
      setUsers(data);
      applyFilter(data, filterStatus);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const applyFilter = (allUsers, status) => {
    const filtered = allUsers.filter((user) =>
      status === "approved" ? user.isApproved : !user.isApproved
    );
    setFilteredUsers(filtered);
  };

  const handleFilterClick = (status) => {
    setFilterStatus(status);
    applyFilter(users, status);
  };

  const handleApprove = async (id, userEmail, userName) => {
    try {
      const approveResponse = await fetch(`https://hardware-hive-backend.vercel.app/api/admin/registrations/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: userName }),
      });

      if (approveResponse.ok) {
        toast.success("User approved successfully!");
        fetchUsers();
      } else {
        toast.error("Approval failed.");
      }
    } catch (error) {
      toast.error("Error approving user.");
    }
  };

  const handleReject = async (id) => {
    // Implement rejection logic
    toast.error("Reject handler not implemented.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleFilterClick("pending")}
          className={`px-4 py-2 rounded ${filterStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
        >
          Pending
        </button>
        <button
          onClick={() => handleFilterClick("approved")}
          className={`px-4 py-2 rounded ${filterStatus === "approved" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Approved
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No {filterStatus} registrations</p>
        ) : (
          <ul className="space-y-6">
            {filteredUsers.map((user) => (
              <li key={user._id} className="p-4 border rounded">
                {/* ... same user card content ... */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  {!user.isApproved && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApprove(user._id, user.email, user.name)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="border-t pt-2">
                    <p><span className="font-semibold">Company:</span> {user.companyName}</p>
                    <p><span className="font-semibold">Mobile:</span> {user.mobile}</p>
                    <p><span className="font-semibold">WhatsApp:</span> {user.whatsapp}</p>
                    <p><span className="font-semibold">Registration Date:</span> {new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="border-t pt-2">
                    <p><span className="font-semibold">City:</span> {user.city}</p>
                    <p><span className="font-semibold">District:</span> {user.district}</p>
                    <p><span className="font-semibold">State:</span> {user.state}</p>
                    <p><span className="font-semibold">Pincode:</span> {user.pincode}</p>
                  </div>
                </div>

                <div className="border-t pt-2 mt-2">
                  <p><span className="font-semibold">GST Number:</span> {user.gstNumber || "N/A"}</p>
                </div>

                <div className="mt-2 pt-2 border-t">
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span className={user.isApproved ? "text-green-600 ml-1" : "text-yellow-600 ml-1"}>
                      {user.isApproved ? "Approved" : "Pending"}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
