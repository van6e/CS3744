let tasks = [
  {
    id: 0,
    title: "Doing Laundary",
    dueDate: new Date (2020,1,28),
    completed : false,
    completeDate : null,
    createdDate: new Date (2020,1,23),
    deleted:false,
    note:"I need to get quarters first at Kroger."
  },
  {
    id: 1,
    title: "CS3744 Assignment 3",
    dueDate: new Date (2020,2,17),
    completed : false,
    completeDate : null,
    createdDate: new Date (2020,1,24),
    deleted:false,
    note:"I better start early cuz it looks pretty complicated.\r\nLooks like I have to read w3schools.com a lot."
  },
  {
    id: 2,
    title: "Getting AAA batteries",
    dueDate: null,
    completed : true,
    completeDate : new Date (2020,2,1),
    createdDate: new Date (2020,1,26),
    deleted:false,
    note:"for my remote control."
  },
  {
    id: 3,
    title: "Booking a flight ticket ACM CHI conference",
    dueDate: new Date (2020,3,15),
    completed : false,
    completeDate : null,
    createdDate: new Date (2020,2,26),
    deleted:false,
    note:"I would have to book a flight ticket to ACM CHI conference.\r\nKeep an eye on the cancellation policy. the conference may be cancelled due to the cornoa virus outbreak. :( Although flight tickets are getting cheaper."
  }
];

/* 1.01: render tasks when document is ready or if there is any change in tasks array */
$(document).ready(function(){

	/* 1.02: remove existing todo items before rendering */
	clear();
	loop();

	/* 4.01: reflect completed tasks by checking corrsponding checkbox*/
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].completed) {
			document.getElementsByClassName("form-check-input")[i].checked = true;
		}
	}

	/* calls checkedBox on click */
	var checkboxes = document.getElementsByClassName("form-check-input");
	for (var i = 0; i < tasks.length; i++) {
		checkboxes[i].addEventListener("click", checkedBox);
	}

	/* calls clickedDelete on click */
	var deleteButtons = document.getElementsByClassName("deletetask");
	for (var i = 0; i < tasks.length; i++) {
		$(deleteButtons[i]).click(clickedDelete);
	}

	/* 6.01: add tasks using the modal dialog */
	var add = document.getElementsByClassName("addtask")
	add[0].addEventListener("click", function(){
		$("#myModal").modal("show");
	});
	
	/* triggers the submit button */
	var submit = document.getElementsByClassName("pull-left")
	submit[0].addEventListener("click", clickedSubmit);

	/* 9.01: deletes completed tasks */
	document.getElementById("deleteCompletedTasks").addEventListener("click", function(){
		var numComplete = 0;
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].completed) {
				numComplete++;
			}
		}
		/* 9:03: confirms if the user wants to delete N tasks */
		if (numComplete == 1 && window.confirm("Do you want to delete 1 task?")) {
			for (var i = 0; i < tasks.length; i++) {
				if (tasks[i].completed) {
					clickedDelete();
				}
			}
		}
		else if (window.confirm("Do you want to delete " + numComplete + " tasks?")) {
			for (var i = 0; i < tasks.length; i++) {
				if (tasks[i].completed) {
					clickedDelete();
				}
			}
		}
	});
	
	/* 7.01: use the overdue button to see overdue tasks */
	var clickedOverdue = true;
	document.getElementById("overdue").addEventListener("click", function(){
		if (clickedOverdue) {
			clickedOverdue = false;
			clear();
			/* 7.02: use the "active" class to indicate the current state (either on/off) of the overdue button */
			$("#overdue").addClass("active");
			for (var i = 0; i < tasks.length; i++) {
				if (!tasks[i].completed && checkOverdue(tasks[i])) {
					render(tasks[i]);
				}
			}
		}
		else {
			clickedOverdue = true;
			clear();
			$("#overdue").removeClass("active");
			loop();
		}
	});

	/* 8.01: use the hide completed button to hide completed tasks */
	var clickedHide = true;
  document.getElementById("hidecompleted").addEventListener("click", function(){
    if (clickedHide) {
			clickedHide = false;
			clear();
			/* 8.02: use the "active" class to indicate the current state (either on/off) of the hide completed tasks button */
			$("#hidecompleted").addClass("active");
			for (var i = 0; i < tasks.length; i++) {
				if (!tasks[i].completed) {
					render(tasks[i]);
				}
			}
		}
		else {
			clickedHide = true;
			clear();
			$("#hidecompleted").removeClass("active");
			loop();
		}
	});

});

/* clears the table */
let clear = function(){
	$("tbody").empty();
}

/* iterates through tasks array */
let loop = function(){
	for (var i = 0; i < tasks.length; i++) {
		render(tasks[i]);
	}
}

/* renders task */
let render = function(currentTask){

	/* tracks completed tasks */
	var completedTasks = false;

	/* does not render deleted tasks */
	if (currentTask == null || currentTask.deleted) {
		return;
	}

	/* task row */
	var task = document.createElement("tr");
	var taskClass = "";
	if (!currentTask.completed && checkOverdue(currentTask)){
		taskClass = "danger";
	}
	else if (currentTask.completed) {
		taskClass = "success";
	}
	task.setAttribute("id", currentTask.id);
	task.setAttribute("class", taskClass);
	$("tbody").append(task);

	/* checkbox */
	var box = document.createElement("td");
	box.setAttribute("class", "text-center");
	$(task).append(box);
	var input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	input.setAttribute("class", "form-check-input");
	input.setAttribute("value", currentTask.id);
	$(box).append(input);

	/* task name */
	var taskName = document.createElement("td");
	taskName.setAttribute("class", "text-center");
	if (taskClass == "success") {
		var thru = document.createElement("del");
		/* 1.07: if title is longer than 30 letters, display first 30 letters and then ellipsis */
		if (currentTask.title.length > 30) {
			$(thru).append(currentTask.title.substring(0, 30) + "...");
		}
		else {
			$(thru).append(document.createTextNode(currentTask.title));
		}
		$(taskName).append(thru);
	}
	else {
		if (currentTask.title.length > 30) {
			$(taskName).append(currentTask.title.substring(0, 30) + "...");
		}
		else {
			$(taskName).append(document.createTextNode(currentTask.title));
		}
	}
	$(task).append(taskName);
	
	/* note */
	var note = document.createElement("td");
	note.setAttribute("class", "text-center");
	var span = document.createElement("span");
	span.setAttribute("class", "text-right");
	$(note).append(span);
	var button = document.createElement("button");
	button.setAttribute("class", "btn btn-xs btn-warning");
	button.setAttribute("data-toggle", "collapse");
	button.setAttribute("data-target", "#note-" + currentTask.id)
	$(span).append(button);
	var span2 = document.createElement("span");
	span2.setAttribute("class", "glyphicon glyphicon-triangle-bottom");
	span2.append(document.createTextNode(" "));
	$(button).append(span2);
	$(button).append(document.createTextNode(" Note"));
	$(note.append(button));
	$(task).append(note);
		
	/* due date */
	var dueDate = document.createElement("td");
	dueDate.setAttribute("class", "text-center");
	if (currentTask != null && currentTask.dueDate != null) {
		var month = currentTask.dueDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var day = currentTask.dueDate.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var year = currentTask.dueDate.getFullYear();
		$(dueDate).append(document.createTextNode(month + "/" + day + "/" + year));
	}
	else {
		$(dueDate).append(document.createTextNode(""));
	}
	$(task).append(dueDate);
		
	/* 1.06: if overdue, row appears in red */
	if (!currentTask.completed && checkOverdue(currentTask)) {
		$(task).addClass("danger");
	}
	else if (currentTask.completed) {
		/* 3.02: completed tasks appear in green */
		$(task).addClass("success");
	}

	/* complete date */
	var dateComplete = document.createElement("td");
	dateComplete.setAttribute("class", "text-center");
	if (currentTask.completed == true) {
		completedTasks = true;
		var month = currentTask.completeDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		var day = currentTask.completeDate.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var year = currentTask.completeDate.getFullYear();
		$(dateComplete).append(document.createTextNode(month + "/" + day + "/" + year));
	}
	else {
		$(dateComplete).append(document.createTextNode(""));
	}
	$(task).append(dateComplete);

	/* delete button */
	var deleteButton = document.createElement("td");
	deleteButton.setAttribute("class", "text-center");
	var button = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "btn btn-danger btn-xs deletetask");
	button.setAttribute("alt", "Delete the task");
	button.setAttribute("value", currentTask.id);
	button.addEventListener("click", clickedDelete);
	$(deleteButton).append(button);
	var span = document.createElement("span");
	span.setAttribute("class", "glyphicon glyphicon-trash");
	$(button).append(span);

	/* email button */
	var emailButton = document.createElement("a");
	emailButton.setAttribute("target", "_blank");
	emailButton.setAttribute("href", "mailto:?body=" + currentTask.note + "&subject=" + currentTask.title);
	$(deleteButton).append(document.createTextNode("  "));
	$(deleteButton).append(emailButton);
	var button2 = document.createElement("button");
	button2.setAttribute("type", "button");
	button2.setAttribute("class", "btn btn-danger btn-xs emailtask");
	button2.setAttribute("alt", "Send an email");
	button2.setAttribute("value", currentTask.id);
	$(emailButton).append(button2);
	var span2 = document.createElement("span");
	span2.setAttribute("class", "glyphicon glyphicon-envelope");
	$(button2).append(span2);
	$(task).append(deleteButton);

  /* 2.01 & 2.02: collapsible note */
	var collapsible = document.createElement("tr");
	collapsible.setAttribute("id", "note-" + currentTask.id);
	collapsible.setAttribute("class", "collapse");
	$("tbody").append(collapsible);
	var empty = document.createElement("td");
	$(collapsible).append(empty);
	var colspan = document.createElement("td");
	colspan.setAttribute("colspan", "5");
	$(collapsible).append(colspan);
	var div = document.createElement("div");
	div.setAttribute("class", "well");
	$(colspan).append(div);
	var header = document.createElement("h3");
	$(header).append(document.createTextNode(currentTask.title));
	$(div).append(header);
	var div2 = document.createElement("div");
	$(div2).append(document.createTextNode(currentTask.note));
	$(div).append(div2);

	/* 9.02: enables/disables delete completed tasks button */
	if (completedTasks) {
		document.getElementById("deleteCompletedTasks").disabled = false;
	}
	else {
		document.getElementById("deleteCompletedTasks").disabled = true;
	}
}

/* deletes completed task from list */
let clickedDelete = function() {
	/* 4.01: confirm the user wants to delete the task */
	if (window.confirm("Are you sure?")) {
		var taskID = $(this).attr("value");
		/* 4.03: mark deleted as true */
		tasks[taskID].deleted = true;
		$(this).parents("tr").remove();
	}
};

/* checks modal input validity */
let clickedSubmit = function() {
	/* 6.03: task title is required */
	if ($("#task-title").val() == ""){
		alert("Task title is required");
	}
	else {
		/* 6.04: due date should be parsed and validated */
		if (isNaN(Date.parse($("#due-date").val()))){
			alert("Check your date format.");
		}
		else {
			/* 6.05: replace \r\n in notes area with <br> when rendered */
			
			/* 6.08: create a new element in the tasks array */
			tasks[tasks.length] = {
				id: tasks.length,
				title: $("#task-title").val(),
				dueDate: new Date($("#due-date").val()),
				completed : false,
				completeDate : null,
				createdDate: new Date(),
				deleted:false,
				note: $("#task-note").val()
			}
				
			/* clear and hide modal */
			$("#myModal").find("form").trigger("reset");
			$("#myModal").modal("hide");

			/* 6.09: render tasks in order */
			clear();
			loop();
		}
	}
};

/* compares the current date to the task's due date to determine if it is overdue */
let checkOverdue = function(task){
	//var today = new Date();
	var today = new Date(2020, 2, 1); // 03/01/2020
	return ((today - task.dueDate) > 0);
};

/* checkbox utility */
var checked = true;
var id = $(this).attr("value");
let checkedBox = function(){
	if (checked) {
		checked = false;
		$(this).parents("tr").removeClass("danger").addClass("success");
		tasks[id].completed = true;
		tasks[id].completeDate = new Date();
	}
	else {
		checked = true;
		$(this).parents("tr").removeClass("success");
		tasks[id].completed = false;
		tasks[id].completeDate = null;
	}
}
