import test from 'node:test';
import assert from 'node:assert';
import { Calculator, add, subtract, multiply, divide } from './calculator.js';

test('basic arithmetic functions', () => {
  assert.strictEqual(add(2, 3), 5);
  assert.strictEqual(subtract(5, 3), 2);
  assert.strictEqual(multiply(4, 3), 12);
  assert.strictEqual(divide(10, 2), 5);
  assert.throws(() => divide(5, 0), /Division by zero/);
});

test('Calculator input digits and decimals', () => {
  const calc = new Calculator();
  assert.strictEqual(calc.currentDisplay, '0');
  
  calc.inputDigit(5);
  assert.strictEqual(calc.currentDisplay, '5');

  calc.inputDigit(3);
  assert.strictEqual(calc.currentDisplay, '53');

  calc.inputDecimal();
  assert.strictEqual(calc.currentDisplay, '53.');

  calc.inputDigit(7);
  assert.strictEqual(calc.currentDisplay, '53.7');
});

test('Calculator basic operations and equals', () => {
  const calc = new Calculator();
  calc.inputDigit(7);
  calc.handleOperator('+');
  assert.strictEqual(calc.currentDisplay, '7');
  assert.strictEqual(calc.previousDisplay, '7');

  calc.inputDigit(3);
  assert.strictEqual(calc.currentDisplay, '3');

  calc.equals();
  assert.strictEqual(calc.currentDisplay, '10');
  assert.strictEqual(calc.history.length, 1);
  assert.strictEqual(calc.history[0].result, '10');
});

test('Calculator division by zero handling', () => {
  const calc = new Calculator();
  calc.inputDigit(8);
  calc.handleOperator('/');
  calc.inputDigit(0);
  calc.equals();
  assert.strictEqual(calc.currentDisplay, 'Error');
});

test('Calculator square root and square', () => {
  const calc = new Calculator();
  calc.inputDigit(9);
  calc.sqrt();
  assert.strictEqual(calc.currentDisplay, '3');

  calc.inputDigit(4);
  calc.square();
  assert.strictEqual(calc.currentDisplay, '16');
});

test('Calculator memory operations', () => {
  const calc = new Calculator();
  calc.inputDigit(5);
  calc.memoryStore();
  assert.strictEqual(calc.memory, 5);

  calc.clear();
  calc.memoryRecall();
  assert.strictEqual(calc.currentDisplay, '5');

  calc.inputDigit(2);
  calc.memoryAdd(); // memory becomes 5 + 2 = 7
  assert.strictEqual(calc.memory, 7);

  calc.memorySubtract(); // memory becomes 7 - 2 = 5
  assert.strictEqual(calc.memory, 5);

  calc.memoryClear();
  assert.strictEqual(calc.memory, 0);
});

test('Calculator clear and backspace', () => {
  const calc = new Calculator();
  calc.inputDigit(1);
  calc.inputDigit(2);
  calc.inputDigit(3);
  calc.backspace();
  assert.strictEqual(calc.currentDisplay, '12');

  calc.clear();
  assert.strictEqual(calc.currentDisplay, '0');
});
