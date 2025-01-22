import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next"; 

const NannyRegistrationForm = () => {
  const { t } = useTranslation(); // Hook de tradução
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date_of_birth: null,
    country: "",
    province: "",
    idNumber: "",
    idCopy: null,
    education_level: null,
  });

  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Mensagem de erro
  const [successMessage, setSuccessMessage] = useState(""); // Mensagem de sucesso

  // Calcular a data máxima para a data de nascimento (18 anos atrás)
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const maxDate = today.toISOString().split("T")[0]; // Data no formato YYYY-MM-DD

  // Fetch countries, provinces, languages - same as original code
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (client.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${client.country}`
          );
          setProvinces(response.data);
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      };

      fetchProvinces();
    }
  }, [client.country]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (e) => {
    setClient((prev) => ({ ...prev, idCopy: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcular a idade e verificar se é maior de idade
    const birthDate = new Date(client.date_of_birth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError(t('NannyRegistrationForm.age_error')); // Tradução para erro de idade
      setSuccessMessage(""); // Limpa a mensagem de sucesso
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstName', client.firstName || '');
      formData.append('lastName', client.lastName || '');
      formData.append('email', client.email || '');
      formData.append('date_of_birth', client.date_of_birth || '');
      formData.append('country', client.country || '');
      formData.append('province', client.province || '');
      formData.append('idNumber', client.idNumber || '');
  
      if (client.idCopy) {
        formData.append('idCopy', client.idCopy);
      }

      const educationLevel = document.querySelector('select[name="education_level"]')?.value || '';
      formData.append('education_level', educationLevel);

      // Envia ao backend
      const response = await axios.post('http://localhost:3005/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setError(""); // Limpa a mensagem de erro
      setSuccessMessage(t('NannyRegistrationForm.success_message')); // Tradução de sucesso
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      setError(t('NannyRegistrationForm.submit_error')); // Tradução de erro ao submeter
      setSuccessMessage(""); // Limpa a mensagem de sucesso
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-16 mb-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        {t('NannyRegistrationForm.title')}
      </h1>

      {/* Mensagens de erro ou sucesso */}
      {(error || successMessage) && (
        <div className="text-center mb-4">
          {error && <div className="text-red-600">{error}</div>}
          {successMessage && <div className="text-green-600">{successMessage}</div>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            {t('NannyRegistrationForm.personal_info')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.first_name')}</label>
              <input
                type="text"
                id="firstName"
                placeholder={t('NannyRegistrationForm.first_name_placeholder')}
                value={client.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
                pattern="[A-Za-z]{3,}"
                title={t('NannyRegistrationForm.first_name_title')}
              />
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.last_name')}</label>
              <input
                type="text"
                id="lastName"
                placeholder={t('NannyRegistrationForm.last_name_placeholder')}
                value={client.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
                pattern="[A-Za-z]{3,}"
                title={t('NannyRegistrationForm.last_name_title')}
              />
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.date_of_birth')}</label>
              <input
                type="date"
                id="date_of_birth"
                value={client.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                max={maxDate}
                required
              />
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.email')}</label>
              <input
                type="email"
                id="email"
                placeholder="nanny@gmail.com"
                value={client.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.country')}</label>
              <select
                id="country"
                value={client.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>{t('NannyRegistrationForm.select_country')}</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.province')}</label>
              <select
                id="province"
                value={client.province}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>{t('NannyRegistrationForm.select_province')}</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.id_number')}</label>
              <input
                type="text"
                id="idNumber"
                placeholder={t('NannyRegistrationForm.id_number_placeholder')}
                value={client.idNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
                pattern="\d{12}[A-Za-z]|[A-Za-z]{2}\d{7}"
                title={t('NannyRegistrationForm.id_number_title')}
              />
            </div>
            <div>
              <label className="block mb-2">{t('NannyRegistrationForm.id_copy')}</label>
              <input
                type="file"
                id="idCopy"
                name="idCopy"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Education & Qualifications */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            {t('NannyRegistrationForm.education')}
          </h2>
          <div>
            <label className="block mb-2">{t('NannyRegistrationForm.education_level')}</label>
            <select 
              name="education_level"
              value={client.education_level} 
              id="education-level"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">{t('NannyRegistrationForm.select_education')}</option>
              <option value="none">{t('NannyRegistrationForm.none')}</option>
              <option value="high_school_student">{t('NannyRegistrationForm.high_school_student')}</option>
              <option value="high_school_incomplete">{t('NannyRegistrationForm.high_school_incomplete')}</option>
              <option value="high_school_complete">{t('NannyRegistrationForm.high_school_complete')}</option>
              <option value="technical_student">{t('NannyRegistrationForm.technical_student')}</option>
              <option value="technical_graduate">{t('NannyRegistrationForm.technical_graduate')}</option>
              <option value="university_graduate">{t('NannyRegistrationForm.university_graduate')}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-lg font-semibold"
          >
            {t('NannyRegistrationForm.submit_button')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NannyRegistrationForm;
