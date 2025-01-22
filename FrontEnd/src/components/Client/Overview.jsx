import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';  // Hook de tradução

const Overview = ({ clientProfile, idUser }) => {
  const { t } = useTranslation();  // Hook de tradução
  
  const {
    totalNannySearches = 0,
    profileCompleteness = 0,
    recentActivities = [],
  } = clientProfile;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [completedJobs, setCompletedJobs] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [saving, setSaving] = useState({ phone: false });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idUser = localStorage.getItem("SliderService");
      try {
        const response = await axios.get(`http://localhost:3005/client/${idUser}`);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage({ type: "error", text: t('overview.errorLoadingProfile') });
      }
    };

    const fetchCompletedJobs = async () => {
      const idUser = localStorage.getItem("SliderService");
      try {
        const response = await axios.get(
          `http://localhost:3005/reservations/countReservationsC/${idUser}`
        );
        setCompletedJobs(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching completed jobs:", error);
      }
    };

    fetchUserProfile();
    fetchCompletedJobs();
  }, [idUser, t]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000); // Clear the message after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [message]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSavePhone = async () => {
    const idUser = localStorage.getItem("SliderService");
    setSaving((prev) => ({ ...prev, phone: true }));
    try {
      const response = await axios.put(
        `http://localhost:3005/user/save/Phone/${idUser}`,
        { phone }
      );

      if (response.status === 200) {
        setMessage({ type: "success", text: t('overview.phoneUpdated') });
        setPhone(""); // Limpa o campo de telefone após o sucesso
      } else {
        throw new Error(t('overview.failedPhoneUpdate'));
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      setMessage({ type: "error", text: t('overview.failedPhoneUpdate') });
    } finally {
      setSaving((prev) => ({ ...prev, phone: false })); // Restaura o estado do botão
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage({ type: "error", text: t('overview.fillAllFields') });
      return;
    }

    try {
      const response = await axios.put("http://localhost:3005/user/upd/Pas", {
        email,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: t('overview.passwordUpdated') });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ type: "error", text: t('overview.errorUpdatingPassword') });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">{t('overview.quickStats')}</h3>
        <p>
          {t('overview.totalPaidReservations')}:{" "}
          <span className="font-bold text-gray-800">{completedJobs}</span>
        </p>
      </div>

      {/* Change Password Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          {t('overview.changeEmailAndPassword')}
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('overview.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('overview.emailPlaceholder')}
            />
          </div>

          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('overview.currentPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('overview.currentPasswordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword.current ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('overview.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('overview.newPasswordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword.new ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              {t('overview.updatePassword')}
            </button>
          </div>
        </form>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{t('overview.contactInformation')}</h2>
          <button
            onClick={handleSavePhone}
            disabled={saving.phone}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving.phone ? t('overview.saving') : t('overview.save')}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t('overview.phoneInstructions')}
        </p>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t('overview.phone')}
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          placeholder={t('overview.phonePlaceholder')}
        />
      </div>

      {/* Feedback message */}
      {message.text && (
        <div
          className={`mt-4 text-sm ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Overview;
