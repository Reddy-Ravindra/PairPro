const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://ravindrareddy:lNFELJafrqdXuVs1@nodelearning.dj4zznc.mongodb.net/PairPro"
    );
};

module.exports = connectDB;

