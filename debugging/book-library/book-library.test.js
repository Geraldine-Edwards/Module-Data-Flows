/**
 * @jest-environment jsdom
 */

const {
  Book,
  saveToStorage,
  loadFromStorage,
  myLibrary,
} = require("./script.js");

// test the book class
describe("Book Class", () => {
  test("should create a book with a title, author, pages and check status", () => {
    const book = new Book("Test Title", "Test Author", 123, true);
    expect(book.title).toBe("Test Title");
    expect(book.author).toBe("Test Author");
    expect(book.pages).toBe(123);
    expect(book.check).toBe(true);
  });
});

// test the saveToStorage function
describe("saveToStorage should store myLibrary in localStorage", () => {
  beforeEach(() => {
    // clear and fill the actual myLibrary array
    myLibrary.length = 0;
    myLibrary.push(new Book("Test Title", "Test Author", 123, true));
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("actually stores the correct value data in localStorage", () => {
    // call the function to save to storage
    saveToStorage();
    // check that the stored value matches the expected JSON string
    expect(localStorage.getItem("myLibrary")).toBe(JSON.stringify(myLibrary));
  });
});

//  test the loadFromStorage function
describe("loadFromStorage should load myLibrary from localStorage", () => {
  beforeEach(() => {
    // clear the array
    myLibrary.length = 0;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("loads books from localStorage into myLibrary", () => {
    // store a book in localStorage as a JSON string
    const books = [new Book("Loaded Title", "Loaded Author", 456, false)];
    localStorage.setItem("myLibrary", JSON.stringify(books));

    // call the function to load from storage
    loadFromStorage();

    // check that myLibrary now has the loaded book
    expect(myLibrary).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Loaded Title",
          author: "Loaded Author",
          pages: 456,
          check: false,
        }),
      ])
    );
  });
});
