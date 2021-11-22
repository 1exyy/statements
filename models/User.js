const {Schema, model} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    fullname: {type: String, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
});

module.exports = model('User', schema);
