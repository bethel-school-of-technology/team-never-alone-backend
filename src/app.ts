import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';

const connectionString: string = 'mongodb://localhost:27017/postDB';

mongoose.connect(connectionString).then(
    () => console.log('database connection successful!'), 
    err => console.log('Error connecting to the database', err));

const app = express();
const cors = require('cors');
const corsOptions = {
    origin: [ 'http://localhost:3001' ]
};


app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
// routes
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).end();
});

app.listen(3000);
console.log('Backend is listening on port 3000');