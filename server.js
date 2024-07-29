import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';


dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({extended: true})); // To parse form data in req.dody , extended:true allows to parse the nested data else it will cause error
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.listen(5000 , ()=> console.log(`listening on port ${PORT}`));

