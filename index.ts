import express from 'express';
import crypto from 'crypto';
import { Pool } from 'pg';

const app = express(); 
const PORT = 3000;

// Postgres
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL
})

app.get('/all', async (req, res) => {
    const result = await pool.query('SELECT * FROM urls');
    res.json({
        'RESULT' : result.rows
    })
})

const urlDB: Record<string, string> = {};

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        "Status" : "OK"
    })
})

app.post('/url', async (req, res) => {

    const {url} = req.body;
    if (url) {
        const token = crypto.randomBytes(4).toString('hex');
        await pool.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [token, url]);
        res.json({ "Shortened URL" : `http://localhost:3000/${token}` });
    }   
    else{
        res.end("No url submitted, Try again!");
    } 
})

app.get("/:shortId", async (req, res)=>{
    const { shortId } = req.params;
    const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1',[shortId]);
    const redirect = result.rows[0].long_url;
    res.redirect(redirect);
})

pool.query('CREATE TABLE IF NOT EXISTS urls ( id SERIAL PRIMARY KEY, short_code TEXT UNIQUE, long_url TEXT )').then(() => console.log("Table created!"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
