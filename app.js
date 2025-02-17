// require('global-agent/bootstrap');

// process.env.GLOBAL_AGENT_HTTP_PROXY = process.env.HTTP_PROXY;
// process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env.HTTPS_PROXY;

const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
dotenv.config({ path: './.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000 // 30 seconds
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
    res.render('index', { user: req.user });
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

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, result) => {
        if (error) {
            console.log(error);
            return res.render('login', {
                message: 'An error occurred. Please try again.'
            });
        }

        if (result.rows.length === 0) {
            return res.render('login', {
                message: 'Email or password is incorrect.'
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                message: 'Email or password is incorrect.'
            });
        }

        // Successful login
        res.render('index', {
            message: 'Login successful!',
            user: user
        });
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});