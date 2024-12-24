require('dotenv').config();

const express = require('express');

const cors = require('cors');

const connection = require('./db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();


connection();

app.use(express.json());



app.use(cors());


 const allowedOrigins = [ 'http://localhost:5173'];

 app.use(cors({
   origin: allowedOrigins,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true, 
 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5003;
app.listen(port, () => console.log(`Server running on port ${port}`));
