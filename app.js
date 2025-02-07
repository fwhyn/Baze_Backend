const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
dotenv.config({ path: './.env' });

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

const publicDir = path.join(__dirname, './public');

pool.connect((error) => {
    if (error) {
        console.log('Error connecting to PostgreSQL:', error);
    } else {
        console.log('PostgreSQL connected!');
        // Perform a simple query to check the connection
        pool.query('SELECT 1 + 1 AS solution', (err, results) => {
            if (err) {
                console.log('Error executing query:', err);
            } else {
                console.log('Query result:', results.rows[0].solution); // Should print 2
            }
        });
    }
});

app.set('view engine', 'hbs');
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/auth/register', async (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    pool.query('SELECT email FROM users WHERE email = $1', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.rows.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            });
        } else if (password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                return res.render('register', {
                    message: 'User registered!'
                });
            }
        });
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});