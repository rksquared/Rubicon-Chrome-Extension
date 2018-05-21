import * as io from 'socket.io-client';

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: 'auth.html'});
});

window.onload = () => {
  const socket = io('http://localhost:3005');

  socket.on('connect', (data) => {
    console.log(data);
    socket.on('graphData', console.log)
  })

}