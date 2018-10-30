const socket = io();

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
  form.addEventListener('submit', (e) =>{
    e.preventDefault();
    createFactory(e)})

  $('span').on('click', function(){
    console.log('jquery click')
  })
}

function addFactories(factories){
  //add factories to
  factories.forEach(factory => {
    // destructure the factory
    const {name, _id} = factory
    //create <li>
    const li = document.createElement("li");
    //fill <li>
    // li.innerHTML = name + '<span>x</span>';
    li.innerHTML = name;
    const span = document.createElement("span");
    span.innerHTML = 'x'
    li.appendChild(span)
    //append new <li> to #output
    const list = document.querySelector('#output')
    list.appendChild(li)
    span.addEventListener('click', function(){
      this.parentNode.parentNode.removeChild(this.parentNode);
      console.log(this.parentElement, _id)
      fetch(`api/factories/${_id}`, {
        method: "DELETE",
      })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    })
  })

}

function createFactory(e){
  let payload = {};
  [...e.target.children].forEach(child => {
    if (child.getAttribute('name') === null) {
      return;
    }
    let key = child.getAttribute('name');
    payload[key] = { value: child.value, type: child.getAttribute('type') };
  });
  console.log("payload is: ", payload);
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
  .catch(err => console.log(err));
}
