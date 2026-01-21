// Functions Exercise
//
// Complete the following functions:
//
// 1. add(a, b) - Return the sum of two numbers
//
// 2. multiply(a, b) - Return the product of two numbers
//    - Default value of b should be 1
//
// 3. calculateArea(shape, ...dimensions) - Calculate area based on shape:
//    - "rectangle": dimensions are [width, height]
//    - "circle": dimensions are [radius] (use Math.PI)
//    - "triangle": dimensions are [base, height]
//    - Return 0 for unknown shapes
//
// 4. compose(f, g) - Return a new function that applies g, then f
//    - compose(f, g)(x) should equal f(g(x))

function add(a, b) {
  // Your code here
}

function multiply(a, b = 1) {
  // Your code here
}

function calculateArea(shape, ...dimensions) {
  // Your code here
}

function compose(f, g) {
  // Your code here
}

module.exports = { add, multiply, calculateArea, compose };
