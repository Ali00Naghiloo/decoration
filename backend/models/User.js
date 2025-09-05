const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'نام کاربری الزامی است'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'رمز عبور الزامی است'],
    select: false, //  برای اینکه در کوئری‌ها به طور پیش‌فرض برگردانده نشود
  },
});

// Middleware برای هش کردن پسورد قبل از ذخیره
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// متد برای مقایسه پسورد وارد شده با پسورد هش شده در دیتابیس
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);