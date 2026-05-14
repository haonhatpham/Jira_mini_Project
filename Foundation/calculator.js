// Trạng thái hiện tại
var current = '';
var calcHistory = [];

function getDisplay() {
  return current || '0';
}

function appendDigit(value) {
  if (value === '.') {
    var lastNumber = current.split(/[+\-×÷]/).pop();
    if (lastNumber.indexOf('.') !== -1) {
      return;
    }
    if (lastNumber === '') {
      current += '0';
    }
  }

  current += value;
}

function appendOperator(operator) {
  if (!current) {
    return;
  }

  if (/[+\-×÷]$/.test(current)) {
    current = current.slice(0, -1) + operator;
  } else {
    current += operator;
  }
}

function clearCalculator() {
  current = '';
}

function operate(a, b, operator) {
  var num1 = Number(a);
  var num2 = Number(b);

  if (isNaN(num1) || isNaN(num2)) {
    return b;
  }

  if (operator === '+') {
    return Number((num1 + num2).toFixed(10));
  }
  if (operator === '-') {
    return Number((num1 - num2).toFixed(10));
  }
  if (operator === '×') {
    return Number((num1 * num2).toFixed(10));
  }
  if (operator === '÷') {
    return num2 === 0 ? 'Error' : Number((num1 / num2).toFixed(10));
  }

  return b;
}

function calculate() {
  if (!current) {
    return { error: false, value: getDisplay() };
  }

  current = current.replace(/[+\-×÷]$/, '');

  var opPos = -1;
  var operator = '';
  for (var i = 0; i < current.length; i += 1) {
    var ch = current[i];
    if (ch === '+' || ch === '-' || ch === '×' || ch === '÷') {
      opPos = i;
      operator = ch;
      break;
    }
  }

  if (opPos === -1) {
    return { error: false, value: getDisplay() };
  }

  var left = current.substring(0, opPos);
  var right = current.substring(opPos + 1);
  var result = operate(left, right, operator);

  if (result === 'Error' || isNaN(result)) {
    calcHistory.push({ expression: current, result: 'Error' });
    if (calcHistory.length > 10) {
      calcHistory.splice(0, calcHistory.length - 10);
    }
    return { error: true };
  }

  calcHistory.push({ expression: current, result: result });
  if (calcHistory.length > 10) {
    calcHistory.splice(0, calcHistory.length - 10);
  }

  current = String(result);

  return { error: false, value: current };
}
