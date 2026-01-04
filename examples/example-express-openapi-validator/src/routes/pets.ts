import { Request, Response } from 'express';
import { PetsService } from '../services/pets';

const petsService = new PetsService();

export const getPetById = (req: Request, res: Response) => {
  const petId = parseInt(req.params.petId, 10);
  const pet = petsService.findById(petId);
  if (!pet) {
    return res.status(404).json({
      code: 404,
      message: 'Pet not found',
    });
  }

  return res.json(pet);
};


