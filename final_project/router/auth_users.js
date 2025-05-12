const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (userName, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.userName === userName && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(404).send({ message: "Username or password incorrect!" });
  }

  if (!authenticatedUser(userName, password)) {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }

  const accessToken = jwt.sign({ name: userName }, "access", {
    expiresIn: 60 * 60,
  });

  req.session.authorization = {
    accessToken,
    userName,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.query;
  if (!isbn || !books[isbn]) {
    return res.status(404).json({ message: "Invalid isbn." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty." });
  }

  const book = books[isbn];
  const { name } = req.user;

  book.reviews = {
    [name]: review,
  };

  return res.status(300).json({ message: "Review added." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid isbn." });
  }

  const book = books[isbn];
  const { name } = req.user;

  if (!book.reviews[name]) {
    return res.status(404).json({ message: "Review not found." });
  }

  const bookReviews = Object.keys(book.reviews).filter(
    (userName) => userName !== name
  );
  book.reviews = Object.fromEntries(bookReviews);

  return res.status(300).json({ message: "Review deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
