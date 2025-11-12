const mockPhotos = [
  { id: 1, description: "Foto de teste 1", image_path: "placeholder.jpg" },
  { id: 2, description: "Foto de teste 2", image_path: "placeholder.jpg" },
  { id: 3, description: "Foto de teste 3", image_path: "placeholder.jpg" },
  { id: 4, description: "Foto de teste 4", image_path: "placeholder.jpg" },
];

const BACKEND_URL = 'http://localhost:3001';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Pequenos Instantes
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {mockPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem</span>
                {/* Na próxima etapa, trocaremos isso por:
                  <img 
                    src={`${BACKEND_URL}/uploads/${photo.image_path}`} 
                    alt={photo.description} 
                    className="w-full h-48 object-cover"
                  />
                */}
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 truncate">{photo.description}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </main>
  )
}