import React, { Component } from "react";

export const Book = (props) => {
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
  // state stores current shelf
  state = {
    shelf: this.props.bookshelf,
  };

  onChange = (e) => {
    // console.log("previous", this.state.shelf);
    // e.preventDefault();
    // Change shelf type
    this.setState({
      shelf: e.target.value,
    });
    this.props.moveBookToShelf(this.props.book, e.target.value);
  };

  render() {
    // console.log(this.state);
    console.log("bookshelfchange", this.props);
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

export default Book;
