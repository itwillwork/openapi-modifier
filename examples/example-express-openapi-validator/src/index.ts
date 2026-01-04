import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import * as OpenApiValidator from 'express-openapi-validator';
import { getPetById } from './routes/pets';

const app = express();
const port = process.env.PORT || 3000;
const apiSpec = path.join(__dirname, '../specs/prepared-openapi.json');


app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use('/spec', express.static(apiSpec));

const openApiSpec = JSON.parse(fs.readFileSync(apiSpec).toString());

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

app.get('/api/v3/pet/:petId', getPetById);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // format errors
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API spec available at http://localhost:${port}/spec`);
});

export default app;

