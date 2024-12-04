import express from "express";
import { authFirebase } from "../middleware/authFirebase.js";
import {predictWaste, getPredictionHistory, getPrediction, deletePrediction} from "../controllers/predictController.js";
import {addReminder, deleteReminder, getAllReminders, updateReminder} from "../controllers/reminderController.js";
import {deleteUser, getUserById, updateUser} from "../controllers/userController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();


router.get("/protected",authFirebase, (req, res) => {
    res.status(200).json({
        message: "Access granted",
        user: req.user,
    });
});

router.put("/users", upload.single('photoProfile'), authFirebase, updateUser);
router.delete("/users", authFirebase, deleteUser);
router.get('/users', authFirebase, getUserById)

router.post("/predicts", upload.single('predictImage'),authFirebase,predictWaste);
router.get("/predicts", authFirebase, getPredictionHistory);
router.get('/predicts/:id', authFirebase, getPrediction);
router.delete('/predicts/:id', authFirebase, deletePrediction);

router.post("/reminders", authFirebase, addReminder);
router.get("/reminders", authFirebase, getAllReminders);
router.put('/reminders/:id', authFirebase, updateReminder);
router.delete('/reminders/:id', authFirebase, deleteReminder);

export default router;