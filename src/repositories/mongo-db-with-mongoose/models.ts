import * as mongoose from "mongoose";
import {bloggersSchema} from "./schemas/bloggers-schema";
import {postsSchema} from "./schemas/posts-schema";
import {commentsSchema} from "./schemas/comments-schema";
import {connectionsLimitsSchema} from "./schemas/connections-limits-schema";
import {emailSchema} from "./schemas/emails-schema";
import {jwtSchema} from "./schemas/jwt-schema";
import {BloggerType} from "../../types/bloggers";


export const BloggersModel = mongoose.model<BloggerType>('mongoose-bloggers', bloggersSchema);

const PostsModel = mongoose.model('mongoose-posts', postsSchema)
// const CommentsModel = mongoose.model('mongoose-comments', commentsSchema)
//
//
//
//
// const JwtModel = mongoose.model('mongoose-jwt', jwtSchema)
//
//
//
// const ConnectionsLimitModel = mongoose.model('mongoose-connections-limit', connectionsLimitsSchema)
//
//
//
// const EmailModel = mongoose.model('mongoose-emails', emailSchema)