import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const formatReminderData = (reminders, userId) => {
    return reminders.map((reminder) => ({
        ...reminder,
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
        next(error);
    }
}

const getAllReminders = async (req, res, next) => {
    const userId = req.user.user_id;
    try {
        const data = await prisma.reminder.findMany({
            where: {user_id: userId}
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
        next(error);
    }
}

const updateReminder = async (req, res, next) => {
    const reminderId = req.params.id;
    const { day, time, is_actived } = req.body;
    try {
        const existingReminder = await prisma.reminder.findUnique({
            where: {
                reminder_id: parseInt(reminderId),
            },
        });

        if (!existingReminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        const updatedReminder = await prisma.reminder.update({
            where: {
                reminder_id: parseInt(reminderId),
            },
            data: {
                day: day.toLowerCase() || existingReminder.day,
                time: time || existingReminder.time,
                is_actived: is_actived !== undefined ? is_actived : existingReminder.is_actived,
                updated_at: new Date(),
            },
        });

        res.status(200).json({
            success: true,
            message: "Reminder updated successfully",
            data: updatedReminder,
        });
    } catch (error) {
        error.statusCode = 500;
        error.status=false;
        error.errors = error
        next(error);
    }
}

const deleteReminder = async (req, res, next) => {
    const reminderId = req.params.id;
    try {
        const existingReminder = await prisma.reminder.findUnique({
            where: {
                reminder_id: parseInt(reminderId),
            },
        });
        if (!existingReminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found",
            });
        }
        const deleteData = await prisma.reminder.deleteMany({
            where: {
                reminder_id: parseInt(reminderId),
            }
        })
        res.status(200).json({
            success: true,
            message: "success delete reminder",
        })
    }catch (error) {
        error.statusCode = 500;
        error.status=false;
        error.errors = error
        next(error);
    }
}
export {
    addReminder,
    getAllReminders,
    updateReminder,
    deleteReminder
};