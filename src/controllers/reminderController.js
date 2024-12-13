import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const formatReminderData = (reminders, userId) => {
    return reminders.map((reminder) => ({
        ...reminder,
        day: reminder.day.toLowerCase(),
        user_id: userId,
    }));
};


const addReminder = async (req, res, next) => {
    const userId = req.user.user_id;
    console.log(userId);
    const reminders = req.body;
    try {
        if(!reminders.length){
            return res.status(400).json({
                success: false,
                message: "No reminders provided.",
            });
        }
        const dataReminders = formatReminderData(reminders, userId);
        const createdReminders = await prisma.reminder.createMany({
            data: dataReminders,
        });
        console.log(createdReminders);
        res.status(201).json({
            success: true,
            message: "Reminders created successfully",
            data: createdReminders,
        });
    }
    catch (error) {
        error.status = false
        next(error);
    }
}

const getAllReminders = async (req, res, next) => {
    const userId = req.user.user_id;
    try {
        const data = await prisma.reminder.findMany({
            where: {
                user_id: userId,
                is_actived: true,
            }
        });
        console.log(data)
        if(!data.length){
            res.status(404).json({
                success: false,
                message: "No reminders found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Reminder found",
            data: data
        })
    }catch (error) {
        error.status = false
        next(error);
    }
}

const updateReminder = async (req, res, next) => {
    const userId = req.user.user_id;
    const reminders = req.body;
    try {
        const existingReminder = await prisma.reminder.findMany({
            where: {
                user_id: userId,
                is_actived: true
            },
        });

        if (!existingReminder.length) {
            return res.status(404).json({ message: "user not have reminders" });
        }
        const changeToInactive = await prisma.reminder.updateMany({
            where: {
                user_id: userId,
                is_actived: true
            },
            data: {
                is_actived: false
            },
        });
        const dataReminders = formatReminderData(reminders, userId);
        const updatedReminder = await prisma.reminder.createMany({
            data: dataReminders,
        });

        res.status(200).json({
            success: true,
            message: "Reminder updated successfully",
            data: updatedReminder,
        });
    } catch (error) {
        error.statusCode = 500;
        error.status=false;
        next(error);
    }
}

const deleteReminder = async (req, res, next) => {
    const userId = req.user.user_id
    try {
        const existingReminder = await prisma.reminder.findMany({
            where: {
                user_id: userId,
                is_actived: true
            },
        });

        if (!existingReminder.length) {
            return res.status(404).json({ message: "user not have reminders" });
        }
        const changeToInactive = await prisma.reminder.updateMany({
            where: {
                user_id: userId,
                is_actived: true
            },
            data: {
                is_actived: false
            },
        });
        res.status(200).json({
            success: true,
            message: "success delete reminder",
        })
    }catch (error) {
        error.statusCode = 500;
        error.status=false;
        next(error);
    }
}
export {
    addReminder,
    getAllReminders,
    updateReminder,
    deleteReminder
};