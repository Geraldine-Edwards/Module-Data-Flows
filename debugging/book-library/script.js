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

// DOM elements (using destructuring assignment)
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const checkInput = document.getElementById("check");
const progressHeaderEl = document.getElementById("progress-header");
const progressBarEl = document.getElementById("progress-bar");
const tableEl = document.getElementById("display");
// add event listener for the add book button
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  if (bookForm) {
    bookForm.addEventListener("submit", (event) => {
      // prevent the default form submission
      event.preventDefault();
      submit();
    });
  }
  // add event listener for clear all button
  const clearAllBtn = document.getElementById("clearAllBooksBtn");
  // check if the button exists before adding the event listeners to prevent errors if the button is not present in the DOM
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all books?")) {
        myLibrary.length = 0;
        saveToStorage();
        render();
      }
    });
  }
});

// function to save the book library to localStorage
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
  // check if progressHeader and progressBar exist in the DOM
  if (!progressHeaderEl || !progressBarEl) {
    console.error(
      "Progress bar or header not found in the DOM. Progress tracking will not be displayed."
    );
    return;
  }
  // get the length of the my library array
  const totalBooks = myLibrary.length;
  // filter the books that are read (check is true)
  const readBooks = myLibrary.filter((book) => book.check).length;
  // calculate the percentage of books read
  // if totalBooks is 0, set percent to 0 to avoid division by zero otherwise calculate the percentage and round it
  const percent =
    totalBooks === 0 ? 0 : Math.round((readBooks / totalBooks) * 100);

  // update the progress bar text
  progressHeaderEl.innerText = `Read ${readBooks} out of ${totalBooks} books`;

  //  update the progress bar width (the percentage will be reflected in the width of the styling of the bar)
  progressBarEl.style.width = percent + "%";
}

function populateStorage() {
  // add default books to myLibrary if it's empty on initial setup
  if (myLibrary.length == 0) {
    let book1 = new Book("Robinson Crusoe", "Daniel Defoe", 252, true);
    let book2 = new Book(
      "The Old Man and the Sea",
      "Ernest Hemingway",
      127,
      true
    );
    myLibrary.push(book1, book2);
    render();
  }
}

// clear the form after submission
function clearForm() {
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  checkInput.checked = false;
}

// validate book input
function validateBookInput(titleValue, authorValue, pagesValue) {
  // add validation for empty fields in form
  if (titleValue == "" || authorValue == "" || pagesValue == "") {
    return { error: "Please fill all fields!" };
  }
  // validate the author - use regex for letters, spaces, and hyphens, apostrophes, and periods
  const authorPattern = /^[A-Za-z\s\-'.]+$/;
  // use .test() when trying to match a regex pattern against a string
  if (!authorPattern.test(authorValue.trim())) {
    return {
      error:
        "Please enter a valid author name (letters, spaces, hyphens, apostrophes, and periods only).",
    };
  }
  // convert the pages value to a number (to make validation easier)
  const pagesNum = Number(pagesValue);
  // validate the number
  if (isNaN(pagesNum) || pagesNum <= 0 || !Number.isInteger(pagesNum)) {
    return { error: "Please enter a valid whole number for pages." };
  }
  // return an error, but if no error return null and also return the parsed pagesNum value so it can be used later in the submit function
  return { error: null, pagesNum };
}

// handle form submission - check the right input from forms and if its ok -> add the new book (object in array)
function submit() {
  // trim all inputs for leading/trailing spaces
  const titleValue = titleInput.value.trim();
  const authorValue = authorInput.value.trim();
  const pagesValue = pagesInput.value.trim();

  // call the validation function
  const validationResult = validateBookInput(
    titleValue,
    authorValue,
    pagesValue
  );
  // if there is an error, alert the user and return false to prevent submission
  if (validationResult.error) {
    alert(validationResult.error);
    return false;
  }
  // if no error, use the pagesNum from the validation result
  const pagesNum = validationResult.pagesNum;

  // check if the book already exists in myLibrary
  const duplicate = myLibrary.some(
    (book) =>
      book.title.trim() === titleValue && book.author.trim() === authorValue
  );
  if (duplicate) {
    alert("This book is already in your library.");
    return false;
  }

  // create a new book object and add it to myLibrary and save to storage (use the converted pages value in pagesNum that has been validated rather than the object's pages.value - therefore book.pages is now a number)
  let book = new Book(titleValue, authorValue, pagesNum, checkInput.checked);
  myLibrary.push(book);
  saveToStorage(); // save the book after adding
  render();
  clearForm();
}

// render the table with books from myLibrary
function render() {
  // count the existing number of rows in the table
  let rowsNumber = tableEl.rows.length;
  //delete all the rows except for the table header row (delete all rows except row 0)
  for (let n = rowsNumber - 1; n > 0; n--) {
    tableEl.deleteRow(n);
  }
  // update the progress bar after deleting rows
  updateProgressBar();

  // for each book and index (the unique ID that is used for the button) in myLibrary, create a new row in the table
  myLibrary.forEach((book, i) => createBookRow(book, i));
}

// create a table row for each book
function createBookRow(book, i) {
  const { title, author, pages, check } = book;
  let row = tableEl.insertRow(1); // insert new row at position 1 to keep the header intact
  let titleCell = row.insertCell(0);
  let authorCell = row.insertCell(1);
  let pagesCell = row.insertCell(2);
  let wasReadCell = row.insertCell(3);
  let deleteCell = row.insertCell(4);
  // use textContent to ensure no HTML is injected and remains plain text
  titleCell.textContent = title.trim();
  authorCell.textContent = author.trim();
  // textContent coerces the value of pages to a string
  pagesCell.textContent = pages;

  // center the pages cell
  pagesCell.className = "text-center";

  //add and wait for action for read/unread button
  let changeBtn = document.createElement("button");
  // set the button ID to the index of the book
  changeBtn.id = i;
  // append the button to the wasReadCell row
  wasReadCell.appendChild(changeBtn);
  // the button state reflects the read status of the book
  setReadButtonState(changeBtn, check);
  // when clicked the button will toggle the read status indicated by the handleToggleRead function
  changeBtn.addEventListener("click", () => handleToggleRead(i));

  //add delete button to every row and render again
  let delButton = document.createElement("button");
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
  // confirm with the user that they want to delete the book
  if (confirm("Are you sure you want to delete this book?")) {
    alert("You have deleted title: " + myLibrary[index].title);
    // remove the book at the given index from myLibrary
    myLibrary.splice(index, 1);
    saveToStorage();
    render();
  }
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
