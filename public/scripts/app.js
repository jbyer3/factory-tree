
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
      //create li for each factory
      const li = document.createElement("li");
      //fill li with destructured info
      li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`
      //create edit button for each factory
      edit = document.createElement('button');
      edit.innerHTML = 'edit';
      li.appendChild(edit);
      edit.addEventListener('click', () => socket.emit('editron', factory));
      //create emit children button for each factory
      createChild = document.createElement('button');
      createChild.innerHTML = 'create!';
      // createChild.addEventListener('click', () => socket.emit('procreate', factory));
      createChild.addEventListener('click', () => {
        const numKids = num_children
        const factory = document.getElementById(_id).parentElement
        const list = document.createElement('ul')
        factory.appendChild(list)
        const kidsArr = [];
        for (i = 0; i < numKids; i++) {
          // const kid = document.createElement("li");
          const min = Math.ceil(lower_bound);
          const max = Math.floor(upper_bound)
          const kid = Math.floor(Math.random() * (max - min)) + min;
          kidsArr.push(kid)
        }
        console.log(kidsArr)
      });


      li.appendChild(createChild);
      const span = document.createElement('span');
      span.innerHTML = 'x';
      span.className = 'hihi';
      span.id = _id;
      li.appendChild(span);
      const list = document.querySelector('#output');
      list.appendChild(li);
      span.addEventListener('click', () => {
        socket.emit("deletron", _id);
    });
    
  }
)
socket.on('deletron', (x) => {
      const dock = document.getElementById(x)
      dock.parentElement.parentElement.removeChild(dock.parentElement)
    })

socket.on('editron', (y) => {
  console.log('frmo eidtor',y)
});


socket.on('procreate', (z) => {
  console.log(z)
  console.log
  const numKids = z.num_children
  const factory = document.getElementById(z._id).parentElement.lastChild
  const nikes = document.getElementById(`jason${z._id}`)

  fetch(`/api/factories/${z._id}`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      return res.children
    })
    .then(res => {
      console.log(res)
      // console.log(factory)
      factory.innerHTML = '';
      res.forEach(x => {
        const kid = document.createElement('li');
        kid.innerHTML = x;
        // factory.innerHTML = `<li>${x}</li>`;
        factory.appendChild(kid);
        console.log(factory)
      })
    })
});

    
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
    const {name, _id, lower_bound, upper_bound, num_children, children} = factory
    //create <li>
    const li = document.createElement("li");

    li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`

    // add edit //////
    edit = document.createElement('button');
    edit.innerHTML = 'edit';
    edit.addEventListener('click', () => socket.emit('editron', factory));
    li.appendChild(edit);
    /////////////////

    // add create ////
    createChild = document.createElement('button');
    createChild.innerHTML = 'create!';
    // createChild.addEventListener('click', () => socket.emit('procreate', factory));
    
    createChild.addEventListener('click', () => {
      const numKids = num_children;
      const factory = document.getElementById(_id).parentElement
      const list = document.createElement('ul')
      factory.appendChild(list)
      list.id = `jason${_id}`;
      // console.log(list.previousElementSibling.innerHTML)
      list.parentNode.removeChild(list.previousElementSibling)
      const kidsArr = new Array;
      // console.log('LIST IS ', factory.lastChild)
      factory.lastChild.innerHTML = '';
      for(i = 0; i < numKids; i++){
      // const kid = document.createElement("li");
      const min = Math.ceil(lower_bound);
      const max = Math.floor(upper_bound)
      const kid = Math.floor(Math.random() * (max - min)) + min;
      kidsArr.push(kid)
    }
    const fun = Array.from(kidsArr)
    // console.log(list)
    fetch(`api/factories/${_id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        children: fun,
      }),
    })
    .then(res => {return res.json()})
    // .then(res => console.log(res))
    .then(res => {
      socket.emit('procreate', res);
      fun.innerHTML = '';
      // console.log(fun.innerHTML)
    })
    });
    li.appendChild(createChild);
    /////////////////

    var span = document.createElement("span");
    span.innerHTML = 'x'
    span.className = 'hihi'
    span.id = _id
    li.appendChild(span)
    //append new <li> to #output
    const list = document.querySelector('#output')
    list.appendChild(li)
    
    span.addEventListener('click', function(){
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

    const listerino = document.createElement('ul');
    children.forEach(x => {
      const elerment = document.createElement('li');
      elerment.innerHTML = x;
      listerino.appendChild(elerment);
    })
    li.appendChild(listerino);

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
