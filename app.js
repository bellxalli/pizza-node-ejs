//Import Libraries
import express from 'express';
import mariadb from 'mariadb';
import {validateForm} from './services/validation.js';
import dotenv from 'dotenv';

dotenv.config();

//Define our database credentials
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
});

//Define function to connect to the DB
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!')
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database ${err}`)
    }
}

//Instantiate an Express application
const app = express();

//Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//Set the view engine for our application
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static('public'));

//Define a port number for our server to listen on
const PORT = process.env.APP_PORT || 3000;

//Define a "default" route for our home page
app.get('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

//Define an admin route
app.get('/admin', async (req, res) => {

    //Connect to the database
    const conn = await connect();

    //Query the database
    const orders = await conn.query('SELECT * FROM orders')

    console.log(orders);

    res.render('order-summary', { orders });
});

//Define a "thank you" route
app.post('/thankyou', async (req, res) => {

    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    const result = validateForm(order);
    if(!result.isValid)
    {
        console.log(result);
        res.send(result.errors);
        return;
    }

    if(order.toppings)
    {
        if(Array.isArray(order.toppings)){
            order.toppings = order.toppings.join(", ");
        }
    }
    else
    {
        order.toppings = "";
    }

    //Connect to the database
    const conn = await connect();

    // Add the order to our database
    const insertQuery = await conn.query(`insert into orders 
        (firstName, lastName, email, size, method, toppings)
        values (?, ?, ?, ?, ?, ?)`,
        [order.fname, order.lname, order.email, order.size, 
        order.method, order.toppings]);

    // INSERT INTO tbl (field1, field2) VALUES (?, ?)
    
    // Send our thank you page
    res.render('thankyou', { order });
});


//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
