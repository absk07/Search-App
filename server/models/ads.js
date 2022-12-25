const mongoose = require('mongoose');

const AdsSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Company'
    },
    primaryText: {
        type: String
    },
    headline: {
        type: String
    },
    description: {
        type: String
    },
    CTA: {
        type: String
    },
    imageUrl: {
        type: String
    }
});

const Ads = mongoose.model('Ads', AdsSchema);

module.exports = Ads;