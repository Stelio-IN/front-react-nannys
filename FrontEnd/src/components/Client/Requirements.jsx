import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {
  Calendar,
  User,
  MapPin,
  Users,
  Clock,
  FileText,
  Trash2,
} from "lucide-react";

const Favorites = () => {
  const { t } = useTranslation(); // Utiliza o carregamento dinâmico
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchRequests = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/requestServices/allRequestCliente/${idUser}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Erro ao buscar as solicitações:", error);
      setMessage({ text: "Erro ao buscar as solicitações", type: "error" });
    }
  };

  const handleDelete = async (request_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3005/requestServices/${request_id}`
      );
      if (response.status === 204) {
        setMessage({ text: "Request deleted successfully!", type: "success" });
        setRequests(requests.filter((req) => req.request_id !== request_id));
      } else {
        setMessage({ text: "Error deleting the request", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting the request:", error);
      setMessage({ text: "Error deleting the request", type: "error" });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-indigo-50">
        <h2 className="text-2xl font-bold text-indigo-800">{t('favorites.clientRequests')}</h2>
      </div>

      {message.text && (
        <div
          className={`p-4 my-4 text-center font-semibold rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6 space-y-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('favorites.noRequests')}
          </div>
        ) : (
          currentItems.map((request) => (
            <div
              key={request.request_id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-200 overflow-hidden group mb-6"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Reservation Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                        <User className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Email: {request.nanny_email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Address: {request.address}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{t('favorites.start')}:</span>{" "}
                      {new Date(request.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{t('favorites.end')}:</span>{" "}
                      {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{t('favorites.notes')}:</span>{" "}
                      {request.notes || t('favorites.noNotes')}
                    </p>
                  </div>

                  {/* Reservation Actions */}
                  <div className="text-right">
                    <button
                      onClick={() => handleDelete(request.request_id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      {t('favorites.cancelRequest')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            {t('favorites.previous')}
          </button>
          <span className="text-sm text-gray-600">
            {t('favorites.pageOf', { currentPage, totalPages })}
          </span>
          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            {t('favorites.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
