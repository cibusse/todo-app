document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const showAllButton = document.getElementById('show-all');
    const showActiveButton = document.getElementById('show-active');
    const showCompletedButton = document.getElementById('show-completed');
    const clearCompletedButton = document.getElementById('clear-completed');
    const clearAllButton = document.getElementById('clear-all');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const render = () => {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';

            // Checkbox for completing tasks
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleComplete(index));

            const textSpan = document.createElement('span');
            textSpan.textContent = todo.text;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeItem(index);
            });

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(removeButton);
            todoList.appendChild(li);
        });
        updateItemsLeft();
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const showTooltip = (message) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        document.body.appendChild(tooltip);
        
        const rect = input.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

        setTimeout(() => tooltip.remove(), 2000);
    };

    const addItem = () => {
        const text = input.value.trim();

        if (text === '') {
            alert("The field is empty");
            return;
        }

        if (text.length < 3) {
            alert("The text is too short");
            return;
        }

        if (/^[^a-zA-Z]+$/.test(text)) {
            alert("Add a valid task");
            return;
        }

        todos.push({ text, completed: false });
        input.value = '';
        render();
    };

    const removeItem = (index) => {
        todos.splice(index, 1);
        render();
    };

    const toggleComplete = (index) => {
        todos[index].completed = !todos[index].completed;
        render();
    };

    const updateItemsLeft = () => {
        const count = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${count} items left`;
    };

    const filterTodos = (filter) => {
        const allTodos = document.querySelectorAll('li');
        allTodos.forEach((li, index) => {
            switch (filter) {
                case 'all':
                    li.style.display = '';
                    break;
                case 'active':
                    li.style.display = todos[index].completed ? 'none' : '';
                    break;
                case 'completed':
                    li.style.display = todos[index].completed ? '' : 'none';
                    break;
            }
        });
    };

    const clearCompleted = () => {
        todos = todos.filter(todo => !todo.completed);
        render();
    };

    const clearAll = () => {
        todos = [];
        render();
    };

    addButton.addEventListener('click', addItem);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });
    showAllButton.addEventListener('click', () => filterTodos('all'));
    showActiveButton.addEventListener('click', () => filterTodos('active'));
    showCompletedButton.addEventListener('click', () => filterTodos('completed'));
    clearCompletedButton.addEventListener('click', clearCompleted);
    clearAllButton.addEventListener('click', clearAll);

    render();
});
