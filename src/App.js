import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { Route } from "react-router-dom";
// import { books } from "./Data";
import { debounce } from "throttle-debounce";

import BookSearch from "./bin/Search";
import BookList from "./bin/Shelf";

class BooksApp extends React.Component {
  shelves = [
    { id: 1, shelf: "currentlyReading", friendlyName: "Currently Reading" },
    { id: 2, shelf: "wantToRead", friendlyName: "Want to Read" },
    { id: 3, shelf: "read", friendlyName: "Read" },
  ];

  state = {
    showSearchPage: false,
    books: [],
    searchedBooks: [],
    // query: "",
  };
  componentDidMount = () => {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books });
    });
  };
  // I thought about adding this move method to the BookList,
  // But I need the move method to also be available for Search
  // So the move method lives here
  moveBookToShelf = (book, shelf) => {
    BooksAPI.update(book, shelf);
    let newBooks = [];
    newBooks = this.state.books.filter((bk) => bk.id !== book.id);

    if (shelf !== "none") {
      book.shelf = shelf;
      newBooks = newBooks.concat(book);
    }
    this.setState({
      books: newBooks,
    });
    alert(`'${book.title}' has been moved to ${shelf}`);
  };
  updateQuery = debounce(10, false, (query) => {
    if (query.length !== 0) {
      BooksAPI.search(query).then((books) => {
        this.setState({ searchedBooks: books });
      });
    } else {
      this.setState({ searchedBooks: [] });
    }
  });
  clearQuery = (query) => {
    this.updateQuery("");
  };

  render() {
    // console.log(process.env.NODE_ENV);
    const { books, searchedBooks } = this.state;
    // console.log("bookapp", this.state);
    // console.log(books);
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <BookList
              shelves={this.shelves}
              books={books}
              moveBookToShelf={this.moveBookToShelf}
            />
          )}
        />
        <Route
          exact
          path="/search"
          render={() => (
            <BookSearch // render the Search part here
              searchedBooks={searchedBooks}
              books={books}
              moveBookToShelf={this.moveBookToShelf}
              search={this.updateQuery}
              clearSearch={this.clearQuery}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
