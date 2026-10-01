export class Calculator {
  constructor() {
    this.currentDisplay = '0';
    this.previousDisplay = '';
    this.operation = null;
    this.waitingForOperand = false;
    this.memory = 0;
    this.history = [];
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.currentDisplay = String(digit);
      this.waitingForOperand = false;
    } else {
      this.currentDisplay = this.currentDisplay === '0' ? String(digit) : this.currentDisplay + digit;
    }
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentDisplay = '0.';
      this.waitingForOperand = false;
      return;
    }
    if (!this.currentDisplay.includes('.')) {
      this.currentDisplay += '.';
    }
  }

  clear() {
    this.currentDisplay = '0';
    this.previousDisplay = '';
    this.operation = null;
    this.waitingForOperand = false;
  }

  allClear() {
    this.clear();
    this.memory = 0;
    this.history = [];
  }

  backspace() {
    if (this.waitingForOperand) return;
    if (this.currentDisplay.length > 1) {
      this.currentDisplay = this.currentDisplay.slice(0, -1);
    } else {
      this.currentDisplay = '0';
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.currentDisplay);

    if (this.operation && this.waitingForOperand) {
      this.operation = nextOperator;
      return;
    }

    if (this.previousDisplay === '') {
      this.previousDisplay = this.currentDisplay;
    } else if (this.operation) {
      const result = this.calculate(parseFloat(this.previousDisplay), inputValue, this.operation);
      if (result === 'Error') {
        this.currentDisplay = 'Error';
        this.operation = null;
        this.waitingForOperand = true;
        return;
      }
      this.currentDisplay = String(result);
      this.previousDisplay = this.currentDisplay;
    }

    this.operation = nextOperator;
    this.waitingForOperand = true;
  }

  calculate(first, second, op) {
    let result = 0;
    switch (op) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '*':
        result = first * second;
        break;
      case '/':
        if (second === 0) return 'Error';
        result = first / second;
        break;
      case '^':
        result = Math.pow(first, second);
        break;
      default:
        return second;
    }
    return Math.round(result * 1e12) / 1e12;
  }

  equals() {
    const inputValue = parseFloat(this.currentDisplay);

    if (this.operation && this.previousDisplay !== '') {
      if (this.waitingForOperand) {
        return;
      }
      const prev = parseFloat(this.previousDisplay);
      const expr = `${prev} ${this.operation} ${inputValue}`;
      const result = this.calculate(prev, inputValue, this.operation);
      
      if (result === 'Error') {
        this.currentDisplay = 'Error';
      } else {
        this.currentDisplay = String(result);
        this.history.unshift({ expression: `${expr} =`, result: String(result) });
        if (this.history.length > 20) this.history.pop();
      }

      this.previousDisplay = '';
      this.operation = null;
      this.waitingForOperand = true;
    }
  }

  negate() {
    if (this.currentDisplay === '0' || this.currentDisplay === 'Error') return;
    if (this.currentDisplay.startsWith('-')) {
      this.currentDisplay = this.currentDisplay.slice(1);
    } else {
      this.currentDisplay = '-' + this.currentDisplay;
    }
  }

  percent() {
    const val = parseFloat(this.currentDisplay);
    if (isNaN(val)) return;
    this.currentDisplay = String(Math.round((val / 100) * 1e12) / 1e12);
  }

  sqrt() {
    const val = parseFloat(this.currentDisplay);
    if (val < 0 || isNaN(val)) {
      this.currentDisplay = 'Error';
      return;
    }
    const res = Math.sqrt(val);
    this.currentDisplay = String(Math.round(res * 1e12) / 1e12);
    this.waitingForOperand = true;
  }

  square() {
    const val = parseFloat(this.currentDisplay);
    if (isNaN(val)) return;
    const res = val * val;
    this.currentDisplay = String(Math.round(res * 1e12) / 1e12);
    this.waitingForOperand = true;
  }

  reciprocal() {
    const val = parseFloat(this.currentDisplay);
    if (val === 0 || isNaN(val)) {
      this.currentDisplay = 'Error';
      return;
    }
    const res = 1 / val;
    this.currentDisplay = String(Math.round(res * 1e12) / 1e12);
    this.waitingForOperand = true;
  }

  memoryStore() {
    const val = parseFloat(this.currentDisplay);
    if (!isNaN(val)) this.memory = val;
  }

  memoryRecall() {
    this.currentDisplay = String(this.memory);
    this.waitingForOperand = true;
  }

  memoryAdd() {
    const val = parseFloat(this.currentDisplay);
    if (!isNaN(val)) this.memory += val;
  }

  memorySubtract() {
    const val = parseFloat(this.currentDisplay);
    if (!isNaN(val)) this.memory -= val;
  }

  memoryClear() {
    this.memory = 0;
  }
}

export function add(a, b) { return Math.round((a + b) * 1e12) / 1e12; }
export function subtract(a, b) { return Math.round((a - b) * 1e12) / 1e12; }
export function multiply(a, b) { return Math.round((a * b) * 1e12) / 1e12; }
export function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return Math.round((a / b) * 1e12) / 1e12;
}
