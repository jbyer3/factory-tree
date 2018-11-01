
const socket = io();

//hide form button//
const closeFormBtn = document.querySelector('#form-close')
closeFormBtn.addEventListener('click', () => {
  const form = closeFormBtn.previousElementSibling.previousElementSibling;
  form.className = 'inputter-off';
  openFormBtn.className = 'inputter-on';
  closeFormBtn.className = 'inputter-off';
})

const openFormBtn = document.querySelector("#form-open");
openFormBtn.addEventListener("click", () => {
  // openFormBtn.parentNode.className = "inputter-on";
  const form = openFormBtn.previousElementSibling;
  form.className = 'inputter-on';
  const inputs = form.children
  Array.from(inputs).forEach(x => {x.value=''})
  // console.log(form.childNodes)
  openFormBtn.className = 'inputter-off';
  closeFormBtn.className = 'inputter-on';
});

//factory argument is json from Factory post request below
socket.on('chat message', (factory) => {
      // console.log("this factory is :!!", factory)
      //destructure factory for view creation
      const {name, _id, lower_bound, upper_bound, num_children} = factory
      const li = document.createElement("li");
      li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`
      const span = document.createElement('span');
      span.innerHTML = 'x';
      span.className = 'hihi';
      span.id = _id
      li.appendChild(span)
      const list = document.querySelector('#output')
      list.appendChild(li)
      span.addEventListener('click', function() {
        socket.emit("deletron", _id);
    })
  }
)
socket.on('deletron', (x) => {
      const dock = document.getElementById(x)
      dock.parentElement.parentElement.removeChild(dock.parentElement)
    })
    
// on page load, fetch the data from mongo
window.onload = () => {
  console.log('LOADED')
  fetch('/api/factories')
    .then(res => {
      return res.json()
    })
    .then(addFactories)
    .catch(err => {
      console.log(err)
    })

  const form = document.querySelector("#inputter")
  form.addEventListener('submit', (e) =>{
    e.preventDefault();
    createFactory(e)})
}

function addFactories(factories){
  //add factories to
  factories.forEach(factory => {
    // destructure the factory
    const {name, _id, lower_bound, upper_bound, num_children} = factory
    //create <li>
    const li = document.createElement("li");
    //fill <li>
    // li.innerHTML = name + '<span>x</span>';
    // li.innerHTML = name;
    li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`
    var span = document.createElement("span");
    span.innerHTML = 'x'
    span.className = 'hihi'
    span.id = _id
    li.appendChild(span)
    //append new <li> to #output
    const list = document.querySelector('#output')
    list.appendChild(li)
    
    span.addEventListener('click', function(){
      // this.parentNode.parentNode.removeChild(this.parentNode);
      // const el = span.target.parentElement
      // console.log(span.target.parentElement)
      // socket.emit('deletron', _id)
      fetch(`api/factories/${_id}`, {
        method: "delete"
      })
        // .then(res => res.json())
        .then(() => {
          socket.emit('deletron', _id)
          // console.log("id is blahlbha",_id);
          return false;
        })
        .catch(err => console.log(err))
    })
  })
}

function createFactory(e){
  //create object to pass to post request
  let payload = {};
  //loop over inputs
  [...e.target.children].forEach(child => {
    //if child doesn't have a name.... continue....
    if (child.getAttribute('name') === null) {
      return;
    }
    // fill payload object with information from valid inputs
    let key = child.getAttribute('name');
    payload[key] = { value: child.value, type: child.getAttribute('type') };
  });
  // console.log("payload is: ", payload);
  fetch("api/factories", {
  method: "POST",
  mode: "cors",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    name: `${payload.name.value}`,
    lower_bound: `${payload.lower_bound.value}`,
    upper_bound: `${payload.upper_bound.value}`,
    num_children: `${payload.num_children.value}`,
  }),
  //not sure what this does...
  redirect: "manual"
  })
  .then(res => {return res.json()})
  .catch(err => console.log(err))
  //pass json to Chat Message socket function thing
  .then(res => {
    socket.emit('chat message', res)
    // console.log(res);
    return false;
  })
  .catch(err => console.log(err));
}
