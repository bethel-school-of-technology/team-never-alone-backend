import { RequestHandler } from "express";
import { User, IUser } from "../models/user";
import { comparePasswords, hashPassword, signUserToken, verifyUser } from "../services/auth";

export const createUser: RequestHandler = async (req, res, next) => {
    const newUser: IUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        posts: [] // Initialize posts array for the new user
    });
    try {
        if (newUser.username && newUser.password) {
            let hashedPassword = await hashPassword(newUser.password);
            newUser.password = hashedPassword;
            let created = await newUser.save();
            res.status(201).json({
                username: created.username,
                userId: created._id,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                country: req.body.country,
            });
        }
        else {
            res.status(400).send('Username and password required');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}

export const loginUser: RequestHandler = async (req, res, next) => {
    let existingUser: IUser | null = await User.findOne(
        { username: req.body.username }
    );

    if (existingUser) {
        let passwordsMatch = await comparePasswords(req.body.password, existingUser.password);
        
        if (passwordsMatch) {
            let token = await signUserToken(existingUser);
            res.status(200).json({ token, user: existingUser });
        }
        else {
            res.status(401).json('Invalid password');
        }
    }
    else {
        res.status(401).json('Invalid username');
    }
}

export const editUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.id; 

    try {
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {

            return res.status(404).json({ message: 'User not found' });
        }

        userToUpdate.username = req.body.username || userToUpdate.username;
        userToUpdate.password = req.body.password || userToUpdate.password;
        userToUpdate.email = req.body.email || userToUpdate.email;
        userToUpdate.firstName = req.body.firstName || userToUpdate.firstName;
        userToUpdate.lastName = req.body.lastName || userToUpdate.lastName;
        userToUpdate.country = req.body.country || userToUpdate.country;

        const updatedUser = await userToUpdate.save();


        res.status(200).json({
            username: updatedUser.username,
            userId: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            country: updatedUser.country,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserById: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log('User ID:', userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

