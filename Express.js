const app = express();
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});