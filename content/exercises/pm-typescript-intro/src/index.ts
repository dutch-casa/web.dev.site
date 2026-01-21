
// TypeScript Introduction Exercise
//
// Add proper type annotations to all these functions and interfaces:
//
// 1. Define a User interface with:
//    - id: number
//    - name: string
//    - email: string
//    - age?: number (optional)
//
// 2. Define a Product interface with:
//    - id: number
//    - name: string
//    - price: number
//    - inStock: boolean
//
// 3. Add types to the functions below:

// Define interfaces here:


// Add type annotations to these functions:

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

function getUser(id) {
  return {
    id: id,
    name: "John",
    email: "john@example.com"
  };
}

function filterProducts(products, inStockOnly) {
  if (inStockOnly) {
    return products.filter(p => p.inStock);
  }
  return products;
}

function calculateTotal(products) {
  return products.reduce((sum, p) => sum + p.price, 0);
}

export { greet, add, getUser, filterProducts, calculateTotal };
