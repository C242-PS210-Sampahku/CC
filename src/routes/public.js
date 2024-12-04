import express from "express";
import {registerUser} from "../controllers/userController.js";
import {predictWaste} from "../controllers/predictController.js";
import userValidator from "../validations/userValidation.js";
import upload from "../middleware/multerMiddleware.js";
import {login} from "../controllers/firebaseController.js";

const router = express.Router();

router.post('/register',  upload.single('photoProfile'), userValidator, registerUser);
router.post('/prediction', predictWaste);
router.post('/login', login);

export default router;