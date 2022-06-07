import express from 'express'
import {bloggersRouter} from "./routes/bloggers-router";
import {runDb} from "./repositories/mongo-db";
import {postsRouter} from "./routes/posts-router";
import {authRouter} from "./routes/auth-router";
import {usersRouter} from "./routes/users-router";
import {settings} from "./settings";
import {commentsRouter} from "./routes/comments-router";

const cors = require('cors')

const PORT = settings.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.use('/ht_04/api/auth', authRouter)
app.use('/ht_04/api/bloggers', bloggersRouter)
app.use('/ht_04/api/posts', postsRouter)
app.use('/ht_04/api/users', usersRouter)
app.use('/ht_04/api/comments', commentsRouter)


const startApp = (async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`Express app listening on port ${PORT}`)
    })
})

startApp()
