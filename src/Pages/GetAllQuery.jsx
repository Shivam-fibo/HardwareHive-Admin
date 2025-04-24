import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetch("https://hardware-hive.vercel.app/api/admin/queries");
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setQueries(data.queries);
          toast.success("Queries fetched successfully!");
        } else {
          toast.error("Failed to fetch queries.");
        }
      } catch (err) {
        toast.error("Error fetching queries.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="queries-list">
      <h3 className="text-2xl font-semibold mb-4">All Queries</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {queries.length === 0 ? (
          <div className="col-span-3 text-center py-4">
            No queries available.
          </div>
        ) : (
          queries.map((query) => (
            <div
              key={query._id}
              className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">

                <p className="text-gray-700 mt-2">
                  <strong>Name:</strong> {query.name}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Email:</strong> {query.email}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Subject:</strong> {query.subject}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Message:</strong> {query.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueryList;
