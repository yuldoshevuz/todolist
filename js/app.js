const formCreate = document.getElementById('form-create')
const formEdit = document.getElementById('form-edit')
const listGroupTodo = document.getElementById('list-group-todo')
const notFoundWrapper = document.getElementById('notfound-wrapper')
// const messageCreate = document.getElementById('message-create')
const time = document.getElementById('time')
const modal = document.getElementById('modal')
const overlay = document.getElementById('overlay')
/* time elements */
const fullDay = document.getElementById('full-day')
const hourEl = document.getElementById('hour')
const minuteEl = document.getElementById('minute')
const secondEl = document.getElementById('second')
const closeEl = document.getElementById('close')
// edit and delete icons
const editIcon = document.getElementById('edit-icon')
const deleteIcon = document.getElementById('delete-icon')

// date and time
function timeDateFunc() {
    // date
    const date = new Date()
    const setDay = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const setMonth = date.getMonth() < 10 ? '0' + (date.getMonth() +1): date.getMonth()
    const month = date.getMonth()
    const months = [
        'January',
        'February',
        'March',
        'Aprel',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const setYear = date.getFullYear()
    //time
    const setHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const setMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const setSeconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    fullDay.textContent = `${setDay} ${months[month]} ${setYear}`
    hourEl.textContent = setHours
    minuteEl.textContent = setMinutes
    secondEl.textContent = setSeconds
    
    return `${setHours}:${setMinutes} ${setDay}.${setMonth}.${setYear}`
}

setTimeout(() => {
    setInterval(() => {
        timeDateFunc()
    }, 500)
}, 500)

// check todos
function checkTodo() {
    let todos;
    if (JSON.parse(localStorage.getItem('list')))
        todos = JSON.parse(localStorage.getItem('list'))
    else todos = []
    return todos
}
let todos = checkTodo()

// set todos
function setTodos() {
    localStorage.setItem('list', JSON.stringify(todos))
}

function showTodos() {
    listGroupTodo.innerHTML = ''
    todos.forEach((todo, i) => {
        listGroupTodo.innerHTML += `
        <li ondblclick=(complateTodo(${i})) class="list-group-item d-flex justify-content-between ${todo.complated == true ? 'complated' : ''}">
          ${todo.text}
          <span class="todos-icons">
            <span class="todos-time opacity-50 me-2">
              ${todo.time}
            </span>
            <img onclick=(modalShow(${i})) id="edit-icon" src="./img/edit.svg" alt="edit icon" width="25px" height="25px">
            <img onclick=(deleteTodo(${i})) id="delete-icon" src="./img/delete.svg" alt="delete icon" width="25px" height="25px">
          </span>
        </li>
        `
    })
}

// todos not found
function notFound() {
    listGroupTodo.innerHTML += `
    <div class="text-center text-danger">
        Todos not found, please create a todo
    </div>`
}

// check out the todos
function checkOutTodos() {
    if (todos.length) {
        showTodos()
    } else {
        notFound()
    }
}

checkOutTodos()

// error message
function errorMessage(id, message) {
    document.getElementById(id).textContent = message
    setTimeout(() => {
        document.getElementById(id).textContent = ''
    }, 2500)
}

// add todo
formCreate.addEventListener('submit', (e) => {
    e.preventDefault()
    const todosText = formCreate['input-create'].value.trim()
    formCreate.reset()
    
    if (todosText) {
        todos.push({
            text: todosText,
            time: timeDateFunc(),
            complated: false,
        })
        setTodos()
        showTodos()
    } else {
        errorMessage('message-create', 'Please, enter some text...')
    }
})

// delete todo
function deleteTodo(i) {
    const delTodo = todos.filter((todo, id) => {
        return id != i
    })
    todos = delTodo
    setTodos()
    showTodos()
    checkOutTodos()
}

// edit todo
let todoIndex;
function modalShow(i) {
    open()
    todoIndex = i
}

function editTodo() {
    const editingTodo = todos.filter((todo, i) => {
        return i == todoIndex
    })
    const newTodoText = formEdit['input-edit'].value.trim()
    
    editingTodo.forEach((newTodo) => {
        if (newTodoText.length && newTodoText != newTodo.text) {
            newTodo.text = newTodoText
            newTodo.time = `<small>edited</small> ${timeDateFunc()}`
            formEdit.reset()
            modal.classList.add('hidden')
            overlay.classList.add('hidden')
        } else if (newTodoText == newTodo.text) {
            errorMessage('message-edit', 'This todo exists, please enter a new todo text...')
        } else {
            errorMessage('message-edit', 'Please enter new todo text...')
        }
    })
}


formEdit.addEventListener('submit', (e) => {
    e.preventDefault()
    editTodo()
    setTodos()
    showTodos()
    checkOutTodos()
})

function close() {
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
}
function open() {
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
}

// close modal
closeEl.addEventListener('click', (e) => {
    close()
})
overlay.addEventListener('click', (e) => {
    close()
})

// complated
function complateTodo(i) {
    const complated = todos.map((todo, id) => {
        if (i == id) {
            return {...todo, complated: todo.complated == true ? false : true}
        } else {
            return {...todo}
        }
    })
    todos = complated
    setTodos()
    showTodos()
}