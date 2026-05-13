//tạo đối tượng Calculator 
function Calculator() {
  this.current = '';
  this.history = [];
}
//định nghĩa các phương thức cho đối tượng Calculator
// getDisplay trả về chuỗi hiện tại hoặc '0' nếu chuỗi rỗng
Calculator.prototype.getDisplay = function () {
  return this.current || '0';
};
// Phương thức appendDigit thêm một chữ số hoặc dấu chấm vào chuỗi hiện tại, kiểm tra để tránh thêm nhiều dấu chấm trong cùng một số
Calculator.prototype.appendDigit = function (value) {
  if (value === '.') {
    var lastNumber = this.current.split(/[+\-×÷]/).pop();
    if (lastNumber.indexOf('.') !== -1) {
      return;
    }
    if (lastNumber === '') {
      this.current += '0';
    }
  }
  this.current += value;
};
// appendOperator thêm 1 phép toán vào cuối chuỗi 
Calculator.prototype.appendOperator = function (operator) {
  if (!this.current) {
    return;
  }
  if (/[+\-×÷]$/.test(this.current)) {
    this.current = this.current.slice(0, -1) + operator;
  } else {
    this.current += operator;
  }
};
// clear xóa chuỗi hiện tại
Calculator.prototype.clear = function () {
  this.current = '';
};
// Xử lí tính toán và lưu lịch sử
Calculator.prototype.calculate = function () {
  if (!this.current) {
    return { error: false, value: this.getDisplay() };
  }

  // Xóa toán tử cuối nếu có
  this.current = this.current.replace(/[+\-×÷]$/, '');

  const expression = this.current
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  try {
    //tính toán kết quả
    const result = eval(expression);
    // kiểm tra lỗi null, chia cho 0,...
    if (!isFinite(result)) {
      throw new Error();
    }

    const finalResult = Number.isInteger(result)? result : parseFloat(result.toFixed(10));

    // Lưu lịch sử
    this.history.unshift({
      expression: this.current,
      result: finalResult
    });

    this.history = this.history.slice(0, 10);

    this.current = String(finalResult);

    return {
      error: false,
      value: this.current
    };

  } catch {
    return { error: true };
  }
};
