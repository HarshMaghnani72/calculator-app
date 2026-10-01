import { Calculator } from './calculator.js';

const calculator = new Calculator();

const currentOperandEl = document.getElementById('currentOperand');
const previousOperandEl = document.getElementById('previousOperand');
const historyListEl = document.getElementById('historyList');
const themeToggleBtn = document.getElementById('themeToggle');
const clearHistoryBtn = document.getElementById('clearHistory');

function updateDisplay() {
  currentOperandEl.textContent = calculator.currentDisplay;
  
  if (calculator.operation && calculator.previousDisplay !== '') {
    previousOperandEl.textContent = `${calculator.previousDisplay} ${calculator.operation}`;
  } else {
    previousOperandEl.textContent = '';
  }

  renderHistory();
}

function renderHistory() {
  if (calculator.history.length === 0) {
    historyListEl.innerHTML = '<div class="empty-history">No calculation history</div>';
    return;
  }

  historyListEl.innerHTML = calculator.history.map(item => `
    <div class="history-item">
      <span class="history-expr">${escapeHtml(item.expression)}</span>
      <span class="history-res">${escapeHtml(item.result)}</span>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

document.querySelectorAll('.keypad button').forEach(button => {
  button.addEventListener('click', () => {
    const digit = button.getAttribute('data-digit');
    const action = button.getAttribute('data-action');

    if (digit !== null) {
      calculator.inputDigit(digit);
    } else if (action !== null) {
      switch (action) {
        case 'clear':
          calculator.clear();
          break;
        case 'decimal':
          calculator.inputDecimal();
          break;
        case 'add':
          calculator.handleOperator('+');
          break;
        case 'subtract':
          calculator.handleOperator('-');
          break;
        case 'multiply':
          calculator.handleOperator('*');
          break;
        case 'divide':
          calculator.handleOperator('/');
          break;
        case 'equals':
          calculator.equals();
          break;
        case 'negate':
          calculator.negate();
          break;
        case 'sqrt':
          calculator.sqrt();
          break;
        case 'square':
          calculator.square();
          break;
      }
    }
    updateDisplay();
  });
});

document.getElementById('memClear').addEventListener('click', () => {
  calculator.memoryClear();
});
document.getElementById('memRecall').addEventListener('click', () => {
  calculator.memoryRecall();
  updateDisplay();
});
document.getElementById('memAdd').addEventListener('click', () => {
  calculator.memoryAdd();
});
document.getElementById('memSub').addEventListener('click', () => {
  calculator.memorySubtract();
});

clearHistoryBtn.addEventListener('click', () => {
  calculator.history = [];
  renderHistory();
});

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    calculator.inputDigit(e.key);
  } else if (e.key === '.') {
    calculator.inputDecimal();
  } else if (e.key === '+') {
    calculator.handleOperator('+');
  } else if (e.key === '-') {
    calculator.handleOperator('-');
  } else if (e.key === '*') {
    calculator.handleOperator('*');
  } else if (e.key === '/') {
    e.preventDefault();
    calculator.handleOperator('/');
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculator.equals();
  } else if (e.key === 'Backspace') {
    calculator.backspace();
  } else if (e.key === 'Escape') {
    calculator.clear();
  }
  updateDisplay();
});

updateDisplay();
