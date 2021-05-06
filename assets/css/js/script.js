var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do"); 

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
  // check if input value are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  var isEdit = formEl.hasAttribute("data-task-id");
  
  //has data attribute, so get task id and call function to complete edit process
  if (isEdit){
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };

    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add task id as a custom attribute
  listItemEl.setAttribute("data-task-id",taskIdCounter);
  
  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);
  
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

    //increase task counter for next unqiue id 
  taskIdCounter++;
};

var createTaskActions = function(taskId) {
  //crreate new <div> element with the class name "task-actions"
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className - "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i=0; i< statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value",statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];
    

    //append to select 
    statusSelectEl.appendChild(statusOptionEl);
  };

  return actionContainerEl;
};
  
formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
  // get target element from event 
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button
  if (event.target.matches(".delete-btn")) {
    // get the element's task id
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

var editTask = function(taskId) {
  console.log(taskId);

 // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  // write values of taskname and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form with a value of the task's id so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new one
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find task list item with taskId value
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  // remove data attribute from form
  formEl.removeAttribute("data-task-id");
  // update formEl button to go back to saying "Add Task" instead of "Edit Task"
  formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
};

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);