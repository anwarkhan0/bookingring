const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ToursSchema = new Schema({
    tourType: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    fromPlace: {
        type: String,
        required: true
    },
    toPlace: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    stayHotel: {
        type: String,
        required: true
    },
    days: {
        type: String,
        required: true
    },
    nights: {
        type: String,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    chargesPerHead: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    gallery: {
        type: [String],
        required: false
    },
    reservations: [{
        user: Object,
        seats: Number,
        charges: Number,
        date: Date
      }]
});

module.exports = mongoose.model('Tours', ToursSchema);
