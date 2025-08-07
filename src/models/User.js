const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate: (value) => {
        if (validator.isEmpty(value)) {
          throw new Error("Email cannot be empty");
        }
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid: " + value);
        }
        if (!validator.isLength(value, { min: 5, max: 100 })) {
          throw new Error("Email length must be between 5 and 100 characters");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.un.org/pga/wp-content/uploads/sites/53/2018/09/Dummy-image-1.jpg",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "No description provided",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Use normal function while making up these things, dont use arrow functions
userSchema.methods.getJWTToken = async function () {
    const user = this; // this refers to the instance of the User model (the new users are instances of user model)


    const token = await jwt.sign({ _id: user._id }, "PairPro@800855$", {
        expiresIn: "1d",
    });
    
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password; // const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);