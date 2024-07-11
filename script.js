$(document).ready(function () {
  const taskBoard = $("#task-board");
  const taskModal = $("#task-modal");
  const newTaskBtn = $("#new-task-btn");
  const closeModal = $(".close");
  const taskForm = $("#task-form");

  // Function to save tasks to localStorage
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
  }

  // Function to render tasks
  function renderTasks() {
    const tasks = loadTasks();
    $(".column").find(".task").remove();
    tasks.forEach((task) => {
      const taskElement = $(`
          <div class="task" data-id="${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Deadline: ${task.deadline}</p>
            <span class="delete-btn">&times;</span>
          </div>
        `);
      $(`#${task.status}`).append(taskElement);
    });
    initializeDragAndDrop();
  }

  // Open modal
  newTaskBtn.click(function () {
    taskModal.show();
  });

  // Close modal
  closeModal.click(function () {
    taskModal.hide();
  });

  // Handle form submission
  taskForm.submit(function (event) {
    event.preventDefault();
    const newTask = {
      id: Date.now(),
      title: $("#task-title").val(),
      description: $("#task-desc").val(),
      deadline: $("#task-deadline").val(),
      status: "not-started",
    };
    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    taskModal.hide();
  });

  // Handle task deletion
  taskBoard.on("click", ".delete-btn", function () {
    const taskId = $(this).parent().data("id");
    let tasks = loadTasks();
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
  });

  // Initialize drag and drop functionality
  function initializeDragAndDrop() {
    $(".task").draggable({
      revert: "invalid",
      stack: ".task",
    });

    $(".column").droppable({
      accept: ".task",
      drop: function (event, ui) {
        const taskId = ui.draggable.data("id");
        const newStatus = $(this).attr("id");
        const tasks = loadTasks();
        const task = tasks.find((task) => task.id === taskId);
        task.status = newStatus;
        saveTasks(tasks);
        renderTasks();
      },
    });
  }

  // Initialize the task board
  renderTasks();
});
