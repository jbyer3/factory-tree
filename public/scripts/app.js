const socket = io();


window.onload = () => {
  fetch('/api/factories')
    .then(res => {
      return res.json()
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}