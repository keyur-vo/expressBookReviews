const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(201).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(400).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    let bookList = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve({ ...books[isbn], isbn: isbn });
    } else {
      reject("Book not found");
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key]["author"] === author) {
        booksByAuthor.push({ ...books[key], isbn: key });
      }
    }
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("Book not found");
    }
  })
    .then((books) => res.status(200).json({ books: books }))
    .catch((err) => res.status(404).json({ message: err }));
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  new Promise((resolve, reject) => {
    for (let key in books) {
      if (books[key].title === title) {
        resolve({ ...books[key], isbn: key });
      }
    }
    reject("Book not found");
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if(books[req.params.isbn]){
    if(Object.keys(books[req.params.isbn].reviews).length === 0){
      return res.status(404).json({message: "No reviews found"});
    }
    return res.status(200).json({reviews : books[req.params.isbn].reviews});
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
