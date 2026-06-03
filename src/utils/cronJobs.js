const cron = require('node-cron');
const Grocery = require('../models/Grocery');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const sendWhatsApp = require('./sendWhatsApp');
const User = require('../models/User');

// Runs every day at 8am
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running daily stock and bill check...');

    // Check low or empty items
    const lowItems = await Grocery.find({
      status: { $in: ['low', 'empty'] }
    });

    for (const item of lowItems) {
      await Notification.create({
        householdId: item.householdId,
        message: `${item.name} is ${item.status}! Please restock.`,
        type: 'low-stock'
      });
    }

    // Check expiring items within 3 days
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const expiringItems = await Grocery.find({
      expiryDate: { $lte: threeDaysLater, $gte: new Date() }
    });

    for (const item of expiringItems) {
      await Notification.create({
        householdId: item.householdId,
        message: `${item.name} is expiring soon on ${new Date(item.expiryDate).toDateString()}!`,
        type: 'expiry'
      });

      // Send WhatsApp alert
      const members = await User.find({ householdId: item.householdId });
      for (const member of members) {
        if (member.phone) {
          await sendWhatsApp(
            member.phone,
            `⚠️ Smart Household Alert: ${item.name} is expiring on ${new Date(item.expiryDate).toDateString()}!`
          );
        }
      }
    }

    // Check bills due in 3 days
    const billsDueSoon = await Bill.find({
      dueDate: { $lte: threeDaysLater, $gte: new Date() },
      status: 'unpaid'
    });

    for (const bill of billsDueSoon) {
      await Notification.create({
        householdId: bill.householdId,
        message: `Bill reminder: ${bill.name} of ₹${bill.amount} is due on ${new Date(bill.dueDate).toDateString()}!`,
        type: 'budget'
      });

      // Send WhatsApp alert for bills
      const members = await User.find({ householdId: bill.householdId });
      for (const member of members) {
        if (member.phone) {
          await sendWhatsApp(
            member.phone,
            `💰 Bill Reminder: ${bill.name} of ₹${bill.amount} is due on ${new Date(bill.dueDate).toDateString()}!`
          );
        }
      }
    }

    // Mark overdue bills
    const overdueBills = await Bill.find({
      dueDate: { $lt: new Date() },
      status: 'unpaid'
    });

    for (const bill of overdueBills) {
      await Bill.findByIdAndUpdate(bill._id, { status: 'overdue' });

      await Notification.create({
        householdId: bill.householdId,
        message: `⚠️ Overdue bill: ${bill.name} of ₹${bill.amount} was due on ${new Date(bill.dueDate).toDateString()}!`,
        type: 'budget'
      });
    }

    console.log('Daily stock and bill check completed');
  } catch (err) {
    console.error('Cron job error:', err.message);
  }
});