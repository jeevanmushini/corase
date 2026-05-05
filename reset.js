require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

const CouponSchema = new mongoose.Schema({}, { strict: false });
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function reset() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("Connected to MongoDB.");

    // Delete all orders
    const deleteOrders = await Order.deleteMany({});
    console.log(`Deleted ${deleteOrders.deletedCount} orders.`);

    // Delete all coupons
    const deleteCoupons = await Coupon.deleteMany({});
    console.log(`Deleted ${deleteCoupons.deletedCount} coupons.`);

    // Delete non-admin users
    const deleteUsers = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${deleteUsers.deletedCount} regular users (admins preserved).`);

    console.log("Data reset complete. You may run `node seed.js` to repopulate mock products if desired.");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting data:", error);
    process.exit(1);
  }
}

reset();
