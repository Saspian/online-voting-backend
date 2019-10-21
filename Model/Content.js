const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    pName: {
        type:String,
        required:true,
        unique: true,
        min: 6,
        max: 255
    },
    pDesc: {
        type:String,
        unique: true,
        required: true,
        min: 200
    },
    vDemo: {
        type:String,
        unique: true,
        required:true,
        min: 6,
        max: 255
    },
    cName: {
        type: String,
        unique: true,
        required: true,
        min: 5,
        max: 255
    },
    submittedBy: {
        type: String,
        unique: true,
        required: true,
        min: 5,
        max: 255
    },
    pemail: {
        type:String,
        unique: true,
        required:true,
        min: 6,
        max: 255
    },
    vCounter: {
        type: Array,
        default: [],
        required: false
    }
});

module.exports = mongoose.model('Content',contentSchema);
