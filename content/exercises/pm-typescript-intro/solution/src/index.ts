// Solution

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function getUser(id: number): User {
  return {
    id: id,
    name: "John",
    email: "john@example.com"
  };
}

function filterProducts(products: Product[], inStockOnly: boolean): Product[] {
  if (inStockOnly) {
    return products.filter(p => p.inStock);
  }
  return products;
}

function calculateTotal(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.price, 0);
}

export { User, Product, greet, add, getUser, filterProducts, calculateTotal };
