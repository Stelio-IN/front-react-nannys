import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Users,
  Check,
  X,
  AlertCircle,
  Mail,
  DollarSign,
} from "lucide-react";

import { useTranslation } from 'react-i18next';

interface BabysittingRequest {
  id: number;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  address: string;
  email: string;
  notes?: string;
  value?: number;
  status: "pending" | "approved" | "rejected";
}

const BabysittingRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<BabysittingRequest[]>([]);
  const [reservations, setReservations] = useState<BabysittingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "approved">("new");
  const [editingRequest, setEditingRequest] = useState<number | null>(null);
  const [value, setValue] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const { t } = useTranslation();
  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchReservations = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/getAll/reservations/${idUser}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Erro ao buscar as reservas:", error);
    }
  };

  const fetchRequests = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/requestServices/allRequest/${idUser}`
      );
      const data = response.data.map((req: any) => ({
        id: req.request_id,
        startDate: req.start_date,
        endDate: req.end_date,
        numberOfPeople: req.number_of_people || req.num_children,
        address: req.address,
        email: req.email,
        client: req.client_id,
        notes: req.special_requests || req.notes,
        value: req.value || null,
        status: req.status,
      }));
      setRequests(data);
    } catch (error) {
      console.error("Erro ao buscar as solicitações:", error);
    }
  };

  const fetchAllReservations = async () => {
    const idUser = localStorage.getItem("SliderService");
    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/getAll/reservations/${idUser}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  };

  const handleFilter = async () => {
    setReservations([]);
    const allReservations = await fetchAllReservations();

    if (!startDateFilter && !endDateFilter) {
      setReservations(allReservations);
      return;
    }

    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const filtered = allReservations.filter((reservation) => {
      const bookingDate = new Date(reservation.booking_date);

      if (startDate && endDate) {
        return bookingDate >= startDate && bookingDate <= endDate;
      } else if (startDate) {
        return bookingDate >= startDate;
      } else if (endDate) {
        return bookingDate <= endDate;
      } else {
        return true;
      }
    });

    setReservations(filtered);
    setCurrentPage(1);
  };

  const handleApproveClick = (id: number) => {
    setEditingRequest(id);
    setValue("");
  };

  const handleFinalize = async (id, clientId) => {
    if (!value || isNaN(Number(value))) {
      alert("Please enter a valid service value.");
      return;
    }

    const confirmApprove = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (!confirmApprove) return;

    try {
      await axios.put(
        `http://localhost:3005/requestServices/approvedRequest/${id}`,
        { value: Number(value), client_id: clientId }
      );
      setRequests(
        requests.map((req) =>
          req.id === id
            ? { ...req, status: "approved", value: Number(value) }
            : req
        )
      );
      setEditingRequest(null);
      setValue("");
    } catch (error) {
      console.error("Erro ao finalizar aprovação:", error);
    }
  };

  const handleReject = async (id: number) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) return;

    try {
      await axios.put(
        `http://localhost:3005/requestServices/rejectRequest/${id}`
      );
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "rejected" } : req
        )
      );
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      await axios.put(
        `http://localhost:3005/reservations/cancel/reservation/${reservationId}`
      );
      setReservations(
        reservations.filter(
          (reservation) => reservation.reservation_id !== reservationId
        )
      );
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const filteredRequests =
    activeTab === "new"
      ? requests.filter((req) => req.status === "pending")
      : [];

  const filteredReservations =
    activeTab === "approved"
      ? reservations.filter((reservation) => reservation.status !== "")
      : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
      {t("BabysittingRequestManager.title")}
      </h1>

      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeTab === "new"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
          onClick={() => setActiveTab("new")}
        >
         {t("BabysittingRequestManager.newRequests")}
        </button>
        <button
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeTab === "approved"
              ? "bg-green-600 text-white shadow-lg shadow-green-200"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
          onClick={() => setActiveTab("approved")}
        >
         {t("BabysittingRequestManager.approvedRequests")} 
        </button>
      </div>

      {activeTab === "approved" && (
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <label
              htmlFor="startDateFilter"
              className="text-gray-700 font-medium"
            >
              {t("BabysittingRequestManager.startDate")}
            </label>
            <input
              type="date"
              id="startDateFilter"
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="endDateFilter"
              className="text-gray-700 font-medium"
            >
             {t("BabysittingRequestManager.endDate")}
            </label>
            <input
              type="date"
              id="endDateFilter"
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t("BabysittingRequestManager.applyFilter")}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {activeTab === "new" && filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">{t("BabysittingRequestManager.noNewRequests")}</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {t("BabysittingRequestManager.requestFor")} {request.startDate}
              </h2>
              <div className="space-y-3 mb-6">
                <p className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span className="font-medium"> {t("BabysittingRequestManager.numberOfPeople")}:</span>
                  <span>{request.numberOfPeople}</span>
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="font-medium"> {t("BabysittingRequestManager.address")}:</span>
                  <span>{request.address}</span>
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="font-medium"> {t("BabysittingRequestManager.email")}:</span>
                  <span>{request.email}</span>
                </p>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium"> {t("BabysittingRequestManager.note")}:</p>
                  <p className="text-gray-600 italic mt-1">{request.notes}</p>
                </div>
              </div>

              {editingRequest === request.id ? (
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Enter service value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleFinalize(request.id, request.client)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {t("BabysittingRequestManager.finalize")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleApproveClick(request.id)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                     {t("BabysittingRequestManager.approve")}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                     {t("BabysittingRequestManager.reject")}
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {activeTab === "approved" &&
          (currentItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg"> {t("BabysittingRequestManager.noApprovedReservations")}</p>
            </div>
          ) : (
            currentItems.map((reservation) => (
              <div
                key={reservation.reservation_id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {t("BabysittingRequestManager.requestFor")} {reservation.serviceRequest.client.first_name}{" "}
                  {reservation.serviceRequest.client.last_name}
                </h2>
                <div className="space-y-3 mb-6">
                  <p className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">{t("BabysittingRequestManager.numberOfPeople")}:</span>
                    <span>{reservation.serviceRequest.number_of_people}</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{t("BabysittingRequestManager.address")}:</span>
                    <span>{reservation.serviceRequest.address}</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{t("BabysittingRequestManager.email")}:</span>
                    <span>{reservation.serviceRequest.client.email}</span>
                  </p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 font-medium">{t("BabysittingRequestManager.note")}:</p>
                    <p className="text-gray-600 italic mt-1">
                      {reservation.serviceRequest.notes}
                    </p>
                  </div>
                  {reservation.status === "confirmed" && (
                    <p className="flex items-center gap-3 text-gray-700 bg-green-50 p-4 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{t("BabysittingRequestManager.serviceValue")}:</span>
                      <span className="text-green-700">
                        ${parseFloat(reservation.value).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className={`px-4 py-2 rounded-lg font-medium ${getStatusBackground(
                      reservation.status
                    )}`}
                  >
                    Status:{" "}
                    <span className="font-semibold">
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </span>
                  </div>
                  {reservation.status !== "cancelled" &&
                    reservation.status !== "completed" && (
                      <button
                        onClick={() =>
                          handleCancelReservation(reservation.reservation_id)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg 
                                 font-medium hover:bg-red-700 transition-colors duration-200 
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <X className="w-4 h-4" />
                        {t("BabysittingRequestManager.cancel")}
                      </button>
                    )}
                </div>
              </div>
            ))
          ))}
      </div>

      {activeTab === "approved" &&
        filteredReservations.length > itemsPerPage && (
          <div className="flex items-center justify-center mt-8 gap-6">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-white text-gray-700 hover:bg-gray-100
                     border border-gray-200 shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 text-sm font-medium text-gray-700 
                         bg-white rounded-md border border-gray-200"
              >
                {currentPage}
              </span>
              <span className="text-gray-500">of</span>
              <span
                className="px-3 py-1 text-sm font-medium text-gray-700 
                         bg-white rounded-md border border-gray-200"
              >
                {totalPages}
              </span>
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-white text-gray-700 hover:bg-gray-100
                     border border-gray-200 shadow-sm"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default BabysittingRequestManager;
