var display = document.getElementById('display');
var historyList = document.getElementById('history');
var buttons = document.querySelectorAll('.button-grid button:not(.placeholder)');
var calculator = new Calculator();

// hiển thị kết nội dung của calculator
function updateDisplay() {
  display.textContent = calculator.getDisplay();
}
//hiển thị lịch sử
function updateHistory() {
  historyList.innerHTML = '';
  calculator.history.forEach(function (item) {
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
      calculator.appendDigit(value);
      updateDisplay();
      break;
    case 'operator':
      calculator.appendOperator(value);
      updateDisplay();
      break;
    case 'calculate':
      var result = calculator.calculate();
      if (result.error) {
        display.textContent = 'Error';
        calculator.clear();
        return;
      }
      updateDisplay();
      updateHistory();
      break;
    case 'clear':
      calculator.clear();
      updateDisplay();
      break;
    default:
      break;
  }
}
// bắt sự kiện click cho tất cả các nút và gọi handleButton với action và value tương ứng
buttons.forEach(function (button) {
  button.addEventListener('click', function () {
    handleButton(button.dataset.action, button.dataset.value);
  });
});

updateDisplay();
