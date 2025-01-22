import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Lock, EyeOff, Eye } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Importa o hook

type NannyQuickStatsProps = {
  completedJobs?: number;
  rating?: number;
  availabilityStatus?: string;
  professionalSummary?: string;
};

const NannyQuickStats: React.FC<NannyQuickStatsProps> = ({
 
}) => {
  const { t } = useTranslation(); // Usando o hook para tradução
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [nannyProfile, setNannyProfile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [completedJobs, setCompletedJobs] = useState("");

  // Função para alterar a senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (newPassword.length < 8) {
      setPasswordError(t("errorPasswordLength")); // Usando tradução
      return;
    }

    try {
      // Realizar a requisição para mudar a senha
      const response = await axios.put("http://localhost:3005/user/upd/Pas", {
        email: nannyProfile?.email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      setSuccessMessage(t("passwordUpdateSuccess")); // Usando tradução
      setPasswordError("");
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(t("passwordUpdateError")); // Usando tradução
      setSuccessMessage("");
    }
  };

  // Função para alternar a visibilidade das senhas
  const togglePasswordVisibility = (type: "current" | "new") => {
    switch (type) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
    }
  };

  // Função para buscar o perfil do usuário
  useEffect(() => {
    fetchNannyProfile();
  }, []);

  const fetchNannyProfile = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3005/user/${idUser}`);
      setNannyProfile(response.data);
    } catch (error) {
      console.error("Erro ao buscar o perfil:", error);
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/countReservations/${idUser}`
      );
      setCompletedJobs(response.data);
    } catch (error) {
      console.error("Erro ao buscar o perfil:", error);
    }
  };

  if (!nannyProfile) {
    return <div>{t("NannyQuickStats.profileNotFound")}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            {t("NannyQuickStats.professionalOverview")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.completedJobs")}</span>
              <span className="font-bold text-gray-800">
                {completedJobs.count || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.currency")}</span>
              <span className="font-bold text-gray-800">
                {nannyProfile.nannyProfile.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.monthlySalary")}</span>
              <span className="font-bold text-gray-800">
                {nannyProfile.nannyProfile.mounthly_Salary}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.dailySalary")}</span>
              <span className="font-bold text-gray-800">
                {nannyProfile.nannyProfile.daily_salary}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.phoneNumber")}</span>
              <span className="font-bold text-gray-800">
                {nannyProfile.contact_phone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("NannyQuickStats.availability")}</span>
              <div className="flex items-center">
                {nannyProfile.background_check_status === "pending" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-bold text-yellow-600">
                      {t("NannyQuickStats.pending")}
                    </span>
                  </>
                )}
                {nannyProfile.background_check_status === "approved" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-bold text-green-600">
                      {t("NannyQuickStats.approved")}
                    </span>
                  </>
                )}
                {nannyProfile.background_check_status === "rejected" && (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="font-bold text-red-600">
                      {t("NannyQuickStats.rejected")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            {t("NannyQuickStats.professionalSummary")}
          </h3>
          <p className="text-gray-600 italic leading-relaxed">
            "{nannyProfile.nannyProfile.additional_info}"
          </p>
        </div>

        {/* Password Change Section */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            {t("NannyQuickStats.changePassword")}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("NannyQuickStats.email")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={nannyProfile?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("currentPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t("NannyQuickStats.currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("NannyQuickStats.newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t("NannyQuickStats.newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm mt-2">{passwordError}</div>
            )}

            {successMessage && (
              <div className="text-green-500 text-sm mt-2">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t("NannyQuickStats.changePassword")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NannyQuickStats;
