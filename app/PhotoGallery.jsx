"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ArrowLeft, ArrowRight, Trash2, UploadCloud, FileImage } from 'lucide-react';

const BACKEND_URL = 'http://localhost:3001';

export default function PhotoGallery({ initialPhotos }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

      closeUploadModal();
      e.target.reset();
      router.refresh();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadModal = () => setIsUploadModalOpen(true);

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setDescription("");
    setFile(null);
    setError(null);
    setFileName(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setImagePreview(null);
      setFileName(null);
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

  const handleDelete = async () => {
    if (selectedPhotoIndex === null) return;
    
    const photoToDelete = initialPhotos[selectedPhotoIndex];
    const photoId = photoToDelete.id;

    if (!window.confirm(`Tem certeza que quer deletar a foto "${photoToDelete.description}"?`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha ao deletar");
      }

      closeModal();
      router.refresh();

    } catch (err) {
      console.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedPhoto = selectedPhotoIndex !== null 
    ? initialPhotos[selectedPhotoIndex] 
    : null;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Pequenos Instantes
      </h1>

      <div className="text-center mb-12">
        <button
          onClick={openUploadModal}
          className="flex items-center justify-center gap-2 mx-auto bg-yellow-400 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out font-semibold text-lg hover:shadow-xl cursor-pointer"
        >
          <Plus size={20} />
          Adicionar Nova Foto
        </button>
      </div>
      
      {isUploadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={closeUploadModal}
        >
          <div 
            className="relative w-full max-w-xl p-6 bg-white rounded-lg shadow-2xl mx-4 transition-all duration-300 ease-in-out"
            onClick={stopPropagation}
          >
            <button
              onClick={closeUploadModal}
              className="absolute z-10 p-2 text-gray-600 rounded-full -top-3 -right-3 bg-white shadow-md hover:bg-gray-100 transition ease-in-out duration-150"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nova Foto</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-4">
                <label 
                  htmlFor="image" 
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-yellow-50 border-yellow-300 hover:bg-yellow-100 transition-colors ease-in-out duration-200 ${imagePreview ? 'overflow-hidden' : ''}`}
                >
                  {imagePreview ? (
                     <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-600">
                      <UploadCloud size={40} className="mb-3" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-gray-600">Clique para enviar</span> ou arraste</p>
                      <p className="text-xs text-gray-400">PNG, JPG ou GIF</p>
                    </div>
                  )}
                   <input id="image" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" required />
                </label>
                 
                {fileName && !imagePreview && (
                  <div className="flex items-center justify-center w-full text-sm text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                    <FileImage size={16} className="text-gray-500 mr-2" />
                    {fileName}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                  required
                />
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300 disabled:bg-gray-400 cursor-pointer"
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
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialPhotos && initialPhotos.length > 0 ? (
          initialPhotos.map((photo, index) => (
            <div 
              key={photo.id}
              onClick={() => openModal(index)}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl p-4 bg-white rounded-lg shadow-2xl mx-4 transition-all duration-300 ease-in-out"
            onClick={stopPropagation}
          >
            <button
              onClick={closeModal}
              className="absolute z-10 p-2 text-white transition bg-gray-800 bg-opacity-50 rounded-full -top-3 -right-3 hover:bg-opacity-75"
              aria-label="Fechar"
            >
              <X size={20} />
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
              
              <div className="text-center mt-4">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 mx-auto bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 transition duration-300 disabled:bg-gray-400 cursor-pointer"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deletando..." : "Deletar Foto"}
                </button>
              </div>
            </div>

            <button
              onClick={showPrev}
              className="absolute left-0 p-3 transform -translate-x-1/2 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2 hover:bg-gray-200 text-amber-400 cursor-pointer"
              aria-label="Foto anterior"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              onClick={showNext}
              className="absolute right-0 p-3 transform translate-x-1/2 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2 hover:bg-gray-200 text-amber-400 cursor-pointer"
              aria-label="Próxima foto"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}