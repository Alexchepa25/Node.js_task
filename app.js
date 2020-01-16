// Require packages and set the port
const express = require('express');
const bodyParser = require('body-parser');
//const routes = require(process.cwd() + '/src/routes/routes');
const csvtojson = require('csvtojson');
var busboy = require('connect-busboy');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "users.db"
});


let User = sequelize.define('user', {
    UserName: {
        type: Sequelize.STRING,
    },
    FirstName: {
        type: Sequelize.STRING,

    },
    LastName: {
        type: Sequelize.STRING
    },
    Age: {
        type: Sequelize.INTEGER
    }
});


// const Model = Sequelize.Model;
// class User extends Model { }
// User.init({
//     UserName: {
//         type: Sequelize.STRING,
//     },
//     FirstName: {
//         type: Sequelize.STRING,

//     },
//     LastName: {
//         type: Sequelize.STRING
//     },
//     Age: {
//         type: Sequelize.INTEGER
//     }
// }, {
//     sequelize,
//     modelName: 'user'
//     // options
// });

sequelize.sync();

const port = 3002;
const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(fileUpload());




// Use MySQL
// const connection = createConnection({
//     host: 'localhost',
//     user: 'dbuser',
//     password: 's3kreee7',
// });

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
//     if (err) throw err;
//     console.log('The solution is: ', rows[0].solution);
// });

// connection.end();


// Use Node.js body parsing middleware
// app.use(json());
// app.use(urlencoded({
//     extended: true,
// }));

//routes(app);
app.get("/users-file", (req, res) => {
    try {

        //get from db

        const file =
            "TheBlade;Boris;Yurinov;47\n" +
            "TheBlade1;Boris;Yurinov;47\n" +
            "TheBlade2;Boris;Yurinov;47\n" +
            "TheBlade3;Boris;Yurinov;47\n";


        if (file) {
            const fileName = 'users.csv';
            res.setHeader('Content-Type', fileName);
            res.setHeader('Content-Disposition', 'attachment;filename=' + fileName);
            res.setHeader('Content-Transfer-Encoding', 'binary');
            res.setHeader('X-Suggested-Filename', fileName);
            res.setHeader('Content-Length', file.length);
            res.end(Buffer.from(file, 'binary'));
        } else {
            res.end();
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get("/users", async (req, res) => {

    const users = await User.findAll();
    res.json(users);

});


app.post("/upload-users", async (req, res) => {

    let uploadedUsers = req.body;
    await sequelize.sync({force: true});
    uploadedUsers.forEach(async user => {
        await User.create(user);
    });

});


// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
