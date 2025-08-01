const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong");
    } else if (!validator.isLength(firstName, { min: 2, max: 50 })) {
        throw new Error("First name must be between 2 and 50 characters");
    }
}

module.exports = {
    validateSignupData,
};