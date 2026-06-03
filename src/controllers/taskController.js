const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendWhatsApp = require('../utils/sendWhatsApp');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ householdId: req.user.householdId })
      .populate('assignedTo', 'name phone')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      householdId: req.user.householdId,
      assignedBy:  req.user._id
    });

    // Get assigned user details
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);

      if (assignedUser) {
        // Create in-app notification
        await Notification.create({
          householdId: req.user.householdId,
          userId:      assignedUser._id,
          message:     `${req.user.name} assigned you a task: ${task.title}`,
          type:        'task'
        });

        // Send WhatsApp notification to assigned person
        if (assignedUser.phone) {
          const deadlineText = task.deadline
            ? `\n📅 Deadline: ${new Date(task.deadline).toLocaleDateString('en-IN')}`
            : '';

          const priorityEmoji =
            task.priority === 'high'   ? '🔴' :
            task.priority === 'medium' ? '🟡' : '🟢';

          await sendWhatsApp(
            assignedUser.phone,
            `🏠 *SmartHome Task Alert!*\n\n` +
            `👤 Assigned by: *${req.user.name}*\n` +
            `📋 Task: *${task.title}*\n` +
            `${priorityEmoji} Priority: *${task.priority}*` +
            `${deadlineText}\n\n` +
            `Please complete this task on time! ✅`
          );
        }

        // Send WhatsApp to task assigner confirming assignment
        if (req.user.phone) {
          await sendWhatsApp(
            req.user.phone,
            `✅ *Task Assigned Successfully!*\n\n` +
            `📋 Task: *${task.title}*\n` +
            `👤 Assigned to: *${assignedUser.name}*\n` +
            `📱 Notification sent to ${assignedUser.name}'s WhatsApp`
          );
        }
      }
    }

    // Emit real time event
    global.io.to(req.user.householdId.toString()).emit('task-added', {
      message: `${req.user.name} assigned a task: ${task.title}`,
      task
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'name phone')
     .populate('assignedBy', 'name phone');

    if (!task)
      return res.status(404).json({ message: 'Task not found' });

    // Send WhatsApp when task is completed
    if (req.body.status === 'completed') {

      // Notify the person who assigned the task
      if (task.assignedBy && task.assignedBy.phone) {
        await sendWhatsApp(
          task.assignedBy.phone,
          `✅ *Task Completed!*\n\n` +
          `📋 Task: *${task.title}*\n` +
          `👤 Completed by: *${req.user.name}*\n` +
          `🎉 Great work!`
        );
      }

      // Create notification
      await Notification.create({
        householdId: req.user.householdId,
        userId:      task.assignedBy?._id,
        message:     `${req.user.name} completed task: ${task.title}`,
        type:        'task'
      });
    }

    global.io.to(req.user.householdId.toString()).emit('task-updated', {
      message: `${req.user.name} updated task: ${task.title}`,
      task
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};