const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    const { id: userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const user = await User.findById(userId);



        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const deleteUserById = async (req, res) => {
    const { id: userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const updateMe = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateMe,
    getUserProfile,
}


