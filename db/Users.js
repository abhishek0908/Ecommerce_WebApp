const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema=AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    fullname: String,
    address: {
        type: [{
            street: String,
            city: String,
            state: String,
            postalCode: Number,
            country: String
        }],
        validate: {
            validator: function(value) {
                return value.length <= 3;
            },
            message: 'Only a maximum of 3 addresses can be stored.'
        }
    }
});

const applyPreSaveHook = (schema) => {
    schema.pre('save', function(next) {
        const user = this; 

        if (!user.isModified('password')) {
            return next();
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    });
};

applyPreSaveHook(AdminSchema);
applyPreSaveHook(UserSchema);


const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    User,
    Admin
};
