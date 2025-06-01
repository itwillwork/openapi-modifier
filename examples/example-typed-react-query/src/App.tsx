import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { fetchPetById } from './api/fetchPetById';
import { ApiPet, ApiTag } from './api/types/models';

function PetCard({ pet }: { pet: ApiPet }) {
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
        <p><b>Tags:</b> {pet.tags.map((tag: ApiTag) => tag?.name).filter(Boolean).join(', ')}</p>
      )}
    </div>
  );
}

function App() {
  // TODO: replace with any id
  const petId = 1;
  const { isPending, error, data } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => fetchPetById(petId),
  });

  return (
    <div className="App">
      <h1>Pet Card</h1>
      {isPending && <div>Loading...</div>}
      {error instanceof Error && <div>Error: {error.message}</div>}
      {data && <PetCard pet={data} />}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
