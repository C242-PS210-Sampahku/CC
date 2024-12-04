import express from "express";
const app = express();
import "dotenv/config.js"
import publicRouter from "./routes/public.js";
import {login} from "./controllers/firebaseController.js";
import protectedRouter from "./routes/protected.js";
import {authFirebase} from "./middleware/authFirebase.js"
import errorHandler from "./utils/errorHandler.js";

// import fileUpload from "express-fileupload";
// app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000

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