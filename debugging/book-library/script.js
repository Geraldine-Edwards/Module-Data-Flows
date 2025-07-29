// Book class (must be defined before use)
class Book {
  constructor(title, author, pages, check) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.check = check;
  }
}

// initialise an empty array to hold my book library
let myLibrary = [];

// Dom elements
const title = document.getElementById("title");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const check = document.getElementById("check");
const progressHeader = document.getElementById("progress-header");
const progressBar = document.getElementById("progress-bar");
const table = document.getElementById("display");

// function to save my library to localStorage
function saveToStorage() {
  // convert myLibrary array to a JSON string and save it
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// function to load my library from localStorage
function loadFromStorage() {
  // retrieve the JSON string from localStorage and parse it back to an array
  const stored = localStorage.getItem("myLibrary");
  // only parse if there is something stored
  if (stored) {
    // clear the array in place
    myLibrary.length = 0;
    // add loaded books to the existing array
    myLibrary.push(...JSON.parse(stored));
  }
}

// function to display the current number of books read vs unread
function updateProgressBar() {
  const totalBooks = myLibrary.length;
  const readBooks = myLibrary.filter((book) => book.check).length;
  const percent =
    totalBooks === 0 ? 0 : Math.round((readBooks / totalBooks) * 100);

  // update the progress bar text
  progressHeader.innerText = `Read ${readBooks} out of ${totalBooks} books`;

  //  update the progress bar width
  progressBar.style.width = percent + "%";
}

function populateStorage() {
  // add default books to myLibrary if it's empty on initial setup
  if (myLibrary.length == 0) {
    let book1 = new Book("Robinson Crusoe", "Daniel Defoe", "252", true);
    let book2 = new Book(
      "The Old Man and the Sea",
      "Ernest Hemingway",
      "127",
      true
    );
    myLibrary.push(book1, book2);
    render();
  }
}

// clear the form after submission
function clearForm() {
  title.value = "";
  author.value = "";
  pages.value = "";
  check.checked = false;
}

// handle form submission - check the right input from forms and if its ok -> add the new book (object in array)
function submit() {
  // add validation for empty fields
  if (title.value == "" || author.value == "" || pages.value == "") {
    alert("Please fill all fields!");
    return false;
  } else {
    // create a new book object and add it to myLibrary and save to storage
    let book = new Book(title.value, author.value, pages.value, check.checked);
    myLibrary.push(book);
    saveToStorage(); // save the book after adding
    render();
    clearForm();
  }
}

// render the table with books from myLibrary
function render() {
  // count the existing number of rows in the table
  let rowsNumber = table.rows.length;
  //delete all the rows except for the table header row (delete all rows except row 0)
  for (let n = rowsNumber - 1; n > 0; n--) {
    table.deleteRow(n);
  }
  // update the progress bar after deleting rows
  updateProgressBar();

  // add rows for each book in myLibrary
  myLibrary.forEach((book, i) => {
    createBookRow(book, i);
  });
}

// create a table row for each book
function createBookRow(book, i) {
  let row = table.insertRow(1); // insert new row at position 1 to keep the header intact
  let titleCell = row.insertCell(0);
  let authorCell = row.insertCell(1);
  let pagesCell = row.insertCell(2);
  let wasReadCell = row.insertCell(3);
  let deleteCell = row.insertCell(4);

  // fill the first 3 cells with book data
  titleCell.innerHTML = myLibrary[i].title;
  authorCell.innerHTML = myLibrary[i].author;
  pagesCell.innerHTML = myLibrary[i].pages;

  //add and wait for action for read/unread button
  let changeBtn = document.createElement("button");
  changeBtn.id = i;
  wasReadCell.appendChild(changeBtn);
  setReadButtonState(changeBtn, book.check);
  changeBtn.addEventListener("click", () => handleToggleRead(i));

  //add delete button to every row and render again
  let delButton = document.createElement("button");
  delButton.id = i + 5;
  deleteCell.appendChild(delButton);
  delButton.className = "btn btn-warning";
  delButton.innerHTML = "Delete";
  delButton.addEventListener("click", () => {
    handleDeleteBook(i);
  });
}

function setReadButtonState(btn, isRead) {
  // set the button text based on the read status
  if (isRead) {
    btn.innerHTML = "Read";
    btn.className = "btn btn-success";
  } else {
    btn.innerHTML = "Unread";
    btn.className = "btn btn-danger";
  }
}

// toggle the read status of a book
function handleToggleRead(index) {
  // toggle the read status of the book at the given index
  myLibrary[index].check = !myLibrary[index].check;
  // save to storage and re-render
  saveToStorage();
  render();
}

// delete a book from the library
function handleDeleteBook(index) {
  alert("You have deleted title: " + myLibrary[index].title);
  // remove the book at the given index from myLibrary
  myLibrary.splice(index, 1);
  saveToStorage();
  render();
}

// when the window loads, we want to load the saved books from local storage
window.addEventListener("load", function (e) {
  // load saved books from local storage
  loadFromStorage();
  // only add default books if myLibrary is empty
  // this prevents overwriting existing books
  if (myLibrary.length === 0) {
    populateStorage();
  }
  render();
});

module.exports = { Book, saveToStorage, loadFromStorage, myLibrary };
