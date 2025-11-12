"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = 'http://localhost:3001';

export default function PhotoGallery({ initialPhotos }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Por favor, selecione um arquivo.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha no upload");
      }

      setDescription("");
      setFile(null);
      e.target.reset();
      
      router.refresh();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (index) => {
    setSelectedPhotoIndex(index);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const showNext = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    const nextIndex = (selectedPhotoIndex + 1) % initialPhotos.length;
    setSelectedPhotoIndex(nextIndex);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    const prevIndex = (selectedPhotoIndex - 1 + initialPhotos.length) % initialPhotos.length;
    setSelectedPhotoIndex(prevIndex);
  };

  const selectedPhoto = selectedPhotoIndex !== null 
    ? initialPhotos[selectedPhotoIndex] 
    : null;

  return (
    <div className="container mx-auto">
      
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nova Foto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2">
              Imagem
            </label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Salvar Foto"}
            </button>
            
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
          </div>
        </form>
      </div>

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Pequenos Instantes
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialPhotos && initialPhotos.length > 0 ? (
          initialPhotos.map((photo, index) => (
            <div 
              key={photo.id}
              onClick={() => openModal(index)}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img 
                src={`${BACKEND_URL}/uploads/${photo.image_path}`} 
                alt={photo.description} 
                className="w-full h-48 object-cover bg-gray-200"
              />
              <div className="p-4">
                <p className="text-gray-700 truncate">{photo.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Nenhuma foto encontrada.
          </p>
        )}
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl p-4 bg-white rounded-lg shadow-2xl mx-4"
            onClick={stopPropagation}
          >
            <button
              onClick={closeModal}
              className="absolute z-10 p-2 text-white transition bg-gray-800 bg-opacity-50 rounded-full -top-3 -right-3 hover:bg-opacity-75"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="flex flex-col">
              <img
                src={`${BACKEND_URL}/uploads/${selectedPhoto.image_path}`}
                alt={selectedPhoto.description}
                className="object-contain w-full rounded-lg max-h-[75vh]"
              />
              <p className="mt-4 text-lg text-center text-gray-700">
                {selectedPhoto.description}
              </p>
            </div>

            <button
              onClick={showPrev}
              className="absolute left-0 p-3 transform -translate-x-1/2 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2 hover:bg-gray-200"
              aria-label="Foto anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <button
              onClick={showNext}
              className="absolute right-0 p-3 transform translate-x-1/2 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2 hover:bg-gray-200"
              aria-label="Próxima foto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}