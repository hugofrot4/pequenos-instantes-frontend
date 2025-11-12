const BACKEND_URL = 'http://localhost:3001';

async function getPhotos() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/photos`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar dados da API'); 
    }

    const data = await res.json();
    return data.photos;
  } catch (error) {
    console.error('Erro ao buscar fotos:', error.message);
    return [];
  }
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Pequenos Instantes
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos && photos.length > 0 ? (
            photos.map((photo) => (
              <div 
                key={photo.id} 
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
      </div>
    </main>
  )
}