import React, { useEffect, useState } from "react";
import { Phone, DollarSign, Languages, Loader, Save, Map } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserQualifications = ({ idUser }) => {
  const [formData, setFormData] = useState({
    languages: [],
    phone: "",
    currency: "",
    monthlySalary: "",
    dailySalary: "",
    country: "",
    province: "",
  });

  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({
    contact: false,
    salary: false,
  });
  const { t } = useTranslation();
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
    if (formData.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${formData.country}`
          );
          setProvinces(response.data);
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      };

      fetchProvinces();
    }
  }, [formData.country]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, languagesRes, currenciesRes] = await Promise.all([
          fetch(`http://localhost:3005/user/${idUser}`).then((res) =>
            res.json()
          ),
          fetch("http://localhost:3005/languages").then((res) => res.json()),
          fetch("http://localhost:3005/currencies").then((res) => res.json()),
        ]);

        setFormData({
          ...formData,
          languages: userRes.languages || [],
          phone: userRes.phone || "",
          currency: userRes.currency || "",
          monthlySalary: userRes.monthlySalary || "",
          dailySalary: userRes.dailySalary || "",
        });

        setLanguagesList(languagesRes.languages || []);
        setCurrenciesList(
          currenciesRes.currencies.map((curr) =>
            typeof curr === "string" ? curr : curr.currency
          ) || []
        );
      } catch (error) {
        showMessage("error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUser]);

  const handleSave = async (section, data) => {
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      const response = await fetch(`http://localhost:3005/user/saveLocation/${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update information");

      showMessage("success", "Information updated successfully");
    } catch (error) {
      showMessage("error", "Failed to update information");
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleSaveM = async (section, data) => {
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      const response = await fetch(`http://localhost:3005/nanny/saveBusiness/${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update information");

      showMessage("success", "Information updated successfully");
    } catch (error) {
      showMessage("error", "Failed to update information");
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleSaveP = async (section, data) => {
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      const response = await fetch(`http://localhost:3005/user/save/Phone/${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update information");

      showMessage("success", "Information updated successfully");
    } catch (error) {
      showMessage("error", "Failed to update information");
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleAdd = async (type, value) => {
    try {
      const response = await fetch(`http://localhost:3005/lang/${idUser}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: value }),
      });

      if (!response.ok) throw new Error(`Failed to add ${value}`);

      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
      setSelectedLanguage("");
      showMessage("success", `${value} added successfully`);
    } catch (error) {
      showMessage("error", `Failed to add ${value}`);
    }
  };

  const handleRemove = async (type, value) => {
    try {
      const response = await fetch(
        `http://localhost:3005/lang/${idUser}/${value}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error(`Failed to remove ${value}`);

      setFormData((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
      showMessage("success", `${value} removed successfully`);
    } catch (error) {
      showMessage("error", `Failed to remove ${value}`);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {message.text && (
        <div
          className={`p-4 rounded-lg shadow-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-500"
              : "bg-red-100 text-red-800 border border-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-500" />
            {t("contactInformation-nanny.title")}
          </h2>
          <button
            onClick={() => handleSaveP("contact", { phone: formData.phone })}
            disabled={saving.contact}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving.contact ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
           {t("contactInformation-nanny.saveButton")}
          </button>
        </div>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Country and Province */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-500" />
            {t("location-nanny.title")}
          </h2>
          <button
            onClick={() =>
              handleSave("location", {
                country: formData.country,
                province: formData.province,
              })
            }
            disabled={saving.contact}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving.contact ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("location-nanny.saveButton")}
          </button>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block mb-2">{t("location-nanny.countryLabel")}</label>
            <select
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-2">{t("location-nanny.provinceLabel")}</label>
            <select
              id="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Province
              </option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            {t("salaryInformation-nanny.title")}
          </h2>
          <button 
            onClick={() =>
              handleSaveM("salary", {
                currency: formData.currency,
                monthlySalary: formData.monthlySalary,
                dailySalary: formData.dailySalary,
              })
            }
            disabled={saving.salary}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving.salary ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("salaryInformation-nanny.saveButton")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("salaryInformation-nanny.currencyLabel")}
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="">Select currency</option>
              {currenciesList.map((currency, index) => (
                <option key={`${currency}-${index}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("salaryInformation-nanny.monthlySalaryLabel")}
            </label>
            <input
              type="number"
              id="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("salaryInformation-nanny.dailySalaryLabel")}
            </label>
            <input
              type="number"
              id="dailySalary"
              value={formData.dailySalary}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Languages className="w-5 h-5 text-blue-500" />
          {t("languages-nanny.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("languages-nanny.assignedLanguagesLabel")}
            </label>
            <ul className="list-disc pl-5 space-y-1">
              {formData.languages.map((language, index) => (
                <li
                  key={`${language}-${index}`}
                  className="flex items-center justify-between"
                >
                  {language}
                  <button
                    onClick={() => handleRemove("languages", language)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    {t("languages-nanny.removeButton")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               {t("languages-nanny.addLanguageLabel")}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="">Select language</option>
              {languagesList
                .filter((lang) => !formData.languages.includes(lang))
                .map((language, index) => (
                  <option key={`${language}-${index}`} value={language}>
                    {language}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                selectedLanguage && handleAdd("languages", selectedLanguage)
              }
              disabled={!selectedLanguage}
              className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
               {t("languages-nanny.addButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQualifications;
