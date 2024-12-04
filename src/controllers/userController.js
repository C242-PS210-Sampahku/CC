import { auth } from "../configs/firebase.js";
import {PrismaClient} from "@prisma/client";
import {validationResult} from "express-validator";
import {uploadToGCS} from "../utils/uploadToCloudStorage.js";
import {Schema as errors} from "@firebase/vertexai";

const prisma = new PrismaClient()

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed');
        err.status = false;
        err.statusCode = 400;
        err.errors = errors.array();
        return next(err);
    }
    const { email, password, username, name, gender, noHp } = req.body;

    let firebaseUser = null;
    try {
        let photoUrl = null;
        if (req.file) {
            photoUrl = await uploadToGCS(req.file.buffer, req.file.mimetype, req.file.originalname, 'profile-images');
        }

        firebaseUser = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Simpan data pengguna di database
        const newUser = await prisma.user.create({
            data: {
                user_id: firebaseUser.uid,
                username,
                gender,
                name,
                email,
                no_hp: noHp,
                img_url: photoUrl,
            },
        });

        res.status(201).json({
            status: true,
            message: 'User registered',
            data: newUser,
        });
    } catch (error) {
        if(firebaseUser){
            await auth.deleteUser(firebaseUser.uid);
        }
        error.message = error.message || 'register failed';
        next(error);
    }
};

const updateUser = async (req, res) => {
    const userId = req.user.user_id;
    const { username, name, gender, noHp } = req.body;
    let photoUrl = null
    try {
        if (req.file) {
            photoUrl = await uploadToGCS(req.file.buffer, req.file.mimetype, req.file.originalname, 'profile-images');
        }
        // const userRecord = await auth().updateUser(userId, {
        //     email: email
        // });
        const updateUser = await prisma.user.update({
            where: { user_id: userId },
            data: {
                username,
                name,
                gender,
                no_hp: noHp,
                img_url: photoUrl,
                updated_at: new Date().toISOString(),
            }
        });
        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updateUser
        })
    }catch (error) {
        error.statusCode = 400;
        error.status = false;
        error.errors = error;
        next(error);
    }
}

const deleteUser = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const userRecord = await auth.deleteUser(userId);
        const deleteUser = await prisma.user.delete({
            where: { user_id: userId },
        });
        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        })
    }catch (error) {
        error.statusCode = 400;
        error.status = false;
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    const userId = req.user.user_id;
    try {
        const findUserById = await prisma.user.findUnique({
            where: { user_id: userId },
        });
        res.status(200).json({
            status: true,
            message: "User found",
            data: findUserById,
        })
    }catch (error) {
        error.statusCode = 400;
        error.status = false;
        error.message = 'User getting user with id ' + userId + ' does not exist';
        error.errors = errors;
        next(error);
    }
}

export { registerUser, updateUser, deleteUser, getUserById };
