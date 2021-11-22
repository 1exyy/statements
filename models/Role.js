const {Schema, model} = require('mongoose');

const schema = new Schema({
   value: {type: String, required: true, unique: true, default: 'USER'}
});

module.exports = model('Role', schema);
