import * as mongoose from "mongoose";
import {bloggersSchema} from "./schemas/bloggers-schema";
import {postsSchema} from "./schemas/posts-schema";
import {commentsSchema} from "./schemas/comments-schema";
import {blockedConnectionsSchema, connectionsLimitsSchema} from "./schemas/connections-limits-schema";
import {emailSchema} from "./schemas/emails-schema";
import {jwtSchema} from "./schemas/jwt-schema";
import {BloggerType} from "../../types/bloggers";
import {usersSchema} from "./schemas/users-schema";


export const BloggersModel = mongoose.model<BloggerType>('mongoose-bloggers', bloggersSchema);
export const PostsModel = mongoose.model('mongoose-posts', postsSchema)
export const CommentsModel = mongoose.model('mongoose-comments', commentsSchema)
export const UsersModel = mongoose.model('mongoose-users', usersSchema)
export const JwtModel = mongoose.model('mongoose-jwt', jwtSchema)
export const ConnectionsLimitModel = mongoose.model('mongoose-connections-limit', connectionsLimitsSchema)
export const BlockedConnectionsModel = mongoose.model('mongoose-blocked-connections', blockedConnectionsSchema)
export const EmailsModel = mongoose.model('mongoose-emails', emailSchema)