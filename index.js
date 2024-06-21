console.log("I am on!!");

const author = "HaRsH";
const end_quote = document.getElementById("end-quote");
const item_lst = document.getElementById("ul-list");
const text_box_inp = document.getElementById("text-box");
const save_btn = document.getElementById("save-btn");
const del_btn = document.getElementById("delete-btn");
const save_tb_btn = document.getElementById("save-tab-btn");
let task_list = {};
const pressButtons = document.getElementsByClassName("press-button");

// Display author's name
end_quote.innerHTML = `Made with 💖 by ${author} 😉`;

// Fetch tasks from local storage
task_list = JSON.parse(localStorage.getItem("all_tasks")) || {};

// Render initial task list
render_list(task_list);

// Event listeners
save_btn.addEventListener("click", function() {
    const task = text_box_inp.value.trim();
    if (task) {
        const taskId = generateUniqueId(); // Generate unique ID for each task
        task_list[taskId] = task;

        updateTaskList();
        text_box_inp.value = "";
    }
});

// Func to clear task list
del_btn.addEventListener("click", function() {
    localStorage.removeItem("all_tasks");
    task_list = {};
    render_list(task_list);
});

save_tb_btn.addEventListener("click", function() {
    chrome.tabs.query({"active": true, currentWindow: true}, function(tabs){
        const taskId = generateUniqueId(); // Generate unique ID for each task
        task_list[taskId] = tabs[0].url;

        updateTaskList(); // Update task list in local storage and render it
    });
});

// Func to render the task list
function render_list(task_list) {
    let all_records = "";
    for (taskId in task_list) {
        all_records += `<li>
                            <a href="${task_list[taskId]}" id="${taskId}" target="_blank">${task_list[taskId]}</a>
                            <button class="press-button delete-task-btn" style="transform: scale(1);">DELTE</button>
                        </li><br>`;
    }
    item_lst.innerHTML = all_records;
    attachDeleteButtonListeners();
}

// Func to update task list in local storage and render it
function updateTaskList() {
    localStorage.setItem("all_tasks", JSON.stringify(task_list));
    
    console.log("log ",JSON.stringify(task_list))
    render_list(task_list);
}

// Func to provide button effect 
for (let i = 0; i < pressButtons.length; i++) {
    const button = pressButtons[i];
    button_click_attach(button)
}

// Func to generate a unique ID
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Func to provide button effect and attach delete button listeners
function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll(".delete-task-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const listItem = button.closest("li");
            const taskId = listItem.querySelector("a").getAttribute("id");
            
            delete task_list[taskId];  // Remove the id and update task list dic
            
            listItem.remove(); // Remove the <li> element from the DOM

            // console.log(task_list)
            updateTaskList(); // Update task list in local storage and render it
        });

        button_click_attach(button)
    });
}

// Func to add button click event listener 
function button_click_attach(button){
    button.addEventListener("mousedown", function() {
        button.style.transform = "scale(0.95)"; // Scale down the button when pressed
    });

    button.addEventListener("mouseup", function() {
        button.style.transform = "scale(1)"; // Restore the button size when released
    });

}

