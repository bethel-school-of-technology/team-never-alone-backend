import { RequestHandler } from "express";
import { Post, IPost } from "../models/post";
import { IUser, User } from "../models/user";
import { verifyUser } from "../services/auth";

export const getAllPost: RequestHandler = async (req, res, next) => {
    let postList = await Post.find().populate('user');    
    res.status(200).json(postList);
}

export const getOnePost: RequestHandler = async (req, res, next) => {
    let itemId = req.params.id;
    let post = await Post.findById(itemId);
    res.status(200).json(post);
}

export const getPostByUserId: RequestHandler = async (req, res, next) => {
    let postId = req.params.id;
    let post = await Post.find({ user: postId });

    res.status(200).json(post);
}


export const addPost: RequestHandler = async (req, res, next) => {
    let user: IUser | null = await verifyUser(req);

    if (!user) {
        return res.status(403).send();
    }

    const newPost: IPost = new Post({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        username: user.username, 
        user: user._id 
    });

    try {
        const savedPost = await newPost.save();

        await User.findByIdAndUpdate(user._id, { $push: { posts: savedPost._id } }, { new: true });

        res.status(201).json(savedPost);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
};

export const editPost: RequestHandler = async (req, res, next) => {
    let user: IUser | null = await verifyUser(req);

    if (!user) {
        return res.status(403).send();
    }

    let itemId = req.params.id;
    const updatedPost: IPost = new Post({
        _id: itemId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    await Post.findByIdAndUpdate(itemId, { $set: updatedPost })

    res.status(200).json(updatedPost);
}

export const deletePost: RequestHandler = async (req, res, next) => {
    let user: IUser | null = await verifyUser(req);

    if (!user) {
        return res.status(403).send();
    }

    let itemId = req.params.id;
    let result = await Post.findByIdAndDelete(itemId);
    res.status(200).json(result);
}