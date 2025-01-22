import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = {
    lat: -25.9659, // Latitude (exemplo de Maputo)
    lng: 32.5892, // Longitude (exemplo de Maputo)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar mensagens anteriores
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3005/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('contactPage.form.successMessage'));
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(`${t('contactPage.form.errorMessage')}: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage(t('contactPage.form.errorMessage'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
            {t('contactPage.header.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contactPage.header.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t('contactPage.contactInfo.title')}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('contactPage.contactInfo.phone.label')}
                  </h3>
                  {t('contactPage.contactInfo.phone.numbers', { returnObjects: true }).map(
                    (phone, index) => (
                      <p key={index} className="text-gray-600">
                        {phone}
                      </p>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('contactPage.contactInfo.email.label')}
                  </h3>
                  {t('contactPage.contactInfo.email.addresses', { returnObjects: true }).map(
                    (email, index) => (
                      <p key={index} className="text-gray-600">
                        {email}
                      </p>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('contactPage.contactInfo.location.label')}
                  </h3>
                  {t('contactPage.contactInfo.location.details', { returnObjects: true }).map(
                    (location, index) => (
                      <p key={index} className="text-gray-600">
                        {location}
                      </p>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('contactPage.contactInfo.hours.label')}
                  </h3>
                  {t('contactPage.contactInfo.hours.details', { returnObjects: true }).map(
                    (hour, index) => (
                      <p key={index} className="text-gray-600">
                        {hour}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t('contactPage.form.title')}
            </h2>

            {successMessage && (
              <div className="text-green-600 mb-4">
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 mb-4">
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'email', 'subject', 'message'].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t(`contactPage.form.fields.${field}`)}
                  </label>
                  {field !== 'message' ? (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  ) : (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    ></textarea>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                {t('contactPage.form.submitButton')}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t('contactPage.map.title')}
          </h2>
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <LoadScript googleMapsApiKey="AIzaSyC-iWtYM5-YSJR-9WBwAUUttdhWvHp1XR-s">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={location}
                zoom={14}
              >
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
