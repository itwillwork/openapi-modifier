import { Paths } from './types/generated-api-types';

export async function fetchPetById(petId: number): Promise<Paths.GetPetById.Responses.$200> {
  const res = await fetch(`/api/v3/pet/${petId}`);
  if (!res.ok) {
    throw new Error('Pet is not found');
  }
  return res.json();
} 