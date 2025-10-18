require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function hashAndUpdate(username, plainPassword) {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const User = mongoose.model(
    "Users",
    new mongoose.Schema({
      username: String,
      password: String,
    })
  );
  const user = await User.findOne({ username });
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }
  const hashed = await bcrypt.hash(plainPassword, 12);
  user.password = hashed;
  await user.save();
  console.log("Password updated and hashed for user:", username);
  process.exit(0);
}

// Usage: node hash-password.js admin 12345678
const [, , username, password] = process.argv;
if (!username || !password) {
  console.log("Usage: node hash-password.js <username> <newPassword>");
  process.exit(1);
}
hashAndUpdate(username, password);
