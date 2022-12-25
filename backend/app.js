const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Ads = require('./models/ads');
const Company = require('./models/company');

const URI = 'mongodb://127.0.0.1:27017/searchApi';

mongoose.connect(URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*"
}));

app.get('/', async (req, res) => {
    try {
        const result = await Ads.aggregate([
            {
                "$lookup": {
                    "from": "company",
                    "localField": "companyId",
                    "foreignField": "_id",
                    "as": "companyDetails"
                }
            },
            {
                "$unwind": "$companyDetails"
            }
        ]);
        // console.log(result);
        res.json({ success: true, data: result });
    } catch(e) {
        // console.log(e);
        res.json({ success: false, message: e });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const result = await Ads.aggregate([
            {
                "$lookup": {
                    "from": "company",
                    "localField": "companyId",
                    "foreignField": "_id",
                    "as": "companyDetails"
                }
            },
            {
                "$match": {
                    "$or": [
                        { "primaryText": { "$regex": q, "$options": 'i' } },
                        { "headline": { "$regex": q, "$options": 'i' } },
                        { "description": { "$regex": q, "$options": 'i' } },
                        { "companyDetails.name": { "$regex": q, "$options": 'i' } }
                    ]
                }
            },
            {
                "$unwind": "$companyDetails"
            }
        ]);
        // console.log(result);
        res.json({ success: true, data: result });
    } catch(e) {
        // console.log(e);
        res.json({ success: false, message: e });
    }
});

const PORT = 3000;

app.listen(PORT, ()=> {
    console.log("serving on port 3000");
});