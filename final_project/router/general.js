const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // check if user already exits
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .send({ message: "Username or password is missing." });
  }

  if (users.some((user) => user.userName === userName)) {
    return res.status(400).send({ message: "User already exits." });
  }

  users.push({ userName, password });

  return res.status(300).json({ message: "User registered!" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const booksPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 500);
  });
  const booksToSend = await booksPromise;
  return res.status(300).json(booksToSend);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    setTimeout(() => {
      if (book) {
        resolve(book);
      } else {
        reject();
      }
    }, 500);
  });

  try {
    const data = await bookPromise;
    res.status(300).json(data);
  } catch {
    res.status(404).send();
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const bookByAuthorPromise = new Promise((resolve) => {
    const book = Object.values(books).filter(
      (book) => book.author === req.params.author
    );
    setTimeout(() => {
      resolve(book);
    }, 500);
  });

  const data = await bookByAuthorPromise;
  res.status(300).json(data);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const bookByTitlePromise = new Promise((resolve) => {
    const book = Object.values(books).filter(
      (book) => book.title === req.params.title
    );
    setTimeout(() => {
      resolve(book);
    }, 500);
  });

  const data = await bookByTitlePromise;
  res.status(300).json(data);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).send();
  }
  return res.status(300).json(book.reviews);
});

module.exports.general = public_users;
