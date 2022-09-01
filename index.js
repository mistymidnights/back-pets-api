const express = require("express");
const cors = require('cors');

const PetRoutes = require("./api/pets/pet.routes");

const dotenv = require("dotenv");
const { connectDb } = require('./helpers/database/db');

dotenv.config()

const PORT = process.env.PORT || 8000
const { setUpCloudinary } = require('./helpers/utils/cloudinary');
connectDb();
setUpCloudinary();
const app = express();

app.use(cors({ origin: (_origin, callback) => callback(null, true), credentials: true }));

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.use("/api/pets", PetRoutes);

app.use((error, _req, res, _next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

app.use('*', (_req, _res, next) => {
    const error = new Error()
    error.status = 404
    error.message = 'Route not found'
    return next(error)
});

app.listen(PORT, () => {
    console.log('Server is running in http://localhost:' + PORT)
})