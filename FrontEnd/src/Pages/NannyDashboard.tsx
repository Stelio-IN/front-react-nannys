import React, { useState, useEffect } from "react";
import { Home, User, Briefcase, Loader } from "lucide-react";
import axios from "axios";
import UserQualifications from "../components/Nanny/UserQualifications";
import NannyQuickyStats from "../components/Nanny/NannyQuickStats";
import ProfilePictureUploader from "../components/Nanny/ProfilePictureUploader";
import BabysittingRequestManager from "../components/Nanny/BabysittingRequestManager";
import { useTranslation } from "react-i18next";

const NannyDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("overview");
  const [nannyProfile, setNannyProfile] = useState(null);
  const [languagesList, setLanguagesList] = useState([]);
  const [formData, setFormData] = useState({
    jobType: "",
    experience: "",
    policeClearance: "",
    policeClearanceFile: null,
    work_preference: [],
    preference_age: [],
    languages: [],
    additionalInfo: "",
  });

  // Função para buscar dados do perfil da babá
  const fetchNannyProfile = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3005/user/${idUser}`);
      setNannyProfile(response.data);
      console.info(response.data);
    } catch (error) {
      console.error("Erro ao buscar o perfil:", error);
    }
  };

  // Função para buscar idiomas disponíveis
  const fetchLanguages = async () => {
    try {
      const response = await axios.get("http://localhost:3005/languages");
      setLanguagesList(response.data); // Atualiza o estado com os idiomas obtidos
    } catch (error) {
      console.error("Erro ao buscar idiomas:", error);
    }
  };

  useEffect(() => {
    fetchNannyProfile(); // Buscar dados do perfil da babá
    fetchLanguages(); // Buscar idiomas disponíveis
  }, []);

  // Se o perfil ou idiomas não foram carregados ainda
  if (!nannyProfile || languagesList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setFormData((prev) => ({
        ...prev,
        policeClearanceFile: file, // Armazena o arquivo de polícia no estado
      }));
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    const submitFormData = new FormData();
    const id_user = localStorage.getItem("SliderService");

    submitFormData.append("id", id_user);
    submitFormData.append("jobType", formData.jobType);
    submitFormData.append("experience", formData.experience);
    submitFormData.append("policeClearance", formData.policeClearance);

    // Envia o arquivo de polícia se houver
    if (formData.policeClearanceFile) {
      submitFormData.append(
        "policeClearanceFile",
        formData.policeClearanceFile
      );
    }

    submitFormData.append(
      "work_preference",
      JSON.stringify(formData.work_preference)
    );
    submitFormData.append(
      "preference_age",
      JSON.stringify(formData.preference_age)
    );
    submitFormData.append("languages", JSON.stringify(formData.languages));
    submitFormData.append("additionalInfo", formData.additionalInfo);

    try {
      const response = await axios.put(
        `http://localhost:3005/user/updatenannyProfiles/${id_user}`,
        submitFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Perfil atualizado com sucesso:", response.data);
      alert(t("error-nanny.updateProfile"));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(t("error-nanny.updateProfile"));
    }
  };

  const formatEducationLevel = (level: string) => {
    return level
      .toLowerCase() // Converte tudo para minúsculas
      .replace(/_/g, " ") // Substitui underscores por espaços
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Coloca a primeira letra de cada palavra em maiúscula
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <NannyQuickyStats />;
      case "profile":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              {t("profile-nanny.personalDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">
                  {t("profile-nanny.name")}: {nannyProfile.first_name} {nannyProfile.last_name}
                </p>
                <p>{t("profile-nanny.email")}: {nannyProfile.email}</p>
                <p>
                  {t("profile-nanny.location")}: {nannyProfile.province_name},{" "}
                  {nannyProfile.country_name}
                </p>
              </div>
              <div>
                <p>{t("profile-nanny.education")}: {nannyProfile.nannyProfile.education_level}</p>
                <p>{t("profile-nanny.dateOfBirth")}: {nannyProfile.nannyProfile.date_of_birth}</p>
                <p>{t("profile-nanny.jobType")}: {nannyProfile.nannyProfile.job_type}</p>
              </div>
            </div>

            {/* Availability & Experience */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-blue-700">
                {t("profile-nanny.availabilityAndExperience")}
              </h2>
              <div className="space-y-2">
                <label className="block mb-2">{t("profile-nanny.jobType")}</label>
                <div className="flex space-x-4">
                  {["full_time", "temporary"].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={formData.jobType === type}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{type.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block mb-2">{t("profile-nanny.experience")}</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">{t("profile-nanny.yearsOfExperience")}</option>
                  <option value="none">{t("profile-nanny.none")}</option>
                  <option value="1-2">1 - 2 years</option>
                  <option value="3-5">3 - 5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>
            </div>

            {/* Background Check */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-blue-700">
                {t("profile-nanny.backgroundCheck")}
              </h2>
              <div className="space-y-2">
                <label className="block mb-2">
                  {t("profile-nanny.policeClearance")}
                </label>
                <div className="flex space-x-4">
                  {["yes", "no"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="policeClearance"
                        value={option}
                        checked={formData.policeClearance === option}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block mb-2">
                    {t("profile-nanny.uploadPoliceClearance")}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block mb-2">{t("profile-nanny.additionalInfo")}</label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder={t("profile-nanny.additionalInfo")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {t("profile-nanny.submit")}
            </button>
          </div>
        );
      case "qualifications":
        return (
          <UserQualifications idUser={nannyProfile.user_id} />
        );
      case "jobs":
        return <BabysittingRequestManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <ProfilePictureUploader
                uploadEndpoint={`http://localhost:3005/user/uploadProfile/Picture/${nannyProfile.user_id}`}
                fetchImageEndpoint={`http://localhost:3005/user/${nannyProfile.user_id}/profile-picture`}
                onUploadSuccess={(newImageUrl) => {
                  console.log("Foto atualizada com sucesso:", newImageUrl);
                }}
              />
              <h2 className="text-2xl font-bold text-blue-700">
                {nannyProfile.first_name} {nannyProfile.last_name}
              </h2>
              <p className="text-gray-600">
                {nannyProfile?.nannyProfile?.education_level
                  ? formatEducationLevel(
                      nannyProfile.nannyProfile.education_level
                    )
                  : t("sidebar-nanny.educationLevel")}
              </p>
            </div>
            <nav className="space-y-4">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeSection === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Home className="mr-3" /> {t("sidebar-nanny.dashboard")}
              </button>
              <button
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeSection === "profile"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="mr-3" /> {t("sidebar-nanny.profile")}
              </button>
              <button
                onClick={() => setActiveSection("jobs")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeSection === "jobs"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Briefcase className="mr-3" /> {t("sidebar-nanny.jobs")}
              </button>
              <button
                onClick={() => setActiveSection("qualifications")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeSection === "qualifications"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Briefcase className="mr-3" /> {t("sidebar-nanny.qualifications")}
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h1 className="text-3xl font-bold text-blue-700">
                {t("dashboard-nanny.title", { name: nannyProfile.first_name })}
              </h1>
              <p className="text-gray-600">{t("dashboard-nanny.description")}</p>
            </div>

            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NannyDashboard;
