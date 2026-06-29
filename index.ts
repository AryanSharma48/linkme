import express from 'express';

import {createTable } from './model/db'
import urlRoutes from './routes/urlRoutes'; 

const app = express(); 
app.use(express.json());
app.use('/', urlRoutes);

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        "Status" : "OK"
    })
})

createTable();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
