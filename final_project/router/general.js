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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if(books[req.params.isbn]){
    return res.status(200).json({...books[req.params.isbn],isbn:req.params.isbn});
  }else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let booksByAuthor = [];
  for(let key in books){
    if(books[key]["author"] === req.params.author){
      booksByAuthor.push({...books[key],isbn:key});
    }
  }
  if(booksByAuthor.length > 0){
    return res.status(200).json({books : booksByAuthor});
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  for(let key in books){
    if(books[key].title === req.params.title){
      return res.status(200).json({...books[key],isbn:key});
    }
  }
  return res.status(404).json({message: "Book not found"});
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
