const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const path = require('path');

const app = express();
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDir = path.join(__dirname, './public');

db.connect((error) => {
    if (error) {
        console.log('Error connecting to MySQL:', error);
    } else {
        console.log('MySQL connected!');
        // Perform a simple query to check the connection
        db.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
            if (err) {
                console.log('Error executing query:', err);
            } else {
                console.log('Query result:', results[0].solution); // Should print 2
            }
        });
    }
});

app.set('view engine', 'hbs');
app.use(express.static(publicDir));
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});