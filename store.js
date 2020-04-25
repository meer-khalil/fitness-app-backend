var mongoose = require('mongoose');

var storeSchema = new mongoose.Schema({
    username: { type: String },
    update_id: { type: String },
    ts: { type: String },
    stepCount: { type: String }
})

module.exports = mongoose.model('store', storeSchema);