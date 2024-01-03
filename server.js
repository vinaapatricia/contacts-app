const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const expressLayouts = require("express-ejs-layouts");
const {
  loadContacts,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const app = express();
const port = 3000;

//ejs
app.set("view engine", "ejs");
//third party middleware
app.use(expressLayouts);

//built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //! agar post tidak undefined

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//? homepage
app.get("/", (req, res) => {
  res.render("homepage", {
    title: "homepage",
    layout: "layouts/main",
  });
});

//? contact page
app.get("/contact", (req, res) => {
  const contacts = loadContacts(); // Memuat data kontak
  res.render("contact", {
    title: "Data Contact",
    layout: "layouts/main",
    contacts,
    msg: req.flash("msg"),
  });
});

//? form tambah data
app.get("/contact/add", (req, res) => {
  contact = findContact(req.params.nama);
  res.render("add-contact", {
    title: "Form Add Contact",
    layout: "layouts/main",
    contact,
  });
});

//? post data
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah ada!");
      }
      return true;
    }),
    body("email").isEmail().withMessage("Email tidak valid!"),
    body("noHp")
      .isMobilePhone("id-ID")
      .withMessage("No HP tidak valid! Harus nomor HP Indonesia."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Form Add Data Contact",
        layout: "layouts/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      addContact(req.body);
      req.flash("msg", "Data Contact berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

//? delete kontak menggunakan GET
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  //! jika kontak tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data Contact berhasil dihapus!");
    res.redirect("/contact");
  }
});

//? form ubah data
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "Form Add Contact",
    layout: "layouts/main",
    contact,
  });
});

//? proses ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah ada!");
      }
      return true;
    }),
    body("email").isEmail().withMessage("Email tidak valid!"),
    body("noHp")
      .isMobilePhone("id-ID")
      .withMessage("No HP tidak valid! Harus nomor HP Indonesia."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Change Data Contact",
        layout: "layouts/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash("msg", "Data Contact berhasil diupdate!");
      res.redirect("/contact");
    }
  }
);

//? detail contact
app.get("/contact/:nama", (req, res) => {
  contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Detail Contact",
    layout: "layouts/main",
    contact,
  });
});

//? handle error
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

//? running code
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
