import { auth } from "../configs/firebase.js";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { uploadToGCS } from "../utils/uploadToCloudStorage.js";

const prisma = new PrismaClient();

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array()[0];
    err.status = false;
    err.statusCode = 400;
    err.message = err.msg;
    return next(err);
  }
  const { email, password, username, name, gender, noHp } = req.body;

  let firebaseUser = null;
  try {
    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadToGCS(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
        "profile-images"
      );
    }

    firebaseUser = await auth.createUser({
      email,
      password,
      displayName: name,
    });
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
      success: true,
      message: "User registered",
      data: newUser,
    });
  } catch (error) {
    if (firebaseUser) {
      await auth.deleteUser(firebaseUser.uid);
    }
    error.message = error.message || "register failed";
    next(error);
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.user_id;
  const { username, name, gender, noHp } = req.body;
  let photoUrl = null;
  try {
    if (req.file) {
      photoUrl = await uploadToGCS(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
        "profile-images"
      );
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
      },
    });
    res.status(200).json({
      success: "success",
      message: "User updated successfully",
      data: updateUser,
    });
  } catch (error) {
    error.statusCode = 400;
    error.status = false;
    error.errors = error;
    next(error);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const userRecord = await auth.deleteUser(userId);
    const deleteUser = await prisma.user.delete({
      where: { user_id: userId },
    });
    res.status(200).json({
      success: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    error.statusCode = 400;
    error.status = false;
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.user.user_id;
  try {
    // Cari user berdasarkan ID
    const findUserById = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    // Jika user tidak ditemukan, lempar error 404
    if (!findUserById) {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.status = false;
      throw error;
    }
    console.log(findUserById);

    // Jika user ditemukan, kembalikan respons dengan data user
    res.status(200).json({
      success: true,
      message: "User found",
      data: findUserById,
    });
  } catch (error) {
    // Penanganan error
    if (!error.statusCode) {
      error.statusCode = 500; // Error default jika tidak ada statusCode
    }
    next(error); // Kirim error ke middleware berikutnya
  }
};

const loginWithFirebase = async (req, res, next) => {
  const user = req.user;

  try {
    // Check if user exists
    let cekUser = await prisma.user.findUnique({
      where: { user_id: user.uid },
    });

    if (!cekUser) {
      // Create user if not exists
      cekUser = await prisma.user.create({
        data: {
          user_id: user.uid,
          username: user.name,
          name: user.name,
          email: user.email,
        },
      });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: cekUser,
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};

export { registerUser, updateUser, deleteUser, getUserById, loginWithFirebase};
