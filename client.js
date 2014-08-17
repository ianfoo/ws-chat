var id;
var d = document;
var md = {
  strong: { regex: /\*\*(\w+)\*\*/,    out: '<strong>$1</strong>' },
  em:     { regex: /\*(\w+)\*/,        out: '<em>$1</em>' },
  link:   { regex: /\[(.+)\]\(.+\)/,   out: '<a href="$2">$1</a>' },
  link2:  { regex: /(https?:\/\/\S+)/, out: '<a href="$1">$1</a>' }
}; 

var socket = io();
d.getElementById('send').onclick = sendMessage;
socket.on('registered', saveId);
socket.on('message', addMessage);

function sendMessage() {
  var el = d.getElementById('m');
  var txt = el.value;
  var msg;
  if (txt) {
    console.log(socket);
	  msg = { userId: id, message: txt };
    socket.emit('message', msg);
    addMessage(msg);
    el.value = ""; 
  }
  return false;
};

function addMessage(msg) {
  console.log(msg);
  var msgs = d.getElementById('messages');
  var newMsg = msgs.appendChild(d.createElement('li'));
  newMsg.innerHTML = msg.userId.substr(msg.userId.length-5) + 
    ": " + markdown(msg.message);
}

function saveId(payload) {
  id = payload.userId;
  console.log('Saved ID', id);
}

function markdown(msg) {
  var m = msg;
	for (type in md) {
    console.log(type, md[type].regex, md[type].out);
    m = m.replace(md[type].regex, md[type].out);
  }
  console.log(m);
  return m;
}
