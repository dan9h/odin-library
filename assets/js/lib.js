let LIBRARY = [];

const booksContainer = document.getElementById('books-container');
const bookTemplate = document.getElementById('book-template');
const addBookButton = document.getElementById('add-book-button');
const addBookDialog = document.getElementById('add-book-dialog');
const addBookForm = document.getElementById('add-book-form');
const addButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

const idCounter = (() => {
  let count = 0;
  return () => {
    return count++;
  };
})();

fetch('dummy.json')
  .then((response) => response.json())
  .then((books) => {
    // Process the JSON data here
    books.forEach(({ title, author, pages, read }) => {
      const bookInstance = new Book(title, author, pages, read);
      addBookToLibrary(bookInstance);
    });
  })
  .catch((error) => {
    // Handle any errors that will occur during the fetch
    console.error('Error:', error);
  });

function Book(title, author, pages, imageSrc, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.imageSrc = imageSrc;
  this.read = read;
}

function Book(title, author, pages, read) {
  this.id = idCounter();
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.read = Boolean(read);
}

function addBookToLibrary(bookInstance) {
  const { id, title, author, pages } = bookInstance;
  const clone = bookTemplate.content.cloneNode(true);

  const book = clone.querySelector('.book');
  const bookTitle = clone.querySelector('.book__title');
  const bookAuthor = clone.querySelector('.book__author');
  const bookPages = clone.querySelector('.book__pages');

  book.dataset.id = id;
  bookTitle.innerText = title;
  bookAuthor.innerText = author;
  bookPages.innerText = pages + ' pages';

  LIBRARY.push(bookInstance);
  booksContainer.appendChild(clone);
}

/**
 * Event Listeners
 */

booksContainer.addEventListener('click', handleDeleteBook);

function handleDeleteBook(event) {
  if (
    event.target.type === 'button' &&
    event.target.className === 'book__delete'
  ) {
    const book = event.target.closest('.book');
    const bookId = Number(book.dataset.id);
    const bookIndex = LIBRARY.findIndex((item) => item.id === bookId);

    book.classList.add('fade-out');

    setTimeout(() => {
      LIBRARY.splice(bookIndex, 1);
      book.remove();
    }, 500);
  }
}

addButton.addEventListener('click', handleAddBook);

function handleAddBook() {
  const inputs = addBookForm.elements;

  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.classList.add('invalid');
      return;
    } else {
      input.classList.remove('invalid');
    }
  }

  // create a new Book instance
  const bookInstance = new Book(
    inputs['book-title'].value,
    inputs['book-author'].value,
    inputs['book-pages'].value,
    inputs['book-read'].checked
  );

  // add book to the Library
  addBookToLibrary(bookInstance);

  // close the modal
  addBookDialog.close();
}

addBookDialog.oncancel = (event) => event.preventDefault(); // escape
addBookForm.onsubmit = (event) => event.preventDefault();
addBookDialog.onclose = () => addBookForm.reset();
addBookButton.onclick = () => addBookDialog.showModal();
cancelButton.onclick = (event) => {
  addBookDialog.close();
};
