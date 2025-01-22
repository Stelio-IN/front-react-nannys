import React, { useState } from "react";
import { UserCog, X, Save, Eye, EyeOff } from "lucide-react";
import axios from "axios"; // Certifique-se de instalar axios para enviar requisições HTTP

const Header = () => {
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleChangeCredentials = () => {
    setIsChangingCredentials(!isChangingCredentials);
    setCredentials({
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (credentials.newPassword !== credentials.confirmPassword) {
      setErrorMessage("The new password and confirmation do not match.");
      return;
    }

    if (credentials.newPassword.length < 8) {
      setErrorMessage("The new password must be at least 8 characters.");
      return;
    }

    try {
      // Supondo que o email seja único
      const response = await axios.put(`http://localhost:3005/Admin/${credentials.email}`, {
        currentPassword: credentials.currentPassword,
        newPassword: credentials.newPassword
      });
      // Exibir mensagem de sucesso
      setSuccessMessage("Password changed successfully!");
      setErrorMessage("");
      toggleChangeCredentials(); // Fechar o formulário após o sucesso
    } catch (error) {
      // Se houver um erro, exiba uma mensagem
      setErrorMessage(
        error.response?.data?.message || "Error updating the password."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="relative">
      <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome to the management system
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleChangeCredentials}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
                         bg-gray-50 text-gray-700 hover:bg-gray-100
                         border border-gray-200 hover:border-gray-300
                         transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <UserCog className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Admin</span>
            </button>
          </div>
        </div>

        {isChangingCredentials && (
          <div className="absolute top-full left-0 right-0 mt-2 z-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-200 ease-in-out"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">
                  Change Password
                </h2>
                <button
                  type="button"
                  onClick={toggleChangeCredentials}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Exibir mensagens de erro ou sucesso */}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}

              <div className="space-y-4">
                {/* Campo de email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 
                               focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                               transition-all duration-200"
                    required
                  />
                </div>

                {/* Campos de senha */}
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field === "currentPassword"
                          ? "Current Password"
                          : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisibility[field] ? "text" : "password"}
                          name={field}
                          value={credentials[field]}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 
                                 focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                                 transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {passwordVisibility[field] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg
                           bg-blue-50 text-blue-600 hover:bg-blue-100
                           transition-all duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {isChangingCredentials && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-0"
          onClick={toggleChangeCredentials}
        />
      )}
    </div>
  );
};

export default Header;
