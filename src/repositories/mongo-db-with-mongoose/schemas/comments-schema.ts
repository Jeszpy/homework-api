import * as mongoose from "mongoose";
import {CommentsType} from "../../../types/comments";


export const commentsSchema = new mongoose.Schema<CommentsType>({
    id: {String},
    postId: {String},
    content: {String},
    userId: {String},
    userLogin: {String},
    addedAt: {Date}
})