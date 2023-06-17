let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let StudentSchema = Schema({
    id: Number,
    name: String,
    firstname: String,
    class: String,
    year: String,
    picture: String
});

StudentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut students) sera au pluriel, 
// soit students
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('students', StudentSchema);
