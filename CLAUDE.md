# Project Guidelines

## 1. Code Style (MUST FOLLOW)

### Frontend (React)
- **File Naming**: Use PascalCase for components, camelCase for hooks/utils.
  ```jsx
  // Good
  import MyComponent from "./MyComponent";
  import { useCart } from "./useCart";
  // Bad
  import mycomponent from "./mycomponent";
  ```
- **Functional Components**: Always use functional components with hooks.
- **Parentheses**:
  - 1 line: No parentheses
  - 2+ lines: Use parentheses
  ```jsx
  // 1 line - no parentheses
  const MyComponent = () => <div />;

  // 2+ lines - use parentheses
  const MyComponent = () => (
    <div>
      <h1>Hello</h1>
    </div>
  );
  ```
- **Props**: Extract props for cleaner code.
  ```jsx
  // Bad - too long
  const ProductCard = ({ product, onAddToCart, showBadge }) => (
    <div>...</div>
  );

  // Good - extract props
  const ProductCard = ({ product, onAddToCart, showBadge }) => {
    const { name, price } = product;
    return <div>...</div>;
  };
  ```

### Backend (Node.js/Express)
- **REST API**: Adhere to RESTful principles.
- **Async/Await**: Use async/await for all asynchronous operations.
- **Error Handling**: Use try-catch blocks and centralized error middleware.
  ```javascript
  // Good
  app.get('/users', async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  // Bad - callback style
  app.get('/users', (req, res) => {
    userService.getUsers().then(users => {
      res.json(users);
    }).catch(error => {
      next(error);
    });
  });
  ```

## 2. File Structure

```text
frontend/
├── src/
│   ├── components/        # Reusable React components (PascalCase)
│   │   ├── common/        # Buttons, inputs, cards, etc.
│   │   ├── layout/        # Header, footer, sidebar
│   │   └── features/      # Feature-specific components
│   ├── hooks/             # Custom React hooks (camelCase)
│   ├── services/          # API calls and business logic
│   ├── pages/             # Page components (PascalCase)
│   ├── store/             # Redux store (if using)
│   └── utils/             # Utility functions
├── public/

backend/
├── config/                # Configuration files
├── controllers/           # Request handlers
├── middlewares/           # Custom middleware
├── models/                # Database models
├── routes/                # API routes
├── services/              # Business logic
└── utils/                 # Utility functions
```

## 3. Development Workflow

### Before Coding
1.  **Check Dependencies**: Run `npm install` or `yarn install` in the respective directory.
2.  **Database Setup**: Ensure database is running and migrations are applied.

### Coding Conventions
- **Constants**: Use UPPER_SNAKE_CASE for constants.
- **Imports**: Import all dependencies at the top of the file.
- **Comments**: Add JSDoc comments for functions and components.
- **One Feature Per Commit**: Commit related changes together.

### Testing
- **Unit Tests**: Run `npm run test:unit` or `yarn test:unit`.
- **Integration Tests**: Run `npm run test:integration` or `yarn test:integration`.
- **End-to-End Tests**: Run `npm run test:e2e` or `yarn test:e2e`.

### Git Commit Messages
- **Format**: `type(scope): <subject>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Examples**:
  ```text
  feat(auth): add user registration endpoint
  fix(cart): correct total calculation bug
  docs(api): update API documentation
  ```

## 4. Common Issues & Solutions

### Component Props Too Long
```jsx
// Bad
const ProductCard = ({ product, onAddToCart, showBadge, isFeatured, discount }) => {
  // ... lots of props
};

// Good
const ProductCard = ({ product, onAddToCart, ...props }) => {
  const { showBadge, isFeatured, discount } = props;
  // ...
};
```

### Large Functions
```javascript
// Bad
const processOrder = (order) => {
  // ... 100+ lines of code
};

// Good - split into smaller functions
const processOrder = (order) => {
  const validationResult = validateOrder(order);
  if (!validationResult.isValid) {
    return validationResult;
  }

  const processedOrder = calculateTaxes(order);
  const savedOrder = saveOrder(processedOrder);
  sendConfirmationEmail(savedOrder);

  return savedOrder;
};
```

### API Response Formatting
- **Consistent**: All API responses should have the same structure.
- **Standard Format**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful"
  }
  ```

## 5. Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend
```env
PORT=5000
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=app_db
JWT_SECRET=your_jwt_secret
```

## 6. Troubleshooting

### "Port already in use" error
```bash
# Kill the process using the port
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
taskkill /F /PID <pid>
```

### React component not rendering
- Check console for errors
- Verify component name matches import
- Ensure parent component is rendering

### Backend API not responding
- Check if server is running
- Verify route exists
- Check database connection
- Look for error messages in server logs

## 7. Security Best Practices

### Frontend
- Never store sensitive data in localStorage
- Use HTTPS in production
- Sanitize all user inputs
- Implement CORS properly

### Backend
- Validate and sanitize all inputs
- Use prepared statements to prevent SQL injection
- Implement rate limiting
- Use HTTPS in production
- Store secrets in environment variables
- Implement proper authentication and authorization

## 8. Performance Optimization

### Frontend
- Use code splitting
- Implement lazy loading
- Optimize images
- Use memoization for expensive calculations

### Backend
- Use database indexing
- Implement caching
- Optimize queries
- Use connection pooling

## 9. Git Branching Strategy

```text
main - production
develop - development
feature/<feature-name> - feature branches
fix/<bug-name> - bug fix branches
hotfix/<issue-name> - hotfix branches
```

## 10. Daily Checklist

### Before Coding
- [ ] Check project documentation
- [ ] Review recent changes
- [ ] Plan your tasks

### During Coding
- [ ] Follow coding standards
- [ ] Write tests
- [ ] Commit frequently
- [ ] Update documentation

### After Coding
- [ ] Run tests
- [ ] Review your code
- [ ] Update README if needed
- [ ] Push your changes

## 11. Troubleshooting

### Common Issues
1.  **Environment Variables Missing**: Ensure all `.env` files are created and populated.
2.  **Port Already in Use**: Kill the process using the port (see above for commands).
3.  **Database Connection Issues**: Verify database is running and credentials are correct.
4.  **
