import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isbn: '',
      title: '',
      author: '',
      description: '',
      published_date: '',
      publisher: '',
      books: [],
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { isbn, title, author, description, published_date, publisher } = this.state;

    axios.post('/api/book/add', { isbn, title, author, description, published_date, publisher })
      .then((result) => {
        window.location.reload();
      });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/book')
      .then(res => {
        this.setState({books: res.data});
        console.log(this.state.books);
      })
      .catch((error) => {
        if(error.response.status === 401){
          this.props.history.push("/login");
        }
      });
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  render() {
    const { isbn, title, author, description, published_date, publisher } = this.state;
    return (
      <div className="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
            {
              localStorage.getItem('jwtToken') && 
              <button class="btn btn-success" onClick={this.openModal}>Add Books</button>
              }
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={modalStyles}
                contentLabel="Add Books Modal"
              >

                <h2 ref={subtitle => this.subtitle = subtitle}>Add Books</h2>
                <form onSubmit={this.onSubmit}>
                  <label for="inputIsbn" class="sr-only">ISBN</label>
                  <input type="text" class="form-control" placeholder="ISBN" name="isbn" value={isbn} onChange={this.onChange} required/>
                  <label for="inputTitle" class="sr-only">Title</label>
                  <input type="text" class="form-control" placeholder="Title" name="title" value={title} onChange={this.onChange} required/>
                  <label for="inputAuthor" class="sr-only">Author</label>
                  <input type="text" class="form-control" placeholder="author" name="author" value={author} onChange={this.onChange} required/>
                  <label for="inputDescription" class="sr-only">Description</label>
                  <input type="text" class="form-control" placeholder="Description" name="description" value={description} onChange={this.onChange} required/>
                  <label for="inputPublishedDate" class="sr-only">PublishedDate</label>
                  <input type="date" class="form-control" placeholder="Published Date" name="published_date" value={published_date} onChange={this.onChange} required/>
                  <label for="inputPublisher" class="sr-only">Publisher</label>
                  <input type="text" class="form-control" placeholder="Publisher" name="publisher" value={publisher} onChange={this.onChange} required/>
                  <button class="btn btn-lg btn-primary btn-block" type="submit">Add</button>
                </form>
              </Modal>
              BOOK CATALOG &nbsp;
              {
                localStorage.getItem('jwtToken') &&
                <button class="btn btn-primary" onClick={this.logout}>Logout</button>
              }
            </h3>
        </div>
        <div class="panel-body">
          <table class="table table-stripe">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.books.map(book =>
                  <tr>
                    <td><Link to={`/show/${book._id}`}>{book.isbn}</Link></td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
        </div>
      </div>
    );
  }
}

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default App;
