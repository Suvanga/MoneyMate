import express from 'express';
import UserService from '../services/UserService.js';

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};


const createUser = async (req, res) => {
    const username = req.body.username.trim();
    const email = req.body.email.trim().toLowerCase();

    if (!username || username.length < 3) {
        return res.status(400).json({
            message: 'Username must be at least 3 characters long'
        });
        // req.session.messages.push({
        //     type: "warning",
        //     text: "Please enter valid username!",
        // });
        // return res.redirect("/admin/user");
    }

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            message: 'Invalid email address'
        });
    }

    try {
        if (await UserService.findUserByUserName(username) || await UserService.findUserByEmail(email)) {
            return res.status(409).json({
                message: "Username or email you entered already exists!"
            });
            // req.session.messages.push({
            //     type: "warning",
            //     text: "User already exists!",
            // });
            // return res.redirect("/admin/user");
        }

        await UserService.createUser({ username, email });

        return res.status(201).json({
            message: "User created",
            username,
            email
        });
        // req.session.messages.push({
        //     type: "success",
        //     text: "User created"
        // });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while saving the User!"
        });
        // req.session.messages.push({
        //     type: "danger",
        //     text: "There was an error while saving the User!",
        // });
        // return res.redirect("/admin/user");
    }
};

const getUserByName = async (req, res) => {
    const username = req.params.username.trim();

    if (!username) {
        return res.status(400).json({
            message: "Please enter username!"
        });
    }

    try {
        const user = await UserService.findUserByUserName(username);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the User!"
        });
    }
};

const getUserByUserId = async (req, res) => {
    const userId = req.params.userId.trim();

    if (!userId) {
        return res.status(400).json({
            message: "Please enter userId!"
        });
    }

    try {
        const user = await UserService.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the User!"
        });
    }
};

const getUserByUserEmail = async (req, res) => {
    const email = req.params.email.trim();

    if (!email) {
        return res.status(400).json({
            message: "Please enter email!"
        });
    }

    try {
        const user = await UserService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the User!"
        });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.userId.trim();

    if (!await UserService.findUserById(userId)) {
        return res.status(404).json({
            message: "User not found!"
        });
    }

    if (!username && !email) {
        return res.status(400).json({
            message: "Please enter username or email to update!"
        });
    }

    const updateData = {};
    if (req.body.username) updateData.username = req.body.username.trim();
    if (req.body.email) updateData.email = req.body.email.trim();

    try {
        await UserService.updateUser(userId, updateData);
        return res.status(200).json({
            message: "User updated",
            updateData
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while updating the User!"
        });
    }
};

const deleteUser = async (req, res) => {
    const userName = req.params.username.trim();
    const email = req.query.email;

    if (!userName) {
        return res.status(400).json({
            message: "Please enter valid username!"
        });
    }

    const userByName = await UserService.findUserByUserName(userName)

    if (!userByName) {
        return res.status(404).json({
            message: "User not found by name!"
        });
    }

    const userByEmail = await UserService.findUserByEmail(email);

    if (!userByEmail) {
        return res.status(404).json({
            message: "User not found by email!"
        });
    }

    if (userByName == userByEmail) {
        try {
            await UserService.deleteUser(userName);

            if (!await UserService.findUserByUserName(userName)) {
                return res.status(200).json({
                    message: "User deleted!"
                });
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "There was an error while deleting the User!"
            });
        }
    }
    else {
        return res.status(400).json({
            message: "User name and email did not match!"
        });
    }
};

export default {
    createUser,
    getUserByName,
    getUserByUserId,
    getUserByUserEmail,
    updateUser,
    deleteUser
};
