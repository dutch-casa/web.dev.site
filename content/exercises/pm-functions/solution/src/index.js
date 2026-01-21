// Solution

function add(a, b) {
  return a + b;
}

function multiply(a, b = 1) {
  return a * b;
}

function calculateArea(shape, ...dimensions) {
  switch (shape) {
    case "rectangle":
      return dimensions[0] * dimensions[1];
    case "circle":
      return Math.PI * dimensions[0] * dimensions[0];
    case "triangle":
      return (dimensions[0] * dimensions[1]) / 2;
    default:
      return 0;
  }
}

function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

module.exports = { add, multiply, calculateArea, compose };
