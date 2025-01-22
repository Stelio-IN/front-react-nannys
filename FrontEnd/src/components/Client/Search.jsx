import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import NannyCard from "./NannyCard"; // Importa o componente NannyCard

const Search = () => {
  const { t } = useTranslation(); // Inicializa o uso de traduções

  const [searchResults, setSearchResults] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [client, setClient] = useState({
    country: "",
    province: "",
  });
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [error, setError] = useState(null); // Estado para tratar erros de fetch

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (!client.country || !client.province || !availability) {
        alert(t('search.pleaseSelectFields'));
        return;
      }

      const requestBody = {
        province: client.province,
        jobType: availability,
      };

      const url = "http://localhost:3005/user/getAllNannyWith/Requirement";

      const response = await axios.post(url, requestBody);

      if (response.status === 200 && response.data.length === 0) {
        alert(t('search.noResultsFound'));
        setSearchResults([]); // Limpar resultados anteriores
      } else {
        const nannies = response.data.map((nanny) => {
          const filePath = nanny.files?.[0]?.path;
          const fileName = filePath ? filePath.split("\\").pop() : null;
          const profilePictureUrl = fileName
            ? `http://localhost:3005/uploads/${fileName}`
            : "/default-profile.png";

          return { ...nanny, profilePictureUrl };
        });

        setSearchResults(nannies);
        setCurrentPage(1);
      }
    } catch (error) {
      setError(t('search.errorFetchingData'));
      console.error("Error fetching nannies:", error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
      } catch (error) {
        setError(t('search.errorFetchingCountries'));
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (client.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/provinces/${client.country}`);
          setProvinces(response.data);
        } catch (error) {
          setError(t('search.errorFetchingProvinces'));
          console.error("Error fetching provinces:", error);
        }
      };

      fetchProvinces();
    }
  }, [client.country]);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < searchResults.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          {t('search.findANanny')}
        </h3>

        {error && <p className="text-red-500">{error}</p>} {/* Exibe erro, se houver */}

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">{t('search.country')}</label>
            <select
              id="country"
              value={client.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                {t('search.selectCountry')}
              </option>
              {countries.length > 0 ? (
                countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))
              ) : (
                <option disabled>{t('search.noCountries')}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2">{t('search.province')}</label>
            <select
              id="province"
              value={client.province}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                {t('search.selectProvince')}
              </option>
              {provinces.length > 0 ? (
                provinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))
              ) : (
                <option disabled>{t('search.noProvinces')}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">{t('search.availability')}</label>
            <select
              value={availability}
              onChange={handleAvailabilityChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">{t('search.selectAvailability')}</option>
              <option value="full_time">{t('search.fullTime')}</option>
              <option value="temporary">{t('search.temporary')}</option>
            </select>
          </div>

          <div className="col-span-3 mt-4">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('search.searchNannies')}
            </button>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {currentResults.map((nanny) => (
            <NannyCard key={nanny.user_id} nanny={nanny} />
          ))}
        </div>
      )}

      {searchResults.length > itemsPerPage && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {t('search.previous')}
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= searchResults.length}
            className={`px-4 py-2 rounded-lg ${
              currentPage * itemsPerPage >= searchResults.length
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {t('search.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
