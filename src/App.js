import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { Link, Route } from "react-router-dom";
import { books } from "./Data";
import { debounce } from "throttle-debounce";

class BooksApp extends React.Component {
  shelves = [
    { id: 1, shelf: "currentlyReading", friendlyName: "Currently Reading" },
    { id: 2, shelf: "wantToRead", friendlyName: "Want to Read" },
    { id: 3, shelf: "read", friendlyName: "Read" },
  ];

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: books,
    searchedBooks: [],
    query: "",
  };
  // I thought about adding this move method to the BookList,
  // But I need the move method to also be available for Search
  // So the move method lives here
  moveBookToShelf = (book, shelf) => {
    const newBooks = this.state.books.map((bk) => {
      if (bk.id === book.id) {
        bk.shelf = shelf;
      }
      return bk;
    });
    // console.log()

    this.setState({
      books: newBooks,
    });
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
    const { books, searchedBooks } = this.state;
    console.log("bookapp", this.state);
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

const BooksContent = (props) => {
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
const BookShelf = (props) => {
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

const Book = (props) => {
  const { book, bookshelf, moveBookToShelf } = props;
  console.log("book", props);
  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 192,
              backgroundImage: `url(${book.imageLinks &&
                book.imageLinks.smallThumbnail})`,
            }}
          />
          <BookshelfChange
            book={book}
            bookshelf={bookshelf}
            moveBookToShelf={moveBookToShelf}
          />
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">
          {book.authors &&
            (book.authors.length === 1
              ? book.authors[0]
              : book.authors[0] + " et al.")}
        </div>
      </div>
    </li>
  );
};

class BookshelfChange extends Component {
  // console.log(this.props);
  // state stores current shelf
  state = {
    shelf: this.props.bookshelf,
    book: this.props.book,
  };

  onChange = (e) => {
    console.log("previous", this.state.shelf);
    e.preventDefault();
    // Change shelf type
    this.setState({
      shelf: e.target.value,
    });
    this.props.moveBookToShelf(this.state.book, e.target.value);
  };

  render() {
    return (
      <div className="book-shelf-changer">
        <select value={this.state.shelf} onChange={this.onChange}>
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    );
  }
}

class BookSearch extends Component {
  render() {
    const { searchedBooks, search, clearSearch, moveBookToShelf } = this.props;
    return (
      <div className="search-books">
        <SearchBar search={search} clearSearch={clearSearch} />
        <SearchResults
          searchedBooks={searchedBooks}
          moveBookToShelf={moveBookToShelf}
        />
      </div>
    );
  }
}

const SearchBar = (props) => {
  const { search, clearSearch } = props;
  return (
    <div className="search-books-bar">
      <Link to="/">
        <button className="close-search" onClick={clearSearch}>
          Close
        </button>
      </Link>
      <Search search={search} />
    </div>
  );
};

const SearchResults = (props) => {
  console.log("searchedBooks", props);
  const { searchedBooks, moveBookToShelf } = props;
  return (
    <div className="search-books-results">
      <ol className="books-grid">
        {!searchedBooks.error &&
          searchedBooks.map((book) => (
            <Book key={book.id} book={book} moveBookToShelf={moveBookToShelf} />
          ))}
      </ol>
    </div>
  );
};

class Search extends Component {
  state = {
    query: "",
  };
  executeSearch = (query) => this.props.search(query);
  onChange = (e) => {
    const i = e.target.value;
    this.setState({ query: i }, this.executeSearch(i));
  };
  render() {
    console.log("search", this.state, this.props);
    // const { query } = this.state;
    return (
      <div className="search-books-input-wrapper">
        <input
          type="text"
          placeholder="Search by title or author"
          value={this.state.query}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default BooksApp;
