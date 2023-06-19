let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');


let MatiereSchema = Schema({
    id:Number,
    name : String,
    matierePicture:String,
    profPicture:String
});

MatiereSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('matiere',MatiereSchema);