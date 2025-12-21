const mongoose = require("mongoose");
const { TICKET_STATUS } = require("../constants/userConstants");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 4,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: TICKET_STATUS.OPEN,
    },
    reporter: {
      type: String,
      required: true,
    },
    assignee: {
      type: String,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
