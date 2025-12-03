import { useState, useEffect } from 'react';
import axios from 'axios';
import { Storage } from '@ionic/storage'; // Імпорт Ionic Storage
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Modal, Button, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';

// --- Компонент 1: Таблиця книг (Без змін) ---
const BooksTable = ({ books, onBookClick, onToggleFavorite, favorites }) => {
  const isFavorite = (id) => favorites.some(fav => fav.id === id);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Назва</th>
          <th>Видавець</th>
          <th>Рік</th>
          <th>Сторінок</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book.id} onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
            <td>{index + 1}</td>
            <td>{book.Title}</td>
            <td>{book.Publisher}</td>
            <td>{book.Year}</td>
            <td>{book.Pages}</td>
            <td onClick={(e) => e.stopPropagation()}> 
              <Button 
                variant={isFavorite(book.id) ? "danger" : "outline-primary"} 
                size="sm"
                onClick={() => onToggleFavorite(book)}
              >
                {isFavorite(book.id) ? "Видалити" : "У вибране"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// --- Компонент 2: Список вибраного (Без змін) ---
const FavoritesList = ({ favorites, onRemove }) => {
  if (favorites.length === 0) {
    return <Alert variant="info">Список вибраного порожній.</Alert>;
  }
  return (
    <Card>
      <Card.Header as="h5">Вибрані книги <Badge bg="secondary">{favorites.length}</Badge></Card.Header>
      <Card.Body>
        <ul className="list-group list-group-flush">
          {favorites.map(book => (
            <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{book.Title}</strong> <br/>
                <small className="text-muted">{book.Year}</small>
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => onRemove(book)}>✕</Button>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

// --- Компонент 3: Модальне вікно (Без змін) ---
const BookDetailsModal = ({ show, handleClose, book }) => {
  if (!book) return null;
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Деталі книги</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{book.Title}</h4>
        <p><strong>Оригінальна назва:</strong> {book.handle}</p>
        <hr />
        <p><strong>Рік видання:</strong> {book.Year}</p>
        <p><strong>Видавець:</strong> {book.Publisher}</p>
        <p><strong>Кількість сторінок:</strong> {book.Pages}</p>
        <p><strong>ISBN:</strong> {book.ISBN}</p>
        <p><strong>ID:</strong> {book.id}</p>
        <p><strong>Примітки:</strong> {book.Notes ? book.Notes.join(', ') : 'Немає приміток'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Закрити</Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- Головний компонент App ---
function App() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Стан для самого об'єкта сховища
  const [store, setStore] = useState(null);

  // 1. Ініціалізація Ionic Storage та завантаження даних
  useEffect(() => {
    const initStorage = async () => {
      // Створюємо екземпляр сховища
      const newStore = new Storage();
      const createdStore = await newStore.create();
      setStore(createdStore);

      // Пробуємо отримати збережені дані по ключу 'favorites'
      const savedFavorites = await createdStore.get('favorites');
      if (savedFavorites) {
        setFavorites(savedFavorites);
      }
    };

    initStorage();
  }, []);

  // 2. Завантаження книг з API (axios)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://stephen-king-api.onrender.com/api/books');
        setBooks(response.data.data);
      } catch (error) {
        console.error("Помилка API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // 3. Функція додавання/видалення з оновленням сховища
  const toggleFavorite = async (book) => {
    let updatedFavorites;
    
    // Логіка оновлення масиву
    if (favorites.some(fav => fav.id === book.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== book.id);
    } else {
      updatedFavorites = [...favorites, book];
    }

    // Оновлюємо стан React
    setFavorites(updatedFavorites);

    // Оновлюємо Ionic Storage (якщо воно ініціалізоване)
    if (store) {
      await store.set('favorites', updatedFavorites);
      console.log('Дані збережено в Ionic Storage');
    }
  };

  const handleBookClick = (book) => { setSelectedBook(book); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedBook(null); };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Бібліотека Стівена Кінга (+ Ionic Storage)</h1>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Row>
          <Col md={8}>
            <BooksTable 
              books={books} 
              onBookClick={handleBookClick} 
              onToggleFavorite={toggleFavorite} 
              favorites={favorites} 
            />
          </Col>
          <Col md={4}>
            <div className="sticky-top" style={{ top: '20px' }}>
              <FavoritesList favorites={favorites} onRemove={toggleFavorite} />
            </div>
          </Col>
        </Row>
      )}
      <BookDetailsModal show={showModal} handleClose={handleCloseModal} book={selectedBook} />
    </Container>
  );
}

export default App;