//? Core Module
const fs = require("fs");

//? Membuat Folder Data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
//? Membuat File Contacts.json
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContacts = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

//? mencari params nama dari url
const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

//? menimpa file contacts.json dengan data baru

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
};

//? menambahkan data contact baru

const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

//? cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nama === nama);
};

//? delete contact
const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

  saveContacts(filteredContacts);
};
//? mengubah contacts
const updateContacts = (newContact) => {
  const contacts = loadContacts();
  //? hilangkan contact lama yang sama dengan oldNama
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== newContact.oldNama
  );
  delete newContact.oldNama;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
};
