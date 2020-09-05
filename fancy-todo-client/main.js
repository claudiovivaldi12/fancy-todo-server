const baseUrl = 'http://localhost:3007'

$(document).ready(function() {
  checkAuth()
})

function login(event){
  event.preventDefault();
  let email = $('#login-email').val()
  let password = $('#login-password').val()

$(document).ready(function() {
  checkAuth()
})

  $.ajax(`${baseUrl}/user/login`,{
    method: 'Post',
    data:{
      email,
      password
    }
  })
  .done(response =>{
    console.log(response)
    localStorage.setItem('token',response.access_token)
    $('#login-email').val('')
    $('#login-password').val('')
    checkAuth()
  })
  .fail(err =>{
    console.log(err)
  })
  .always(_ =>{
    console.log('done ')
  })
}

$('#register-btn').click((event) =>{
  event.preventDefault();
  $('#edit-todo-page').hide()
  $('#login-page').hide()
  $('#register-page').show()
  $('#todo-all-page').hide()
  $('#create-todo-page').hide()
})

function showAddForm(){
  if(localStorage.token){
    $('#edit-todo-page').hide()
    $('#login-page').hide()
    $('#register-page').hide()
    $('#todo-all-page').hide()
    $('#create-todo-page').show()
  }
}


$('#register-submit').click((event) =>{
  event.preventDefault();
  let name = $('#register-name').val()
  let email = $('#register-email').val()
  let password = $('#register-password').val()
  $.ajax(`${baseUrl}/user/register`,{
    method: 'Post',
    data:{
      name,
      email,
      password
    }
  })
  .done(response =>{
    console.log(response)
    // localStorage.setItem('token',response.access_token)
    $('#register-name').val('')
    $('#register-email').val('')
    $('#register-password').val('')
    checkAuth()
  })
  .fail(err =>{
    console.log(err)
  })
  .always(_ =>{
    console.log('done ')
  })
})


$('#create-todo').click((event)=>{
    event.preventDefault()

    let title = $('#title').val()
    let description = $('#description').val()
    let due_date = $('#due_date').val()

    $.ajax({
        method : 'POST',
        url : `${baseUrl}/todos`,
        data :{
            title,
            description,
            due_date
        },
        headers:{
          token:localStorage.token
        }
    })
    .done(response=>{
        $('#table-todo-all').empty()
        fetchTodos()
        $('#todo-all-page').show()
        $('#create-todo-page').hide()

        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
    })
    .fail(err=>{
        console.log(err)
    })
})


function checkAuth(){
  if(localStorage.token){
    $('#edit-todo-page').hide()
    $('#login-page').hide()
    $('#register-page').hide()
    $('#todo-all-page').show()
    $('#create-todo-page').hide()
    console.log('sudah Log In')
    fetchTodos()
  }
  else{
    console.log('Belum Logged In')
    $('#login-page').show()
    $('#register-page').hide()
    $('#todo-all-page').hide()
    $('#edit-todo-page').hide()
    $('#create-todo-page').hide()
  }
}

function logout(){
  localStorage.clear()
  checkAuth()
}

function fetchTodos(){
  $.ajax(`${baseUrl}/todos`,{
    method:'GET',
    headers:{
      token: localStorage.token
    }
  }).done(response =>{
    $('#table-todo-all').empty()
    $('#table-todo-all').append(`<tr>
      <th>Title</th>
      <th>Description</th>
      <th>Status</th>
      <th>Due Date</th>
      <th>Author</th>
      <th>Action</th>
      </tr>`)
    response.forEach((todo) => {
      let template = `<tr>
          <th>${todo.title}</th>
          <th>${todo.description}</th>
          <th>${todo.status}</th>
          <th>${todo.due_date}</th>
          <th>${todo.User.name}</th>
          <th><button onclick="deleteTodos(${todo.id})" id="delete">Delete</button> || <button onclick="showEdit(${todo.id})" id="edit">Edit</button></th>
      </tr>`
      $('#table-todo-all').append(template)
    });

    console.log(response)
  })
  .fail(err =>{
    console.log(err)
  })
  .always(_ =>{
    console.log('done')
  })
}


function afterDelete(){
  $('#table-todo-all').empty()
  fetchTodos()
}



function deleteTodos(id){
  // checkAuth()
  $.ajax(`${baseUrl}/todos/${id}`,{
    method: 'DELETE',
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    console.log('done delete')
    afterDelete()
  })
  .fail(err =>{
    console.log(err)
  })
  .always(_ =>{
    console.log('done')
  })
}



function showEdit(id){
  $('#edit-todo-page').show()
  $('#login-page').hide()
  $('#register-page').hide()
  $('#todo-all-page').hide()
  $('#create-todo-page').hide()
  $.ajax(`${baseUrl}/todos/${id}`,{
    method:'GET',
    headers:{
      token: localStorage.token
    }
  }).done(response =>{
    $('#table-edit-todos').empty()
    if(response.status == "Not Yet"){
      $('#table-edit-todos').append(`
        <tr>
            <td><label for="title">Title:</label></td>
            <td><input type="text" name="title" id="edit-title" value="${response.title}"></td>
        </tr>
        <tr>
            <td><label for="description">Description:</label></td>
            <td><textarea name="description" id="edit-description" cols="32" rows="1">${response.description}</textarea></td>
        </tr>
        <tr>
            <td><label for="status">Status:</label></td>
            <td>
              <select name = "status" id="edit-status">
                <option value="Not Yet" selected>Not Yet</option>
                <option value="Done">Done</option>
              </select>
            </td>
        </tr>
        <tr>
          <td><button id="edit-todo" onclick="editTodos(${response.id})">Edit Todo</button></td>
        </tr>
        `)
    }
    else{
      $('#table-edit-todos').append(`
        <tr>
            <td><label for="title">Title:</label></td>
            <td><input type="text" name="title" id="edit-title" value="${response.title}"></td>
        </tr>
        <tr>
            <td><label for="description">Description:</label></td>
            <td><textarea name="description" id="edit-description" cols="32" rows="1">${response.description}</textarea></td>
        </tr>
        <tr>
            <td><label for="status">Status:</label></td>
            <td>
              <select name = "status" id="edit-status">
                <option value="Not Yet" selected>Not Yet</option>
                <option value="Done">Done</option>
              </select>
            </td>
        </tr>
        <tr>
            <td><button id="edit-todo" onclick="editTodos(${response.id})">Edit Todo</button></td>
        </tr>
        `)
    }
    // $('#edit-title').val(response.title)
    // $('#edit-status').val(response.status)
    // $('#edit-description').val(response.description)
    // localStorage.setItem('id',response.id)
  }).fail(err =>{
    console.log(err)
  })
}

function editTodos(id){
  event.preventDefault();
  console.log('ini dai function editTodos',id)
  let title = $('#edit-title').val()
  let description = $('#edit-description').val()
  let status = $('#edit-status').val()
  $.ajax({
      method : 'PUT',
      url : `${baseUrl}/todos/${id}`,
      data :{
          title,
          description,
          status
      },
      headers:{
        token:localStorage.token
      }
  })
  .done(response =>{
    console.log('done edit')
    checkAuth()
  })
  .fail(err =>{
    console.log(id)
    console.log(err)
  })
  .always(_ =>{

  })
}
