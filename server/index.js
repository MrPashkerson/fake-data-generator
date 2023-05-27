require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./router/index');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({origin: process.env.CLIENT_URL}));
app.use('/api', router);

app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));

module.exports = app;