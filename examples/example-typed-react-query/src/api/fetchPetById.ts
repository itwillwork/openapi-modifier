/// <reference path="./types/generated-api-types.d.ts" />

export async function fetchPetById(petId: number): Promise<Paths.GetPetById.Responses.$200> {
  const res = await fetch(`http://localhost:4010/api/v3/pet/${petId}`);
  if (!res.ok) {
    throw new Error('Pet is not found');
  }
  return res.json();
} 