const { Contact } = require("../models/contacts.model");
const { createNotFoundError } = require("../helpers");

const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find();
  res.status(200).json({ data: allContacts });
};

const getOneContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (contact) {
    return res.status(200).json({ data: contact });
  }
  return next(createNotFoundError());
};

const addNewContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({ data: newContact });
};

const deleteContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contactToDelete = await Contact.findByIdAndDelete(contactId);
  if (contactToDelete) {
    return res.status(200).json({ message: "Contact deleted" });
  }
  return next(createNotFoundError());
};

const updateSomeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const contactToUpdate = await Contact.findByIdAndUpdate(contactId, body, {new: true});
  if (contactToUpdate) {
    return res.status(200).json({ data: contactToUpdate });
  }
  return next(createNotFoundError());
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const contactToUpdate = await Contact.findByIdAndUpdate(contactId, { favorite }, {new: true});
  if (!favorite && favorite !== false) {
    res.status(400).json({ message: "missing field favorite" });
  }
  if (contactToUpdate) {
    return res.status(200).json({ data: contactToUpdate });
  }
  return next(createNotFoundError());
};

module.exports = {
  getAllContacts,
  getOneContactById,
  addNewContact,
  deleteContactById,
  updateSomeContact,
  updateStatusContact,
};
