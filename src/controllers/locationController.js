const User = require('../models/User');
const Grocery = require('../models/Grocery');
const Task = require('../models/Task');
const sendWhatsApp = require('../utils/sendWhatsApp');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
};

exports.saveLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      lastLocation: { latitude, longitude }
    });
    res.json({ message: 'Location saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNearbyStores = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Generate stores around user location
    const stores = [
      { name: 'Big Bazaar',       latitude: latitude + 0.0008, longitude: longitude + 0.0008, type: 'supermarket' },
      { name: 'Reliance Fresh',   latitude: latitude + 0.0005, longitude: longitude - 0.0005, type: 'grocery'     },
      { name: 'DMart',            latitude: latitude - 0.0007, longitude: longitude + 0.0007, type: 'supermarket' },
      { name: 'More Supermarket', latitude: latitude + 0.0003, longitude: longitude + 0.0003, type: 'grocery'     },
      { name: 'Spencer\'s',       latitude: latitude - 0.0004, longitude: longitude - 0.0004, type: 'supermarket' },
    ];

    // Calculate distance in meters for each store
    const nearbyStores = stores
      .map(store => ({
        ...store,
        distance: Math.round(calculateDistance(
          latitude, longitude,
          store.latitude, store.longitude
        ))
      }))
      .sort((a, b) => a.distance - b.distance);

    // Get stores within 100 meters
    const veryNearbyStores = nearbyStores.filter(s => s.distance <= 100);

    // Get low stock and empty items
    const shoppingList = await Grocery.find({
      householdId: req.user.householdId,
      status: { $in: ['low', 'empty'] }
    });

    // Get pending tasks assigned to this user
    const myTasks = await Task.find({
      householdId: req.user.householdId,
      assignedTo:  req.user._id,
      status:      'pending'
    }).populate('assignedBy', 'name phone');

    // If user is near a store and has tasks or shopping items
    if (veryNearbyStores.length > 0) {
      const nearestStore = veryNearbyStores[0];

      // Send WhatsApp to task assigners
      for (const task of myTasks) {
        if (task.assignedBy && task.assignedBy.phone) {
          await sendWhatsApp(
            task.assignedBy.phone,
            `📍 *Location Alert!*\n\n` +
            `👤 *${req.user.name}* is currently near *${nearestStore.name}*!\n` +
            `📏 Distance: ${nearestStore.distance} meters away\n\n` +
            `📋 They have a pending task:\n` +
            `✅ *${task.title}*\n\n` +
            `🛒 Reminder sent automatically by SmartHome! 🏠`
          );
        }
      }

      // Send WhatsApp to user about their shopping list
      if (shoppingList.length > 0 && req.user.phone) {
        await sendWhatsApp(
          req.user.phone,
          `🛒 *Shopping Reminder!*\n\n` +
          `📍 You are near *${nearestStore.name}* (${nearestStore.distance}m away)\n\n` +
          `📦 Items to buy:\n` +
          shoppingList.map(item => `• ${item.name} (${item.status})`).join('\n') +
          `\n\n🏠 SmartHome reminder`
        );
      }

      // Emit real time alert
      global.io.to(req.user.householdId.toString()).emit('nearby-store', {
        message: `📍 ${req.user.name} is near ${nearestStore.name}!`,
        store:   nearestStore,
        user:    req.user.name
      });
    }

    res.json({
      nearbyStores,
      veryNearbyStores,
      shoppingList,
      myTasks,
      userLocation: { latitude, longitude },
      message: veryNearbyStores.length > 0
        ? `You are ${veryNearbyStores[0].distance}m from ${veryNearbyStores[0].name}!`
        : `Nearest store is ${nearbyStores[0]?.distance}m away`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};