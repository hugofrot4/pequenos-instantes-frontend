import PhotoGallery from './PhotoGallery'; // Importa nosso novo componente

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
    console.error("Erro ao buscar fotos:", error.message);
    return [];
  }
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <PhotoGallery initialPhotos={photos} />
    </main>
  );
}