import express from "express";

import "dotenv/config.js"
import publicRouter from "./routes/public.js";
import {login} from "./controllers/firebaseController.js";
import protectedRouter from "./routes/protected.js";
import {authFirebase} from "./middleware/authFirebase.js"
import errorHandler from "./utils/errorHandler.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'
import path from 'path';
import { fileURLToPath } from 'url';

// Resolusi path untuk file YAML
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000


// Menyajikan dokumentasi Swagger di endpoint `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("halooooo");
});

app.post('/login', login);

app.use('/api/v1',protectedRouter)
app.use('/api/v1', publicRouter);


app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});