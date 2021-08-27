const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbService = require('./dbServices');
//READ
app.get('/getAll', (request, response) => {

    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})


app.listen(process.env.PORT, () => console.log('app is running'));