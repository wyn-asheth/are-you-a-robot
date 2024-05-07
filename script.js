let bot = new RiveScript();

const brains = ["brain/subs.rive", "brain/brain.rive"];

bot.loadFile(brains).then(botReady).catch(botNotReady);

const message_container = document.querySelector(".messages");

const form = document.querySelector("form");

const input_box = document.querySelector("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  selfReply(input_box.value);
  input_box.value = "";
  input_box.focus();
});

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-rivescript-button]")) {
    const response = e.target.getAttribute("data-rivescript-button");
    sendUserResponse(response);
  }
});

function botReply(message) {
  message_container.innerHTML += `<div class="bot">${message}</div>`;
}

function selfReply(message) {
  message_container.innerHTML += `<div class="self">${message}</div>`;

  if (message.includes("<a href=\"#\" onclick=\"sendUserResponse('getClickableWord')\">getClickableWord</a>")) {

    const clickableText = message.match(/onclick="sendUserResponse\('(.+?)'\)">(.+?)<\/a>/);
    if (clickableText && clickableText.length === 3) {
      displayUserPrompt(clickableText[2]);
    }
  }

  bot
    .reply("local-user", message)
    .then(function (reply) {
      botReply(reply);
    })
    .then(function () {
      message_container.lastElementChild.scrollIntoView();
    });
}

function displayUserPrompt(prompt) {
  message_container.innerHTML += `<div class="prompt">${prompt}</div>`;
}



function botReady() {
  bot.sortReplies();
}

function botNotReady(err) {
  console.log("An error has occurred.", err);
}

function sendUserResponse(response) {
  bot
    .reply("local-user", response)
    .then(function (reply) {
      botReply(reply);
    })
    .then(function () {
      message_container.lastElementChild.scrollIntoView();
    });
}

