import React, { useState, useEffect } from "react";
import axios from "axios";


type ProfilePictureUploaderProps = {
  uploadEndpoint: string;
  fetchImageEndpoint: string;
  onUploadSuccess?: (newImageUrl: string) => void;
};

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  uploadEndpoint,
  fetchImageEndpoint,
  onUploadSuccess,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("https://via.placeholder.com/128");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem("SliderService");

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!userId) {
        console.error("User ID não encontrado.");
        return;
      }
  
      try {
        const response = await axios.get(`${fetchImageEndpoint}`);
        const profilePictureUrl = response.data.file?.filePath;
  
   
        if (profilePictureUrl) {
          // Remove o prefixo "uploads/" se existir
          const correctedUrl = profilePictureUrl.substring(8);
             
           
          // Atualiza a imagem para o estado
          setImageUrl(`http://localhost:3005/uploads/${correctedUrl}`);
        } else {
          // Define uma imagem padrão
          setImageUrl("https://via.placeholder.com/128");
        }
      } catch (error) {
        console.error("Erro ao buscar a foto de perfil:", error);
        setImageUrl("https://via.placeholder.com/128");
      }
    };
  
    fetchUserImage();
  }, [fetchImageEndpoint, userId]);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);

      // Exibir a pré-visualização da imagem
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecione uma foto para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    setUploading(true);

    try {
      const response = await axios.put(`${uploadEndpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImageUrl = response.data.profilePicture;
      setImageUrl(newImageUrl); // Atualiza a imagem exibida
      onUploadSuccess && onUploadSuccess(newImageUrl);
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
      alert("Erro ao atualizar a foto de perfil.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-sm"
        />
        <label
          htmlFor="file-upload"
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-200"
        >
          Alterar Foto
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        disabled={uploading}
      >
        {uploading ? "Enviando..." : "Salvar Alterações"}
      </button>
    </div>
  );
};

export default ProfilePictureUploader;
