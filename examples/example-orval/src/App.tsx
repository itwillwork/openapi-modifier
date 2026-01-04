import React, { useEffect, useState } from 'react';
import { getPetById } from './api/generated/pet';
import { Pet } from './api/generated/api.schemas';

function PetCard({ pet }: { pet: Pet }) {
  if (!pet) return null;
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 400, margin: '24px auto', boxShadow: '0 2px 8px #eee' }}>
      <h2>{pet.name}</h2>
      {pet.photoUrls && pet.photoUrls.length > 0 && (
        <img src={pet.photoUrls[0]} alt={pet.name} style={{ maxWidth: '100%', borderRadius: 8 }} />
      )}
      <p><b>ID:</b> {pet.id}</p>
      <p><b>Status:</b> {pet.status}</p>
      {pet.category && <p><b>Category:</b> {pet.category.name}</p>}
      {pet.tags && pet.tags.length > 0 && (
        <p><b>Tags:</b> {pet.tags.map((tag) => tag?.name).filter(Boolean).join(', ')}</p>
      )}
    </div>
  );
}

function App() {
  const petId = 1;
  const [data, setData] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPetById(petId);
        if (response.status === 200) {
          setData(response.data);
        } else {
          setError(`Error: ${response.status}`);
        }
      } catch (err: any) {
        setError(err?.data?.message || err?.message || 'Failed to fetch pet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return (
    <div className="App">
      <h1>Pet Card</h1>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <PetCard pet={data} />}
    </div>
  );
}

export default App;

