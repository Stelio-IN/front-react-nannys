import React from "react";
import { useTranslation } from "react-i18next";
import image1 from "../assets/black.jpeg";
import image2 from "../assets/chinese.jpg";
import image3 from "../assets/mestica.jpeg";
import image4 from "../assets/white.webp";
import image5 from "../assets/foto2.jpg";

const ExpressNanniesHomepage = () => {
  const { t } = useTranslation();
  const images = [image1, image2, image3, image4, image5]; // Array com as imagens do carrossel

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500 mb-4">
            {t("expressNannies.heroTitle")}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {t("expressNannies.heroDescription")}
          </p>
        </div>

        {/* Image Carousel */}
        <div className="max-w-6xl mx-auto mb-12 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image}
                  alt={`Happy family ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {t("expressNannies.trustedCaregiversTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {t("expressNannies.trustedCaregiversDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpressNanniesHomepage;
