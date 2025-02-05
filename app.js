const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcryptjs');

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post('/register', async (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            });
        } else if (password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, result) => {
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