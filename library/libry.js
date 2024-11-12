const myLibrary = [];

// Book constructor function
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function() {
  this.read = !this.read;
};

// Function to add book to library array
function addBookToLibrary(book) {
  myLibrary.push(book);
  displayBooks();
}

// Function to display books
function displayBooks() {
  const libraryDiv = document.getElementById('library');
  libraryDiv.innerHTML = '';

  for(var i = 0; i < myLibrary.length; i++) {
    var bookCard = createBookCard(myLibrary[i], i);
    libraryDiv.appendChild(bookCard);
  }
}

// Function to remove a book by index
function removeBook(index) {
  myLibrary.splice(index, 1);
  displayBooks();
}

// Function to toggle read status
function toggleReadStatus(index) {
  myLibrary[index].toggleRead();
  displayBooks();
}

// Modal form elements
const modal = document.getElementById('modal');
const newBookBtn = document.getElementById('newBookBtn');
const bookForm = document.getElementById('bookForm');
const closeModalBtn = document.getElementById('closeModal');

// Show modal
newBookBtn.onclick = function() {
  modal.style.display = 'flex';
};

// Close modal
closeModalBtn.onclick = function() {
  modal.style.display = 'none';
};

// Form submission
bookForm.onsubmit = function(event) {
  event.preventDefault();

  var title = document.getElementById('title').value;
  var author = document.getElementById('author').value;
  var pages = document.getElementById('pages').value;
  var read = document.getElementById('read').checked;

  var newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);

  bookForm.reset();
  modal.style.display = 'none';
};

// Close modal if clicked outside the form
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

function createBookCard(book, index) {
  var card = document.createElement('div');
  card.className = 'book-card';
  
  card.innerHTML = 
    '<h3>' + book.title + '</h3>' +
    '<p><strong>Author:</strong> ' + book.author + '</p>' +
    '<p><strong>Pages:</strong> ' + book.pages + '</p>' +
    '<div class="book-actions">' +
      '<button onclick="toggleReadStatus(' + index + ')" class="read-toggle">' +
        (book.read ? 'Read' : 'Not Read') +
      '</button>' +
      '<button onclick="removeBook(' + index + ')" class="delete-btn">Delete</button>' +
    '</div>';

  return card;
}
