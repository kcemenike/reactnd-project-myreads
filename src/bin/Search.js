import React, { Component } from "react";
import { Link } from "react-router-dom";

import Book from "./Book";

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

class Search extends Component {
  state = {
    query: "",
  };
  executeSearch = (query) => this.props.search(query);
  onChange = (e) => {
    const q = e.target.value;
    this.setState({ query: q }, this.executeSearch(q));
  };
  render() {
    // console.log("search", this.state, this.props);
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

export const SearchBar = (props) => {
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

export const SearchResults = (props) => {
  // console.log("searchedBooks", props);
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
export default BookSearch;
