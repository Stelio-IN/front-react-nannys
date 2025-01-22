import React, { useState } from 'react';
import { MapPin, Award, DollarSign, Clock, CalendarClock, Users, Languages, Star, Calendar } from 'lucide-react';
import axios from 'axios';

const NannyCard = ({
  nanny
}) => {
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [children, setChildren] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const openModal = async () => {
    setShowModal(true);
    const response = await axios.get(`http://localhost:3005/Review/comments/${nanny.user_id}`);
    setComments(response.data);
  };

  const closeModal = () => setShowModal(false);

  const handleContactClick = () => {
    setShowContactForm(!showContactForm);
  };

  const handleSubmitRequest = async (nannyId, em) => {
    try {
        
      const clientId = localStorage.getItem("SliderService");
      const email = localStorage.getItem("SliderPagination");
      const country = localStorage.getItem("tokenCData");
      const province = localStorage.getItem("tokenPrData");

      const address = `${country}, ${province}`;
      const nanny_email = nanny.email;
      const nanny_Id = nanny.user_id;
      
    
      if (!clientId || !email || !address || !startDate || !endDate || !nanny_email) {
        alert("Por favor, certifique-se de que todos os campos obrigatórios estão preenchidos.");
        return;
      }
  
      const requestData = {
        client_id: parseInt(clientId),
        nanny_id: nanny_Id,
        number_of_people: children,
        email: email,
        nanny_email: nanny_email,
        address: address,
        start_date: startDate,
        end_date: endDate,
        notes: notes || "",
      };
  
      
      const response = await axios.post(
        "http://localhost:3005/requestServices",
        requestData
      );
  
      if (response.status === 200 || response.status === 201) {
        alert("Solicitação de serviço enviada com sucesso!");
        setChildren(1);
        setStartDate("");
        setEndDate("");
        setShowContactForm(false);
      } else {
        throw new Error("Falha ao enviar solicitação de serviço");
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação de serviço:", error);
      alert("Falha ao enviar solicitação de serviço. Por favor, tente novamente.");
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={nanny.profilePictureUrl || "/default-profile.png"}
            alt={`Perfil de ${nanny.first_name}`}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-1">{nanny.first_name}</h3>
          <span className="text-sm text-gray-500">{nanny.nannyProfile.education_level.replace(/_/g, " ").toUpperCase()}</span>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Award className="w-5 h-5 text-indigo-500" />
              {nanny.nannyProfile.education_level.replace(/_/g, " ").toUpperCase()}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Moeda: <span className="text-indigo-600">{nanny.nannyProfile.currency}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Diária: <span className="text-indigo-600">{nanny.nannyProfile.daily_salary}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarClock className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Mensal: <span className="text-indigo-600">{nanny.nannyProfile.monthly_salary}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-indigo-600" />
              <p className="font-medium">
                Data de Nascimento:{" "}
                <span className="text-indigo-600">
                  {nanny.nannyProfile.dob}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Languages className="w-5 h-5 text-indigo-600" />
              <div className="flex flex-wrap gap-2">
                {nanny.languages && nanny.languages.length > 0 ? (
                  nanny.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
                    >
                      {language.trim()}
                    </span>
                  ))
                ) : (
                  <span>Nenhum idioma disponível</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-indigo-500" />
              {nanny.province}, {nanny.country}
            </div>

            <button
              onClick={openModal}
              className="bg-indigo-600 mt-4 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ver Todos os Comentários e Avaliações
            </button>

            <div className="mt-4">
              <button
                onClick={handleContactClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Contato
              </button>
            </div>

            {showContactForm && (
              <ContactForm
                children={children}
                setChildren={setChildren}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                notes={notes}
                setNotes={setNotes}
                onSubmit={handleSubmitRequest}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 relative">
            <h3 className="text-xl font-semibold mb-4">Comentários</h3>

            <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-lg">
              <span className="font-semibold">Avaliar: </span>
              <span className="text-lg">
                {comments.averageRating || "Sem Avaliação"}
              </span>
            </div>

            <div className="space-y-4 mt-8">
              {comments && comments.comments && comments.comments.length > 0 ? (
                comments.comments.map((comment, index) => (
                  <div key={index} className="border-b pb-4">
                    <p className="text-gray-700 text-base">{comment.review_text}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="ml-2 text-sm text-gray-600">
                        {comment.rating}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhum comentário disponível.</p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const ContactForm = ({
  children,
  setChildren,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  notes,
  setNotes,
  onSubmit
}) => {
  return (
    <div className="mt-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Crianças
        </label>
        <div className="flex items-center bg-gray-100 rounded-lg">
          <button
            onClick={() => setChildren(Math.max(1, children - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"
          >
            -
          </button>
          <span className="px-4 text-lg font-semibold">{children}</span>
          <button
            onClick={() => setChildren(children + 1)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-r-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Início
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Término
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Por favor, mencione alergias, pedidos especiais ou outras informações importantes."
          rows={3}
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Enviar Solicitação
      </button>
    </div>
  );
};

export default NannyCard;