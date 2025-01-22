import React, { useState, useEffect } from "react";

import MpesaPaymentModal from "../Estrutura/MpesaPaymentModal";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  FileText,
  User,
  DollarSign,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [expanded, setExpanded] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { t } = useTranslation();

  const handleMpesaPayment = (reservation) => {
    setSelectedReservation(reservation);
    setMpesaModalOpen(true);
  };
  useEffect(() => {
    let timeoutId;
    if (message.text) {
      timeoutId = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]);

  const fetchReservations = async () => {
    const clientId = localStorage.getItem("SliderService");
    if (!clientId) {
      console.error("Client ID not found in localStorage");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3005/reservations/getAll/reservations/client/${clientId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      //setMessage({ text: "Error fetching reservations", type: "error" });
    }
  };

  const toggleExpand = (reservationId) => {
    setExpanded((prev) => ({
      ...prev,
      [reservationId]: !prev[reservationId],
    }));
  };

  const handleFeedbackChange = (reservationId, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [reservationId]: { ...prev[reservationId], [field]: value },
    }));
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.put(
        `http://localhost:3005/reservations/cancel/reservation/${reservation_id}`
      );
      if (response.status === 200) {
        setMessage({
          text: "Reservation cancelled successfully!",
          type: "success",
        });
        setReservations(
          reservations.filter((res) => res.reservation_id !== reservation_id)
        );
      } else {
        setMessage({ text: "Error cancelling the reservation", type: "error" });
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setMessage({ text: "Error cancelling the reservation", type: "error" });
    }
  };

  const handleFeedbackSubmit = async (reservationId) => {
    const feedback = feedbacks[reservationId];
    if (!feedback || !feedback.comment || !feedback.rating) {
      setMessage({
        text: "Please provide both a comment and a rating.",
        type: "error",
      });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3005/reservations/${reservationId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedback),
        }
      );
      if (response.status === 201) {
        setMessage({
          text: "Feedback submitted successfully!",
          type: "success",
        });
        setFeedbacks((prev) => ({
          ...prev,
          [reservationId]: { comment: "", rating: "" },
        }));
      } else {
        setMessage({ text: "Error submitting feedback", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage({ text: "Error submitting feedback", type: "error" });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-indigo-700 text-white">
        <h2 className="text-2xl font-bold">
          {t("reservation.clientReservations")}
        </h2>
      </div>

      {message.text && (
        <div
          className={`p-4 my-4 text-center font-semibold text-white transition-opacity duration-300 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("reservation.noReservations")}
          </div>
        ) : (
          currentItems.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-200 overflow-hidden group mb-6"
            >
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("reservation.nannyEmail")}
                      {reservation.serviceRequest.nanny_email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("reservation.status")}{" "}
                      <span className="font-medium">{reservation.status}</span>
                    </p>
                    {reservation.status === "completed" && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                        {t("reservation.paidAmount")}
                        {reservation.value}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(reservation.reservation_id)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {expanded[reservation.reservation_id] ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>

              {expanded[reservation.reservation_id] && (
                <div className="p-6 border-t">
                  <p className="text-sm text-gray-600">
                    <Calendar className="inline-block w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">
                      {t("reservation.start")}:
                    </span>{" "}
                    {new Date(
                      reservation.serviceRequest.start_date
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Clock className="inline-block w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{t("reservation.end")}:</span>{" "}
                    {new Date(
                      reservation.serviceRequest.end_date
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FileText className="inline-block w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">
                      {t("reservation.status")}:
                    </span>{" "}
                    {reservation.status}
                  </p>

                  {reservation.status !== "cancelled" &&
                    reservation.status !== "completed" && (
                      <button
                        onClick={() => handleCancel(reservation.reservation_id)}
                        className="px-4 py-2 bg-red-600 text-white mt-6 font-semibold text-sm rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        {t("reservation.cancelReservation")}
                      </button>
                    )}

                  {reservation.status === "confirmed" && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {t("reservation.choosePaymentMethod")}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {/* PayPal Payment Button */}
                        <form
                          action="http://localhost:3005/sam/pay"
                          method="post"
                        >
                          <input
                            type="hidden"
                            name="reservationId"
                            value={reservation.reservation_id}
                          />
                          <input
                            type="hidden"
                            name="amount"
                            value={reservation.value}
                          />
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                            {t("reservation.payWithPaypal")}
                          </button>
                        </form>

                        {/* M-Pesa Payment Button */}
                        <button
                          onClick={() => handleMpesaPayment(reservation)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                        >
                          {t("reservation.payWithMpesa")}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl mt-4">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      {t("reservation.total")}:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {formatCurrency(reservation.value)}
                    </span>
                  </div>

                  {reservation.status === "completed" && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        {t("reservation.leaveFeedback")}
                      </h3>
                      <textarea
                        placeholder={t("reservation.writeComment")}
                        value={
                          feedbacks[reservation.reservation_id]?.comment || ""
                        }
                        onChange={(e) =>
                          handleFeedbackChange(
                            reservation.reservation_id,
                            "comment",
                            e.target.value
                          )
                        }
                        className="mt-2 w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="mt-2 flex items-center">
                        <label className="mr-4">
                          {t("reservation.rating")}:
                        </label>
                        <select
                          value={
                            feedbacks[reservation.reservation_id]?.rating || ""
                          }
                          onChange={(e) =>
                            handleFeedbackChange(
                              reservation.reservation_id,
                              "rating",
                              e.target.value
                            )
                          }
                          className="p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <button
                        onClick={() =>
                          handleFeedbackSubmit(reservation.reservation_id)
                        }
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                      >
                        {t("reservation.submitFeedback")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        <MpesaPaymentModal
          isOpen={mpesaModalOpen}
          onClose={() => setMpesaModalOpen(false)}
          reservationId={selectedReservation?.reservation_id}
          amount={selectedReservation?.value}
        />
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {t("reservation.previous")}
          </button>
          <span className="text-gray-500">
            {t("reservation.page")} {currentPage} {t("of")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {t("reservation.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
