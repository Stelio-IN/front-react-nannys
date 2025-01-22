import React, { useEffect, useState } from "react";
import { Search, UserCheck, CheckCircle2, AlertCircle, FileText, Mail, MapPin, CreditCard, X ,Phone} from "lucide-react";

const MainComponent = () => {
  const [activeTab, setActiveTab] = useState("babas");
  const [babas, setBabas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3005/user")
      .then(response => response.json())
      .then(data => {
        setBabas(data.filter((user) => user.role === "nanny"));
        setClientes(data.filter((user) => user.role === "client"));
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const alterarStatus = (id, novoStatus) => {
    setBabas(prev =>
      prev.map(baba =>
        baba.user_id === id ? { ...baba, background_check_status: novoStatus } : baba
      )
    );
    setClientes(prev =>
      prev.map(cliente =>
        cliente.user_id === id ? { ...cliente, background_check_status: novoStatus } : cliente
      )
    );

    fetch("http://localhost:3005/user/changeStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
        status: novoStatus,
      }),
    })
    .catch(error => console.error("Error updating status:", error));
  };

  const handleDeleteFile = (userId, fileId) => {
    const updateUserFiles = (users) =>
      users.map((user) => {
        if (user.user_id === userId) {
          return {
            ...user,
            files: user.files.filter((file) => file.file_id !== fileId),
          };
        }
        return user;
      });

    setBabas(prev => updateUserFiles(prev));
    setClientes(prev => updateUserFiles(prev));
  };

  const UserCard = ({ user = {}, alterarStatus, onDeleteFile }) => {
    if (!user) {
      return null;
    }

    const {
      first_name = '',
      contact_phone ='',
      last_name = '',
      province_name = '',
      country_name = '',
      email = '',
      id_number = '',
      background_check_status = 'pending',  
      user_id, 
      files = []
    } = user;

    const statusColors = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
      pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
      rejected: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20"
    };

    const buttonStyles = {
      approved: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-1 ring-emerald-500/20",
      pending: "bg-amber-50 text-amber-600 hover:bg-amber-100 ring-1 ring-amber-500/20",
      rejected: "bg-rose-50 text-rose-600 hover:bg-rose-100 ring-1 ring-rose-500/20"
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "approved":
          return <CheckCircle2 className="h-4 w-4" />;
        case "pending":
        case "rejected":
          return <AlertCircle className="h-4 w-4" />;
        default:
          return <AlertCircle className="h-4 w-4" />;
      }
    };

    const handleDeleteFile = async (fileId, userId) => {
      if (!fileId || !userId || !window.confirm('Are you sure you want to delete this file?')) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3005/File/deletefile/${fileId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onDeleteFile?.(userId, fileId);
        } else {
          console.error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-indigo-100 transition-all duration-200 p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex gap-6">
            <div className="bg-indigo-50 rounded-2xl p-4 h-fit ring-1 ring-indigo-500/20">
              <UserCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {first_name} {last_name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {province_name}, {country_name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {email}
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  {id_number}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {contact_phone}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <span 
              className={`px-4 py-2 text-sm font-medium rounded-xl border ${statusColors[background_check_status] || statusColors.pending} ring-1`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(background_check_status)}
                {background_check_status.charAt(0).toUpperCase() + background_check_status.slice(1)}
              </div>
            </span>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => alterarStatus?.(user_id, "approved")}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${buttonStyles.approved}`}
              >
                Approve
              </button>
              <button 
                onClick={() => alterarStatus?.(user_id, "pending")}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${buttonStyles.pending}`}
              >
                Pending
              </button>
              <button 
                onClick={() => alterarStatus?.(user_id, "rejected")}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${buttonStyles.rejected}`}
              >
                Reject
              </button>
            </div>

            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file) => (
                  <div
                    key={file.file_id}
                    className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 ring-1 ring-gray-200"
                  >
                    <a
                      href={`http://localhost:3005/${file.file_path?.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {file.file_name}
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.file_id, user_id)}
                      className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Delete file"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UserList = ({ users, alterarStatus, searchTerm, onDeleteFile }) => {
    const filteredUsers = users.filter(user => 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {filteredUsers.map(user => (
          <UserCard 
            key={user.user_id} 
            user={user} 
            alterarStatus={alterarStatus} 
            onDeleteFile={onDeleteFile}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
            <div className="relative w-full lg:w-auto">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full lg:w-96 pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab("babas")}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "babas"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Nannies
              </button>
              <button
                onClick={() => setActiveTab("clientes")}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "clientes"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Clients
              </button>
            </div>
          </div>

          {activeTab === "babas" && (
            <UserList 
              users={babas} 
              alterarStatus={alterarStatus} 
              searchTerm={searchTerm}
              onDeleteFile={handleDeleteFile}
            />
          )}
          {activeTab === "clientes" && (
            <UserList 
              users={clientes} 
              alterarStatus={alterarStatus} 
              searchTerm={searchTerm}
              onDeleteFile={handleDeleteFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;