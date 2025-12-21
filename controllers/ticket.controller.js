const { USER_ROLE, USER_STATUS } = require('../constants/userConstants');
const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');

const createTicket = async (req, res) => {
  const ticketObj = {
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description,
    status: req.body.status,
    reporter: req.userId,
  };

  if (!ticketObj.title || !ticketObj.description) {
    return res.status(400).json({ message: 'title or description missing' });
  }

  const enginer = await User.findOne({
    userType: USER_ROLE.ENGINEER,
    userStatus: USER_STATUS.APPROVED,
  });

  if (!enginer) {
    return res.status(200).json({
      message:
        'currently no engineer is available, please try after some time.',
    });
  }

  ticketObj.assignee = enginer.userId;

  const ticket = await Ticket.create(ticketObj);
  if (!ticket) {
    return res.status(500).json({
      message: 'failed to create ticket try again later...',
    });
  }

  res.status(201).json({
    message: 'ticket created successfully!',
    data: ticket,
  });
};

module.exports = {
  createTicket,
};
