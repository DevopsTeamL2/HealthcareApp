import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  role: { type: String, default: 'doctor' }, 
  resetToken: String,
  resetTokenExpiration: Date
});

const User = mongoose.model('User', userSchema);

export default User;
