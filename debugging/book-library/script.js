// initialise an empty array to hold my book library
let myLibrary = [];

// function to save my library to localStorage
function saveToStorage() {
  // convert myLibrary array to a JSON string and save it
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// function to load my library from localStorage
function loadFromStorage() {
  // retrieve the JSON string from localStorage and parse it back to an array
  const stored = localStorage.getItem('myLibrary');
  // only parse if there is something stored
  if (stored) {
    myLibrary = JSON.parse(stored);
  }
}

// function to display the current number of books read vs unread
function updateProgressBar() {
  const totalBooks = myLibrary.length;
  const readBooks = myLibrary.filter(book => book.check).length;
  const percent = totalBooks === 0 ? 0 : Math.round((readBooks / totalBooks) * 100);

    // update the progress bar text
  document.getElementById('progress-header').innerText = `Read ${readBooks} out of ${totalBooks} books`;

  //  update the progress bar width
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = percent + "%";

}

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
    myLibrary.push(book1);
    myLibrary.push(book2);
    render();
  }
}

const title = document.getElementById("title");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const check = document.getElementById("check");

//check the right input from forms and if its ok -> add the new book (object in array)
//via Book function and start render function
function submit() {
  // add validation for empty fields
  if (
    title.value == "" ||
    author.value == "" ||
    pages.value == ""
  ) {
    alert("Please fill all fields!");
    return false;
  } else {
    // create a new book object and add it to myLibrary and save to storage
    let book = new Book(title.value, author.value, pages.value, check.checked);
    myLibrary.push(book);
    saveToStorage(); // save the book after adding
    render();

    // Clear the form after successful submission
    title.value = "";
    author.value = "";
    pages.value = "";
    check.checked = false;
  }
}

function Book(title, author, pages, check) {
  // constructor function to create a new book object
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.check = check;
}

function render() {
  // render the table with books from myLibrary
  let table = document.getElementById("display");
  // count the existing number of rows in the table
  let rowsNumber = table.rows.length;
  //delete all the rows except for the table header row (delete all rows except row 0)
  for (let n = rowsNumber - 1; n > 0; n--) {
    table.deleteRow(n);
  
  // update the progress bar after deleting rows
  updateProgressBar();
  }
  //loop through each book and create a new row for each book, insert 5 cells per row
  let length = myLibrary.length;
  for (let i = 0; i < length; i++) {
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
   wasReadCell.appendChild(changeBtn)
    let readStatus = "";
    if (myLibrary[i].check == true) { 
      readStatus = "Yes";
      changeBtn.className = "btn btn-success";
    } else {
      readStatus = "No";
      changeBtn.className = "btn btn-secondary";
    }
    changeBtn.innerText = readStatus;


    changeBtn.addEventListener("click", function () {
      myLibrary[i].check = !myLibrary[i].check;
      saveToStorage(); // save after changing read status
      render();
    });

    //add delete button to every row and render again
    let delButton = document.createElement("button");
    delButton.id = i + 5;
    deleteCell.appendChild(delButton);
    delButton.className = "btn btn-warning";
    delButton.innerHTML = "Delete";
    delButton.addEventListener("click", function () {
      alert(`You've deleted title: ${myLibrary[i].title}`);
      myLibrary.splice(i, 1);
      saveToStorage(); // save after deleting
      render();
    });
  }
}
// log the library to console for debugging