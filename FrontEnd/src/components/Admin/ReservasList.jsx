import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
  User,
} from "lucide-react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [nannyNames, setNannyNames] = useState({});
  const [emailNannyNames, setEmailNannyNames] = useState({});
  const [activeTab, setActiveTab] = useState("confirmed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:3005/reservations")
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        fetchNannyNames(data);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  const fetchNannyNames = async (reservations) => {
    const names = {};
    const emails = {}; // For storing nanny emails
    for (const reservation of reservations) {
      const nannyId = reservation.nanny_id;
      if (!names[nannyId]) {
        try {
          const response = await fetch(`http://localhost:3005/user/${nannyId}`);
          const data = await response.json();
          names[nannyId] = `${data.first_name} ${data.last_name}`;
          emails[nannyId] = data.email;
        } catch (error) {
          console.error(`Error fetching nanny name for ID ${nannyId}:`, error);
        }
      }
    }
    setNannyNames(names);
    setEmailNannyNames(emails);
  };

  useEffect(() => {
    let filtered = reservations.filter((reservation) => {
      if (activeTab === "confirmed") {
        return (
          reservation.status === "confirmed" || reservation.status === "booked"
        );
      }
      if (activeTab === "completed") {
        return reservation.status === "completed"; // Exibir apenas reservas pagas
      }
      return false;
    });

    if (startDate) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.booking_date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (reservation) => new Date(reservation.booking_date) <= new Date(endDate)
      );
    }

    setFilteredReservations(filtered);
    setCurrentPage(1);
  }, [reservations, activeTab, startDate, endDate]);

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePayment = async (reservation_id) => {
    const confirm = window.confirm(
      "Are you sure you want to confirm this reservation?"
    );
    if (!confirm) return;

    try {
      const response = await fetch(
        `http://localhost:3005/reservations/payClient/reservation/${reservation_id}`,
        { method: "PUT" } // Use "PUT" em maiúsculas
      );

      if (response.ok) {
        setReservations(
          reservations.filter((res) => res.reservation_id !== reservation_id)
        );
        alert("Reservation confirmed successfully!");
      } else {
        alert("Error confirming the reservation.");
      }
    } catch (error) {
      console.error("Error confirming the reservation:", error);
      alert("An unexpected error occurred.");
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-1.5">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("confirmed")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${
                    activeTab === "confirmed"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <FileText className="w-4 h-4" />
                Confirmed
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${
                    activeTab === "completed"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <CreditCard className="w-4 h-4" />
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Date Range
          </h2>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Start date"
            />
          </div>
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="space-y-4">
        {currentReservations.map((reservation) => (
          <div
            key={reservation.reservation_id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {nannyNames[reservation.nanny_id] || "Loading..."}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Client: {reservation.serviceRequest.client.first_name}{" "}
                        {reservation.serviceRequest.client.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Start:</span>{" "}
                        {new Date(
                          reservation.booking_date
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">End:</span>{" "}
                        {reservation.serviceRequest.end_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-1" />
                        <span className="flex-1">
                          <span className="font-medium">Notes:</span>{" "}
                          {reservation.serviceRequest.notes}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2 mt-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-1" />
                        <span className="flex-1">
                          <span className="font-medium">Nanny's e-mail:</span>{" "}
                          {emailNannyNames[reservation.nanny_id] ||
                            "Loading..."}
                        </span>
                      </p>

                      <p className="text-sm text-gray-600 flex items-start gap-2 mt-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-1" />
                        <span className="flex-1">
                          <span className="font-medium">Client's e-mail:</span>{" "}
                          {reservation.serviceRequest.client.email}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 flex items-start gap-2 mt-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-1" />
                        <span className="flex-1">
                          <span className="font-medium">Status:</span>{" "}
                          {reservation.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    ${reservation.value * 0.95}
                  </p>
                </div>

                <div>
                  {activeTab !== "completed" && (
                    <button
                      onClick={() => handlePayment(reservation.reservation_id)}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                    >
                      Process Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReservationList;
