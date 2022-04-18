const messagesContainer = document.querySelector("main");
var entryInput = null;
let userName = null;

function startApp() {
  enterParticipantName();
  setInterval(getMessages, 3000);
}

function enterParticipantName() {
  let entryInput = document.querySelector("#entry-input");
  let name = entryInput.value;
  userName = name;
  let participantPostObject = {
    name: name,
  };

  if (name != null && name != undefined && name != "") {
    const participantNamePost = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/participants",
      participantPostObject
    );

    participantNamePost.catch(postErrors);

    participantNamePost.then(callSendStatusAndToggle);
  } else {
    alert("Por favor, digite um nome válido");
  }
}

function postErrors() {
  alert("O nome de usuário já está sendo usado, por favor informe outro.");
}

function callSendStatusAndToggle() {
  setInterval(participantStatus, 5000);
  EntryScreenToggle();
  setInterval(getMessages, 3000);
}

function participantStatus() {
  let participantPostObject = {
    name: userName,
  };

  const participantStatusPost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    participantPostObject
  );
  participantStatusPost.then(console.log("Status: Online"));

  participantStatusPost.catch(() => {
    alert("Você foi desconectado do servidor, por favor, entre novamente.");
    window.location.reload();
  });
}

function getParticipants() {
    const promise = axios.get(
      "https://mock-api.driven.com.br/api/v6/uol/participants"
    );
  
    promise.then(listParticipants);
  }

  function listParticipants(participants) {
    var asideMenu = document.querySelector(".aside-list");
    asideMenu.innerHTML = "";
    for (i = 0; i < participants.data.length; i++) {
      let list = participants.data[i].name;

        var user = `
                <li>
                ${list}
                </li>
              `;
              
        asideMenu.innerHTML += user;
      
    }
  }

function getMessages() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promise.then(loadMessages);
}

function scrollIntoView() {
  const toView = document.querySelector("main").lastElementChild;
  toView.scrollIntoView();
}

function loadMessages(answer) {
  var entryInput = document.querySelector("#entry-input");
  messagesContainer.innerHTML = "";
  var name = entryInput.value;
  for (i = 0; i < answer.data.length; i++) {
    let type = answer.data[i].type;
    let time = answer.data[i].time;
    let from = answer.data[i].from;
    let to = answer.data[i].to;
    let text = answer.data[i].text;

    if (to == "Todos" || to == name || from == name) {
      var message = `
            <div class="msg ${type}">
            <div class="message-inner-container">
            <span class="time">(${time})</span>
            <span class="message-span">
            de <span class="from">${from}</span> para <span class="to">${to}: </span>${text}
            </span>
            </div>
            </div>
            `;
      messagesContainer.innerHTML += message;
      scrollIntoView();
    }
  }
}

function EntryScreenToggle() {
  mainToggle = document.querySelector(".main-page");
  entryToggle = document.querySelector(".entry-screen");
  mainToggle.classList.toggle("hidden");
  entryToggle.classList.toggle("hidden");
}

function sendMessage() {
  let from = userName;
  let to = "Todos";
  let text = document.querySelector("#message-input").value;
  let type = "message";

  let messagePostObject = {
    from: `${from}`,
    to: `${to}`,
    text: `${text}`,
    type: `${type}`,
  };

  const messagePost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    messagePostObject
  );

  document.querySelector("#message-input").value = "";
  // messagePost.then(loadMessages);
  messagePost.catch(postErrors);
}

const inputMessage = document.querySelector("#message-input");
inputMessage.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});