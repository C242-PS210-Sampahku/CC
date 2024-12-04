import {PrismaClient} from "@prisma/client"
import axios from 'axios';
import FormData from 'form-data';
import {uploadToGCS} from "../utils/uploadToCloudStorage.js";
import "dotenv/config.js"

const prisma = new PrismaClient();

const createHistoryEntry = async (userId, resultId) => {
    try {
        const historyEntry = await prisma.history.create({
            data: {
                result_id: resultId,
                user_id: userId,
            }
        });
    } catch (error) {
        console.error("Error creating history entry:", error);
    }
};


const predictWaste = async (req, res) => {
    let photoUrl = null;
    try {

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        if (req.file) {
            photoUrl = await uploadToGCS(req.file.buffer, req.file.mimetype, req.file.originalname, 'profile-images');
        }

        const modelUrl = process.env.FLASK_URL;
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);
        const startTime = Date.now();
        const response = await axios.post(modelUrl, formData, { headers: formData.getHeaders() });
        const { prediction_result: class_name, confidence } = response.data;
        const endTime = Date.now();
        const duration = endTime - startTime;
        const category = class_name === 'glass'? 'Glasses' : class_name;
        const recommendation = await prisma.$queryRaw`
          SELECT * 
          FROM predict
          WHERE category = ${category}
          ORDER BY RAND()
          LIMIT 1
        `;
        if (!recommendation.length) {
            return res.status(404).json({ error: 'No recommendation found for this category' });
        }
        const userId = req.user?.user_id || '2';
        const userExists = await prisma.user.findUnique({ where: { user_id: userId } });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newPrediction = await prisma.result.create({
            data: {
                user_id: userId,
                img_url: photoUrl,
                predict_id: recommendation[0].predict_id,
            },
        });
        await createHistoryEntry(userId, newPrediction.result_id);
        return res.status(200).json({
            success: true,
            message: 'Prediction successfully',
            data: {
                prediction: { category: class_name, confidence },
                tips: recommendation[0]?.suggestion || null,
                result_id: newPrediction.result_id,
                photo_url: photoUrl,
            },
        });
    } catch (error) {
        error.statusCode = 500;
        error.message = new Error('predict failed');
        error.status = false;
        error.errors = error;
        next(error);
    }
};

const getPredictionHistory = async (req, res, next) => {
    const userId = req.user.user_id;
    const{page = 1, limit= 5} = req.query;
    const skip = (page - 1) * limit;

    try {
        const result= await prisma.history.findMany({
            where: {
                user_id: userId,
            },
            include: {
                result: {
                    select: {
                        result_id: true,
                        img_url: true,
                        predict: {
                            select: {
                                category: true,
                                suggestion: true,
                            },
                        },
                    },
                },
            },
            skip: skip,
            take: parseInt(limit),
            orderBy: {
                history_id: 'desc',
            },
        });
        if (!result.length) {
            const err = new Error('No history data');
            err.statusCode = 404;
            err.message = err;
            err.status = false;
            next(err);
        }
        const resultCount = await prisma.history.count({
            where: {
                user_id: userId,
            }
        })
        const totalPage = Math.ceil(resultCount / limit);
        res.status(200).json({
            success: true,
            message: "successful retrieve history prediction",
            current_page: page-0,
            total_data: resultCount,
            total_page: totalPage,
            data:result,
        })
    } catch (error) {
        error.statusCode = 500;
        error.message = new Error('Error retrieving prediction history');;
        error.status = false;
        next(error);
    }
};

const getPrediction = async (req, res) => {
    const predictId = parseInt(req.params.id);
    console.log(predictId);
    try {
        const historyRecord = await prisma.result.findUnique({
            where: {
                result_id: predictId,
            },
            include: {
                history: true,
                predict: true,
            },
        });

        if (!historyRecord) {
            return res.status(400).json({ error : 'No history records found' });
        }
        res.status(200).json({
            success: true,
            message: 'successful get predict history ',
            data: historyRecord
        })
    }catch (error) {
        error.statusCode = 500;
        error.message = new Error('failed to retrieve prediction');
        error.status = false;
        error.errors = error;
        next(error);
    }
}

const deletePrediction = async (req, res) => {
    const historyId = parseInt(req.params.id);

    try {
        // Ambil data history terlebih dahulu
        const history = await prisma.history.findUnique({
            where: { history_id: historyId },
            include: {
                result: true, // Menyertakan data result yang terkait
            }
        });

        if (!history) {
            return res.status(404).json({ error: 'History not found' });
        }
        await prisma.result.delete({
            where: { result_id: history.result_id },
        });
        return res.status(200).json({
            success: true,
            message: 'Prediction history and related results deleted successfully'
        });

    } catch (error) {
        // return res.status(500).json({ error: 'Failed to delete prediction history' });
        error.statusCode = 500;
        error.message = new Error('Failed to delete prediction history');
        error.status = false;
        error.errors = error;
        next(error);
    }

};

export {predictWaste, getPredictionHistory, getPrediction, deletePrediction};