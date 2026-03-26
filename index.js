require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/dataBase'); 

const app = express();

connectDB(); 
app.use(express.json());


app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/event',require('./src/routes/eventRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto:  ${PORT}`));