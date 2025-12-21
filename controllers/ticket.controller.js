const { USER_ROLE, USER_STATUS, TICKET_STATUS } = require('../constants/userConstants');
const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const { isValidEnumValue } = require('../utils/user.util');

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
      message: 'currently no engineer is available, please try after some time.',
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

const updateTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  if (!ticketId) {
    return res.status(400).json({ message: 'ticket id required!' });
  }

  // fetch ticket from DB
  const ticket = await Ticket.findOne({ _id: ticketId });
  if (!ticket) {
    return res.status(404).json({ message: 'ticket with this id not found' });
  }

  // authorization
  const isOwner = req.userId === ticket.reporter;
  const isAdmin = req.userRole === USER_ROLE.ADMIN;
  const isEngineer = req.userRole === USER_ROLE.ENGINEER;

  // user is not authorized to update ticket
  if (!isOwner && !isAdmin && !isEngineer) {
    return res.status(403).json({
      message: 'you are not authorize to perform this action',
    });
  }

  // update ticket body
  const { title, description, priority, status, assignee } = req.body;
  ticket.title = title ? title : ticket.title;
  ticket.description = description ? description : ticket.description;
  ticket.priority = Number(priority) ? priority : ticket.description;

  // if user is not admin || engineer but, still tries to update status || assignee revoke it
  if (!isAdmin && !isEngineer && (status || assignee)) {
    return res.status(403).json({
      message: 'you are not allowed to edit status || assignee',
    });
  }

  // allow engineers to change status only and admin can change assignee
  ticket.status = status && isValidEnumValue(status, TICKET_STATUS) ? status : ticket.status;
  ticket.assignee = isAdmin && assignee ? assignee : ticket.assignee;

  const updatedTicket = await ticket.save();

  res.status(200).json({ message: 'ticket update success', ticket: updatedTicket });
};

module.exports = {
  createTicket,
  updateTicket,
};
