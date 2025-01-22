import React, { useState, useEffect } from "react";
import { Upload, User } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NannyFinderForm = () => {
  const { t } = useTranslation();
  
  const [client, setClient] = useState({
    email: "",
    password_hash: "",
    role: "client",
    first_name: "",
    last_name: "",
    id_number: "",
    country_name: "",
    province_name: "",
  });

  const [file, setFile] = useState(null); 
  const [filePreview, setFilePreview] = useState(""); 
  const [countries, setCountries] = useState([]); 
  const [provinces, setProvinces] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [loadingProvinces, setLoadingProvinces] = useState(false); 
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [uploadSuccess, setUploadSuccess] = useState(false); 

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar países:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (client.country_name) {
      setLoadingProvinces(true);
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${client.country_name}`
          );
          setProvinces(response.data);
          setLoadingProvinces(false);
        } catch (error) {
          console.error("Erro ao buscar províncias:", error);
          setLoadingProvinces(false);
        }
      };

      fetchProvinces();
    }
  }, [client.country_name]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(uploadedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview("");
    }
    setUploadSuccess(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!file) {
      setError(t("form.uploadError"));
      return;
    }

    const formData = new FormData();
    formData.append("email", client.email);
    formData.append("password_hash", client.password_hash);
    formData.append("role", client.role);
    formData.append("first_name", client.first_name);
    formData.append("last_name", client.last_name);
    formData.append("id_number", client.id_number);
    formData.append("country_name", client.country_name);
    formData.append("province_name", client.province_name);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3005/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(t("form.registrationSuccess"));
      setError("");
      setUploadSuccess(true);
      console.log(response.data);
    } catch (err) {
      setSuccessMessage("");
      setError(t("form.registrationError"));
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">
          {t("form.registrationTitle")}
        </h2>
        <p className="text-gray-500">{t("form.registrationSubtitle")}</p>
      </div>

      <form onSubmit={submitForm} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <User className="mr-3 text-indigo-500" />
            {t("form.personalInformation")}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.firstName")}
              </label>
              <input
                type="text"
                id="first_name"
                value={client.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                pattern="[A-Za-z]{3,}"
                title={t("form.namePattern")}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.lastName")}
              </label>
              <input
                type="text"
                id="last_name"
                value={client.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                pattern="[A-Za-z]{3,}"
                title={t("form.namePattern")}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.email")}
              </label>
              <input
                type="email"
                id="email"
                value={client.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.idNumber")}
              </label>
              <input
                type="text"
                id="id_number"
                value={client.id_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                pattern="\d{12}[A-Za-z]|[A-Za-z]{2}\d{7}"
                title={t("form.idPattern")}
              />
            </div>
            <div>
              <label htmlFor="country_name" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.country")}
              </label>
              <select
                id="country_name"
                value={client.country_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              >
                <option value="">{t("form.selectCountry")}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="province_name" className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.province")}
              </label>
              <select
                id="province_name"
                value={client.province_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                disabled={loadingProvinces}
                required
              >
                <option value="">{t("form.selectProvince")}</option>
                {loadingProvinces ? (
                  <option>{t("form.loadingProvinces")}</option>
                ) : (
                  provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="idCopy" className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.uploadId")}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-indigo-500 hover:text-white">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">{t("form.selectFile")}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <span>{file.name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {(error || successMessage) && (
          <div className="text-center">
            {error && <div className="text-red-600">{error}</div>}
            {successMessage && (
              <div className="text-green-600">{successMessage}</div>
            )}
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            {t("form.register")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NannyFinderForm;
