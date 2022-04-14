const messagesContainer = document.querySelector("main");
let userName = null;

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
}