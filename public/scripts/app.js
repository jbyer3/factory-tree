
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
  const form = openFormBtn.previousElementSibling;
  form.className = 'inputter-on';
  const inputs = form.children
  Array.from(inputs).forEach(x => {x.value=''})
  openFormBtn.className = 'inputter-off';
  closeFormBtn.className = 'inputter-on';
});

//factory argument is json from Factory post request below
socket.on('chat message', (factory) => {
  const {name, _id, lower_bound, upper_bound, num_children, children} = factory

  const li = document.createElement("li");

  li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`

  // add edit //////
  edit = document.createElement('button');
  edit.innerHTML = 'edit';
  edit.type = 'button';
  edit.addEventListener('click', () => socket.emit('editron', factory));
  li.appendChild(edit);
  /////////////////

  // add create ////
  createChild = document.createElement('button');
  createChild.type = 'button';
  createChild.innerHTML = 'create!';
  createChild.id = 'createbtn';

  createChild.addEventListener('click', () => {
    const numKids = num_children;
    const factory = document.getElementById(_id)
    const kidsArr = new Array;
    factory.lastChild.innerHTML = '';
    for (i = 0; i < numKids; i++) {
      const min = Math.ceil(lower_bound);
      const max = Math.floor(upper_bound)
      const kid = Math.floor(Math.random() * (max - min)) + min;
      kidsArr.push(kid)
    }
    const fun = Array.from(kidsArr)
    fetch(`api/factories/${_id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        children: fun,
      }),
    })
      .then(res => { return res.json() })
      .then(res => {
        socket.emit('procreate', res);
        fun.innerHTML = '';
      })
      .catch(err => console.log(err))
  });

      li.appendChild(createChild);
      const span = document.createElement('span');
      span.innerHTML = 'delete factory';
      span.className = 'hihi';
      span.id = _id;
      li.appendChild(span);
      const mawr = document.createElement('ul')
      li.appendChild(mawr)
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
  fetch(`api/factories/${y._id}`)
    .then(res => {
      return res.json()
    })
    .then(res => { 
      const spanner = document.getElementById(y._id).parentElement
      const form = document.createElement('form');
      form.name = 'edit-form'
      //edit name input
      const name = document.createElement('input');
      name.innerHTML = `<label>${y.name}</label>
        <input type="text"
        name="name"
        value="${y.name}">
        ${y.name}
        </input>`;
      name.placeholder = 'name'
      name.required = true;
      name.autofocus = true;
      form.appendChild(name);
      //edit lower_bound input
      const lower_bound = document.createElement('input');
      lower_bound.innerHTML = `<label>${y.lower_bound}</label>
      <input type="number"
      name="lower_bound
      value="${y.lower_bound}">
      ${y.lower_bound}
      </input>`;
      lower_bound.placeholder = 'lowerbound';
      lower_bound.type = 'number';
      lower_bound.required = true;
      form.appendChild(lower_bound);
      //edit upper_bound input
      const upper_bound = document.createElement('input');
      upper_bound.innerHTML = `<label>${y.upper_bound}</label>
        <input type="number"
        name="upper_bound"
        value="${y.upper_bound}">
        ${y.upper_bound}</input>`;
      upper_bound.placeholder = 'upperbound';
      upper_bound.type = 'number';
      upper_bound.required = true;
      form.appendChild(upper_bound);
      //edit num_children input
      const num_children = document.createElement('input');
      num_children.innerHTML = `<label>${y.num_children}</label>
        <input type="number"
        id="numbchildrenz"
        name="num_children">
        ${y.num_children}
        </input>`;
      num_children.placeholder = 'numberofchildren';
      num_children.type = 'number';
      num_children.required = true;
      num_children.max = '15';
      form.appendChild(num_children);
      //submit button 
      const submitter = document.createElement('button');
      submitter.type = 'submit';
      submitter.innerText = 'submitter'
      form.appendChild(submitter)
      
      if(spanner.childElementCount === 4){
        spanner.insertBefore(form, spanner.lastChild)
        edit.innerHTML = 'close';
      } else {
        spanner.removeChild(spanner.lastChild.previousSibling)
        edit.innerHTML = 'edit';
      }

      form.addEventListener('submit', e => {
          e.preventDefault();
            editFactory(e)
        })
    })
    .catch(err => console.log(err))
});


socket.on('procreate', (z) => {
  const factory = document.getElementById(z._id).parentElement.lastChild

  fetch(`/api/factories/${z._id}`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      return res.children
    })
    .then(res => {
      factory.innerHTML = '';
      res.forEach(x => {
        const kid = document.createElement('li');
        kid.innerHTML = x;
        factory.appendChild(kid);
      })
    })
    .catch(err => console.log(err))
});

socket.on('update', factory => {
  const editForm = document.getElementById(factory._id).nextElementSibling.nextElementSibling;

  const oldSpot = editForm.parentElement;

  ////////////////////CHAT MESSAGE COPY////////////////////////
  const {name, _id, lower_bound, upper_bound, num_children} = factory

  const li = document.createElement("li");

  li.innerHTML = `${name} :
        ${lower_bound} - ${upper_bound} will have ${num_children} children`

  // add edit //////
  edit = document.createElement('button');
  edit.innerHTML = 'edit';
  edit.type = 'button';
  edit.addEventListener('click', () => socket.emit('editron', factory));
  li.appendChild(edit);
  /////////////////

  // add create ////
  createChild = document.createElement('button');
  createChild.type = 'button';
  createChild.innerHTML = 'create!';
  createChild.id = 'createbtn';

  createChild.addEventListener('click', () => {
    const numKids = num_children;
    const factory = document.getElementById(_id)
    const kidsArr = new Array;
    factory.lastChild.innerHTML = '';
    for (i = 0; i < numKids; i++) {
      const min = Math.ceil(lower_bound);
      const max = Math.floor(upper_bound)
      const kid = Math.floor(Math.random() * (max - min)) + min;
      kidsArr.push(kid)
    }
    const fun = Array.from(kidsArr)
    fetch(`api/factories/${_id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        children: fun,
      }),
    })
      .then(res => { return res.json() })
      .then(res => {
        socket.emit('procreate', res);
        fun.innerHTML = '';
      })
      .catch(err => console.log(err))
  });

      li.appendChild(createChild);
      const span = document.createElement('span');
      span.innerHTML = 'delete factory';
      span.className = 'hihi';
      span.id = _id;
      li.appendChild(span);
      const mawr = document.createElement('ul')
      li.appendChild(mawr)
      const list = document.querySelector('#output');
      list.insertBefore(li, oldSpot.nextElementSibling);
      oldSpot.parentElement.removeChild(oldSpot)

      span.addEventListener('click', () => {
        socket.emit("deletron", _id);
    });
  ////////////////////CHAT MESSAGE COPY////////////////////////

})

    
// on page load, fetch the data from mongo
window.onload = () => {
  fetch('/api/factories')
    .then(res => {
      return res.json()
    })
    .then(addFactories)
    .catch(err => {
      console.log(err)
    })

  const form = document.querySelector("#inputter")
  form.addEventListener('submit', e =>{
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
    edit.type = 'button';
    edit.addEventListener('click', () => socket.emit('editron', factory));
    li.appendChild(edit);
    /////////////////

    // add create ////
    createChild = document.createElement('button');
    createChild.innerHTML = 'create!';
    createChild.type = 'button';
    createChild.id = "createbtn";

    createChild.addEventListener('click', () => {
      const numKids = num_children;
      const factory = document.getElementById(_id).parentElement
      const list = document.createElement('ul')
      factory.appendChild(list)
      list.id = _id;
      list.parentNode.removeChild(list.previousElementSibling)
      const kidsArr = new Array;
      factory.lastChild.innerHTML = '';
      for(i = 0; i < numKids; i++){
      const min = Math.ceil(lower_bound);
      const max = Math.floor(upper_bound)
      const kid = Math.floor(Math.random() * (max - min)) + min;
      kidsArr.push(kid)
    }
    const fun = Array.from(kidsArr)
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
    .then(res => {
      socket.emit('procreate', res);
      fun.innerHTML = '';
    })
    .catch(err => console.log(err))
    });
    li.appendChild(createChild);
    /////////////////

    var span = document.createElement("span");
    span.innerHTML = 'delete factory'
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
        .then(res => {return res})
        .then(() => {
          socket.emit('deletron', _id)
          return false;
        })
        .then(res => {return res})
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
  redirect: "manual"
  })
  .then(res => {return res.json()})
  .catch(err => console.log(err))
  //pass json to Chat Message socket function thing
  .then(res => {
    socket.emit('chat message', res)
    return false;
  })
  .then(() => {
    e.target.className = 'inputter-off';
    const offButton = document.getElementById('form-close')
    const onButton = document.getElementById('form-open')
    offButton.className = 'inputter-off';
    onButton.className = 'inputter-on'
  })
  .then(res => {return res})
  .catch(err => console.log(err));
}

function editFactory(e){
  const id = e.target.parentElement.childNodes[3].id
  let payload = {};
  //loop over inputs
  [...e.target.children].forEach(child => {
    //if child doesn't have a name.... continue....
    if (child.getAttribute("placeholder") === null) {
      return;
    }
    // fill payload object with information from valid inputs
    let key = child.getAttribute("placeholder");
    payload[key] = { value: child.value, type: child.getAttribute("type") };
  });
  fetch(`api/factories/${id}`,{
    method: 'PUT',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: payload.name.value,
      lower_bound: payload.lowerbound.value,
      upper_bound: payload.upperbound.value,
      num_children: payload.numberofchildren.value, 
    })
  })
  .then(res => {return res.json()})
  .then(res => {
    socket.emit('update', res)
  })
  .catch(err => console.log(err))
}