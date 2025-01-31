const { BookController } = require('../controllers/bookController');
const { authenticateToken, authorizeLibrarian } = require('../middleware/auth');
const { bookValidation } = require('../utils/validation');

const bookRouter = express.Router();

bookRouter.use(authenticateToken); // Protect all book routes

// Public routes (requires authentication but not librarian role)
bookRouter.get('/', BookController.getAll);
bookRouter.get('/search', BookController.search);
bookRouter.get('/:id', BookController.getById);

// Librarian only routes
bookRouter.post('/', authorizeLibrarian, bookValidation, BookController.create);
bookRouter.put('/:id', authorizeLibrarian, bookValidation, BookController.update);
bookRouter.delete('/:id', authorizeLibrarian, BookController.delete);