interface Pet {
  id: number;
  name: string;
  status?: 'available' | 'pending' | 'sold';
  photoUrls?: string[];
  category?: {
    id?: number;
    name?: string;
  };
  tags?: Array<{
    id?: number;
    name?: string;
  }>;
}

let pets: Pet[] = [
  {
    id: 1,
    name: 'sparky',
    status: 'available',
    photoUrls: ['https://example.com/sparky.jpg'],
    tags: [{ name: 'sweet' }],
  },
  {
    id: 2,
    name: 'buzz',
    status: 'available',
    photoUrls: ['https://example.com/buzz.jpg'],
    tags: [{ name: 'purrfect' }],
  },
  {
    id: 3,
    name: 'max',
    status: 'sold',
    photoUrls: [],
    tags: [],
  },
];

let nextId = 4;

export class PetsService {
  findAll(query?: { status?: string }): Pet[] {
    if (query?.status) {
      return pets.filter((p) => p.status === query.status);
    }
    return pets;
  }

  findById(id: number): Pet | undefined {
    return pets.find((p) => p.id === id);
  }

  create(pet: Omit<Pet, 'id'>): Pet {
    const newPet: Pet = {
      id: nextId++,
      ...pet,
    };
    pets.push(newPet);
    return newPet;
  }

  delete(id: number): boolean {
    const index = pets.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    pets.splice(index, 1);
    return true;
  }
}


