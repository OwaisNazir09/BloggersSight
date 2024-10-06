const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { createusertoken } = require('../services/authuntication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    publicProfileUrl: {
        type: String,
        default: "/app/images/default.png",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = process.env.SALT || randomBytes(16).toString('hex'); // Generate a random salt if not set
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    console.log("Hashed Password during signup:", hashedPassword);  // Log during signup
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static("mismatch", async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) return null;

        const salt = user.salt || process.env.SALT; // Get the user's salt if available
        const userHashedPassword = user.password;

        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

        console.log("Hashed Password during sign-in:", hashedPassword);  // Log during sign-in
        console.log("Stored Hashed Password:", userHashedPassword);

        if (hashedPassword === userHashedPassword) {
            const token = createusertoken(user);
            return token;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during password comparison:", error);
        throw error;
    }
});

const User = model('User', userSchema); 
module.exports = User; // Export just the User model
