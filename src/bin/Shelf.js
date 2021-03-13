import React, { Component } from "react";
import { Link } from "react-router-dom";
import Book from "./Book";

class BookList extends Component {
  render() {
    // render a shelves component (props will be 'currently reading', 'want to read' and 'read', and books)
    const { shelves, books, moveBookToShelf } = this.props;
    // console.log(this.props);
    return (
      <div className="list-books">
        <h1>MyReads</h1>
        <BooksContent
          shelves={shelves}
          books={books}
          moveBookToShelf={moveBookToShelf}
        />
        <div className="open-search">
          <Link to="search">
            <button>Add a book</button>
          </Link>
        </div>
      </div>
    );
  }
}

export const BooksContent = (props) => {
  // get shelves and their books (if any)
  const { shelves, books, moveBookToShelf } = props;
  // console.log("BooksContent", props);
  return (
    <div className="list-books-content">
      <div>
        List of Books
        {shelves.map((shelf) => (
          <BookShelf
            key={shelf.id}
            books={books}
            bookshelf={shelf}
            moveBookToShelf={moveBookToShelf}
          />
        ))}
      </div>
    </div>
  );
};

export const BookShelf = (props) => {
  // Get all books and the bookshelf from props
  const { books, bookshelf, moveBookToShelf } = props;
  // console.log(props);
  // Filter the books in the bookshelf
  const booksFiltered = books.filter((book) => book.shelf === bookshelf.shelf);
  // console.log(booksFiltered);
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{bookshelf.friendlyName}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {booksFiltered.map((book) => (
            <Book
              key={book.id}
              book={book}
              bookshelf={bookshelf.shelf}
              moveBookToShelf={moveBookToShelf}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default BookList;
