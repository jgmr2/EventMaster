const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/auth', require('./src/routes/authRoutes'));
app.listen(PORT, () =>{});