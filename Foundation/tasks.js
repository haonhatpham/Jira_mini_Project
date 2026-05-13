var taskInput = document.getElementById('task-input');
var taskAddButton = document.getElementById('task-add');
var taskList = document.getElementById('task-list');
var filterButtons = document.querySelectorAll('[data-filter]');
var taskCount = document.getElementById('todo-count');

var tasks = [];
// Bộ lọc hiện tại: all, active, completed
var currentFilter = 'all';

// Tạo thẻ <li> cho một task
function createTaskItem(task) {
  var li = document.createElement('li');
  li.className = 'task-item';

  // Thêm lớp done nếu task đã hoàn thành
  if (task.done) {
    li.className += ' done';
  }

  // Lưu id, dùng khi toggle / delete
  li.dataset.id = task.id;

  var label = document.createElement('label');
  label.className = 'task-label';

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-toggle';
  checkbox.checked = task.done;

  var text = document.createElement('span');
  text.textContent = task.text;

  label.appendChild(checkbox);
  label.appendChild(text);

  var deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'task-delete';
  deleteButton.textContent = 'Delete';

  li.appendChild(label);
  li.appendChild(deleteButton);
  return li;
}

// Cập nhật số lượng task chưa hoàn thành
function updateTaskCount() {
  var activeCount = tasks.filter(function (task) {
    return !task.done;
  }).length;

  taskCount.textContent = activeCount + ' active';
}

// Hiển thị task theo bộ lọc hiện tại
function renderTasks() {
  // Xóa tất cả task cũ
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Duyệt mảng tasks và hiển thị task phù hợp
  tasks.forEach(function (task) {
    if (currentFilter === 'active' && task.done) {
      return;
    }
    if (currentFilter === 'completed' && !task.done) {
      return;
    }
    taskList.appendChild(createTaskItem(task));
  });

  updateTaskCount();
}

// Thêm task mới vào danh sách
function addTask() {
  var text = taskInput.value.trim();
  if (!text) {
    return;
  }

  tasks.push({ id: String(Date.now()), text: text, done: false });
  taskInput.value = ''; // xóa input sau khi thêm
  renderTasks();
}

// Đổi trạng thái hoàn thành của task
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { id: task.id, text: task.text, done: !task.done };
    }
    return task;
  });
  renderTasks();
}

// Xóa task theo id
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  renderTasks();
}

// Thay đổi bộ lọc và cập nhật nút active
function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach(function (button) {
    if (button.dataset.filter === filter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  renderTasks();
}

// Sự kiện thêm task bằng nút Add
taskAddButton.addEventListener('click', addTask);

// Thêm task bằng phím Enter
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Sử dụng event delegation trên danh sách task
taskList.addEventListener('click', function (event) {
  var deleteButton = event.target.closest('button.task-delete');
  if (deleteButton) {
    var item = deleteButton.closest('li');
    deleteTask(item.dataset.id);
    return;
  }

  var checkbox = event.target.closest('input.task-toggle');
  if (checkbox) {
    var item = checkbox.closest('li');
    toggleTask(item.dataset.id);
  }
});

// Chọn bộ lọc task
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setFilter(button.dataset.filter);
  });
});

// Hiển thị lần đầu tiên
renderTasks();
