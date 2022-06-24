import {settings} from "./settings";
import express from 'express'
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {authRouter} from "./routes/auth-router";
import {usersRouter} from "./routes/users-router";
import {commentsRouter} from "./routes/comments-router";
import {testingRouter} from "./routes/testing-router";
import {scheduler} from "./application/scheduler";
import {runDb} from "./repositories/mongo-db-with-mongoose/mongoose-mongo-db";
import cookieParser from 'cookie-parser'


const PORT = settings.PORT

const app = express()
app.set('trust proxy', true);
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/ht_04/api/auth', authRouter)
app.use('/ht_04/api/bloggers', bloggersRouter)
app.use('/ht_04/api/posts', postsRouter)
app.use('/ht_04/api/users', usersRouter)
app.use('/ht_04/api/comments', commentsRouter)
app.use('/ht_04/api/testing', testingRouter)


const startApp = (async () => {
    await runDb()
    app.listen(PORT, async () => {
        console.log(`Express app listening on port ${PORT}`)
        await scheduler()
    })

})

startApp()
