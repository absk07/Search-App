const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { 
        type: String
    },
    url: {
        type: String
    }
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;