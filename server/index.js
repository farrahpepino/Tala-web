require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');

const cors = require('cors');

const connection = require('./db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendsRoutes = require('./routes/FriendsRoutes')
const chatRoutes = require('./routes/ChatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();


connection();

app.use(express.json());

app.use(fileUpload());

app.use(cors());

 app.use(cors({
   origin: '*',
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
   allowedHeaders: ['Content-Type', 'Authorization']
  }));

 const port = process.env.PORT || 5005;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  console.log("GET request received at /");
  response.json({
      message: "Server is running on port " + port
  });
});


// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
