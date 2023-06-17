let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

let UserSchema = Schema({
    id:Number,
    userName:String,
    password:String
});

UserSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('users',UserSchema);