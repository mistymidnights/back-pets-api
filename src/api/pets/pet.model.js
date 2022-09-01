const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const {validationPassword} = require("../../helpers/utils/util");
const {setError} = require("../../helpers/utils/error");

const schema = new Schema({
    petName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, unique: false},
    type: { type: String, required: true },
    pictures: [{ type: String, unique: true }],
}, 
    {
        timestamps: true
    }
)



schema.pre('save', function(next) {
    if(!validationPassword(this.password)) return next(setError('404', "Invalid password"));
    this.password = bcrypt.hashSync(this.password, 16);
    next();
});

module.exports = mongoose.model('pets', schema)