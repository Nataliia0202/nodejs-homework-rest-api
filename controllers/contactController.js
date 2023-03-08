const { Contact } = require("../models/contacts.model");
const { createNotFoundError } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: userId } = req.user;
  const allContacts = await Contact.find({ owner: userId });
  res.status(200).json({ data: allContacts });
};

const getOneContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await Contact.findById({ _id: contactId, owner: userId });
  if (contact) {
    return res.status(200).json({ data: contact });
  }
  return next(createNotFoundError());
};

const addNewContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { _id: userId } = req.user;
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner: userId,
  });
  res.status(201).json({ data: newContact });
};

const deleteContactById = async (req, res, next) => {
  const { contactId } = req.params;
   const { _id: userId } = req.user;
   const contactToDelete = await Contact.findByIdAndDelete({
     _id: contactId,
     owner: userId,
   });
  if (contactToDelete) {
    return res.status(200).json({ message: "Contact deleted" });
  }
  return next(createNotFoundError());
};

const updateSomeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const { _id: userId } = req.user;
  const contactToUpdate = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { $set: { name, email, phone } }
  );
  if (contactToUpdate) {
    return res.status(200).json({ data: contactToUpdate });
  }
  return next(createNotFoundError());
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id: userId } = req.user;
  const contactToUpdate = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    { new: true }
  );
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
