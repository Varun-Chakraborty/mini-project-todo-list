function editTask(element) {
    let textfield = document.createElement('input');
    textfield.setAttribute('type', 'text');
    textfield.value = element.querySelector('label').innerText;
    let task = element.querySelector('.tasks');
    task.append(textfield);
    textfield.focus();
    element.querySelector('label').remove();
}

function saveTask(element) {
    let textValue = element.querySelector('input[type="text"]').value
    if (textValue) {
        let text = document.createElement('label');
        text.innerText = textValue;
        text.setAttribute('for', element.querySelector('input[type="checkbox"]').getAttribute('id'))
        let task = element.querySelector('.tasks');
        task.append(text);
        element.querySelector('input[type="text"]').remove();
    } else {
        element.remove();
    }
}

function deleteTask(element) {
    element.remove();
}

function newTask(task, isTaskDone = false) {
    let main = document.querySelector('main');

    let taskOuter = document.createElement('div');
    taskOuter.classList.add('task-outer');

    let options = document.createElement('div');
    options.classList.add('options');
    let saveOption = document.createElement('div');
    saveOption.classList.add("material-symbols-outlined", "save");
    saveOption.innerText = 'check';
    let editOption = document.createElement('div');
    editOption.classList.add("material-symbols-outlined", "edit");
    editOption.innerText = 'edit';
    let deleteOption = document.createElement('div');
    deleteOption.classList.add("material-symbols-outlined", "delete");
    deleteOption.innerText = 'delete';
    options.append(saveOption, editOption, deleteOption);

    let tasks = document.createElement('div');
    tasks.classList.add('tasks');
    let input = document.createElement('input');
    let taskNumber = `task${main.childElementCount + 1}`;
    input.setAttribute('class', "checkbox");
    input.setAttribute('type', "checkbox");
    input.setAttribute('name', taskNumber);
    input.setAttribute('id', taskNumber);
    let label = document.createElement('label');
    label.setAttribute('for', taskNumber);
    label.innerText = task;
    tasks.append(input, label);
    taskOuter.append(tasks, options);
    if (isTaskDone) { input.checked = true; taskDone(taskOuter) };

    main.append(taskOuter);
}

function newTaskFormSubmit(task) {
    if (task) {
        newTask(task);
        assignListeners();
    };
}

function taskDone(element) {
    let inputTextContainer = element.querySelector('input[type="text"]');
    if (inputTextContainer) {
        let label = document.createElement('label');
        label.innerText = inputTextContainer.value;
        element.querySelector('.tasks').append(label);
        inputTextContainer.remove();
    }
    element.querySelector('label').style.color = 'gray';
    element.querySelector('label').style.textDecoration = 'line-through';
    element.querySelector('.edit').style.display = 'none';
    element.querySelector('.save').style.display = 'none';
}

function taskUndone(element) {
    element.querySelector('label').style.color = '';
    element.querySelector('label').style.textDecoration = '';
    element.querySelector('.edit').style.display = '';
}

function deleteAll() {
    document.querySelector('main').innerHTML = '';
    localStorage.clear();
}

function menuOpen() {
    let moreOption = document.querySelector('header>.more');
    let navBar = document.querySelector('header>nav');
    moreOption.setAttribute('id', 'open');
    moreOption.style.transform = 'rotate(90deg)';
    navBar.style.transform = 'scaleX(1)';
    document.getElementById('overlay').style.display = 'block';
}

function menuClose() {
    let moreOption = document.querySelector('header>.more');
    let navBar = document.querySelector('header>nav');
    moreOption.removeAttribute('id');
    moreOption.style.transform = '';
    navBar.style.transform = '';
    document.getElementById('overlay').style.display = 'none';
}

function assignListeners() {
    document.querySelectorAll('.task-outer').forEach(e => {
        e.addEventListener('click', evnt => {
            let classes = Array.from(evnt.target.classList);
            if (classes.indexOf('edit')>=0) {
                evnt.target.style.display = 'none';
                evnt.target.parentElement.querySelector('.save').style.display = 'block';
                editTask(evnt.target.parentElement.parentElement);
                document.querySelector('.task-outer>.tasks>input[type="text"]').addEventListener('keydown', evnt => {
                    if (evnt.key === 'Enter') {
                        evnt.target.parentElement.parentElement.querySelector('.save').style.display = '';
                        evnt.target.parentElement.parentElement.querySelector('.edit').style.display = '';
                        saveTask(evnt.target.parentElement.parentElement);
                        save();
                    }
                });
            } else if (classes.indexOf('save')>=0) {
                evnt.target.style.display = '';
                evnt.target.parentElement.querySelector('.edit').style.display = '';
                saveTask(evnt.target.parentElement.parentElement);
                save();
            } else if (classes.indexOf('delete')>=0) {
                deleteTask(evnt.target.parentElement.parentElement);
                save();
            } else if (classes.indexOf('checkbox')>=0) {
                if (evnt.target.checked) {
                    taskDone(evnt.target.parentElement.parentElement);
                } else {
                    taskUndone(evnt.target.parentElement.parentElement);
                }
                save();
            }
        });
    });

    document.querySelector('.newTask').addEventListener('click', evnt => {
        document.querySelector('.newTask-form').style.transform = 'scale(1)';
        document.querySelector('input[type="text"]#newTask').focus();
        evnt.target.style.zIndex = '1';
        document.querySelector('.newTask-form').style.zIndex = '1';
        document.getElementById('overlay').style.display = 'block';
    });

    document.querySelector('.newTask-form-submit').addEventListener('click', evnt => {
        let task = evnt.target.previousElementSibling.value;
        newTaskFormSubmit(task);
        document.querySelector('.newTask-form').style.transform = '';
        evnt.target.previousElementSibling.value = '';
        save();
        evnt.target.parentElement.style.zIndex = '';
        document.querySelector('.newTask').style.zIndex = '';
        document.getElementById('overlay').style.display = '';
    });

    document.querySelector('input[type="text"]#newTask').addEventListener('keydown', evnt => {
        if (evnt.key == 'Enter') {
            newTaskFormSubmit(evnt.target.value);
            document.querySelector('.newTask-form').style.transform = 'scale(0)';
            evnt.target.value = '';
            save();
            evnt.target.parentElement.style.zIndex = '';
            document.querySelector('.newTask').style.zIndex = '';
            document.getElementById('overlay').style.display = '';
        }
    });
    document.querySelector('header>nav>ul>.delete-all').addEventListener('click', () => {
        deleteAll();
        menuClose();
    })
    
    document.querySelector('header>.more').addEventListener('click', evnt => {
        if (evnt.target.getAttribute('id') === 'open') {
            menuClose();
            evnt.target.parentElement.style.zIndex = '';
        } else {
            menuOpen();
            evnt.target.parentElement.style.zIndex = '1';
            document.getElementById('overlay').style.display = 'block';
        }
    });
}

function save() {
    let tasks = Array.from(document.querySelectorAll('main>div>.tasks>label'))
        .map(tasks => [tasks.innerText, tasks.previousElementSibling.checked]);
    let tasksJSON = JSON.stringify({ ...tasks });
    localStorage.setItem('user1', tasksJSON);
}

function retrieve() {
    let tasksJSON = localStorage.getItem('user1');
    let tasksObj = JSON.parse(tasksJSON);
    for (const key in tasksObj) {
        newTask(tasksObj[key][0], tasksObj[key][1]);
    }
}
retrieve();
assignListeners();

function generateMultipleRandomTasks(count) {
    if (count) {
        for (let i = 0; i < count; i++) {
            newTask('task' + (i + 1), Math.round(Math.random()));
            save();
        }
    }
}
generateMultipleRandomTasks();