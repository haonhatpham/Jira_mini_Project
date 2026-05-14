var display = document.getElementById('display');
var historyList = document.getElementById('history');
var buttons = document.querySelectorAll('.button-grid button:not(.placeholder)');

function updateDisplay() {
  display.textContent = getDisplay();
}

function updateHistory() {
  historyList.innerHTML = '';
  calcHistory.forEach(function (item) {
    var li = document.createElement('li');
    var expression = document.createElement('span');
    var result = document.createElement('span');

    expression.className = 'history-expression';
    expression.textContent = item.expression;

    result.className = 'history-result';
    result.textContent = item.result;

    li.appendChild(expression);
    li.appendChild(result);
    historyList.appendChild(li);
  });
}

function handleButton(action, value) {
  switch (action) {
    case 'digit':
      appendDigit(value);
      updateDisplay();
      break;
    case 'operator':
      appendOperator(value);
      updateDisplay();
      break;
    case 'calculate':
      var result = calculate();
      if (result.error) {
        display.textContent = 'Error';
        clearCalculator();
        return;
      }
      updateDisplay();
      updateHistory();
      break;
    case 'clear':
      clearCalculator();
      updateDisplay();
      break;
    default:
      break;
  }
}

buttons.forEach(function (button) {
  button.addEventListener('click', function () {
    handleButton(button.dataset.action, button.dataset.value);
  });
});

updateDisplay();
