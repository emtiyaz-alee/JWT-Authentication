import express from 'express'
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser'
import 'dotenv/config';
const __dirname = path.resolve();





import apiv1Router from './apiv1/index.mjs';



const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", apiv1Router)








app.use("/static", express.static(path.join(__dirname, 'static')))

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}`)
})
