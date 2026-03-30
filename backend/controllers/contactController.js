const ContactInfo = require('../models/ContactInfo');

const getContact = async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) contact = await ContactInfo.create({ phone: '', email: '', address: '', whatsapp: '' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { phone, email, address, whatsapp } = req.body;
    let contact = await ContactInfo.findOne();
    if (!contact) contact = new ContactInfo();
    if (phone    !== undefined) contact.phone    = phone;
    if (email    !== undefined) contact.email    = email;
    if (address  !== undefined) contact.address  = address;
    if (whatsapp !== undefined) contact.whatsapp = whatsapp;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getContact, updateContact };
