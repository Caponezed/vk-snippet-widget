let vkWidget = createVkSnippetWidget();
let input = document.querySelector(".vk-snippet-widget__input");
let vkTextBox;
let sendButton;
function createVkSnippetWidget() {
  let vkSnippetWidget = document.createElement("div");
  vkSnippetWidget.classList.add("vk-snippet-widget");

  let inputContainer = createNode({ nodeType: "div" });
  let buttonContainer = createNode({ nodeType: "div" });

  let input = createNode({ nodeType: "input" });

  let clearButton = createNode({
    nodeType: "button",
    name: "❌",
    sendSnippet: false,
  });
  let questionButton = createNode({
    nodeType: "button",
    name: "❓",
    messageToSend:
      "Нужно ли дыроколить, скреплять скрепкой или степлером? (Бесплатно)<br>Нужен ли скоросшиватель? (15₽ шт.)",
  });
  let doneButton = createNode({
    nodeType: "button",
    name: "👍",
    messageToSend: "Всё готово, можешь приходить в комнату 5403 ╰(*°▽°*)╯",
  });
  let moneyButton = createNode({
    nodeType: "button",
    name: "💸",
    sendSnippet: false,
    sendNonEmptyOnClick: true,
  });

  buttonContainer.append(clearButton);
  buttonContainer.append(questionButton);
  buttonContainer.append(doneButton);

  inputContainer.append(input);

  inputContainer.append(moneyButton);
  vkSnippetWidget.append(inputContainer);
  vkSnippetWidget.append(buttonContainer);

  function createNode({
    nodeType = "div",
    name = "",
    messageToSend = "",
    sendSnippet = true,
    sendNonEmptyOnClick = false,
  }) {
    try {
      let node = document.createElement(nodeType);
      if (node.tagName == "INPUT") {
        node.type = "number";
        node.placeholder = "Стоимость печати (₽)";

        node.addEventListener("input", handleInput);
        node.addEventListener("keydown", sendMessageOnKeyDown);
      }

      node.textContent = name;
      let cssNodeClass = node.tagName.toLowerCase();
      node.classList.add(`vk-snippet-widget__${cssNodeClass}`);

      if (node.tagName == "BUTTON")
        node.addEventListener("click", (event) => {
          vkTextBox.click();
          vkTextBox.innerHTML = messageToSend;
          if (sendSnippet) sendButton.click();
          if (sendNonEmptyOnClick) {
            if (!input.value) return;
            vkTextBox.innerHTML = `${input.value}₽ на 89201006977 ( Тинькофф, сбербанк ) или наличными.`;
            sendButton.click();
            setTimeout(() => (vkTextBox.textContent = ""), 0);
          }
          input.value = "";
        });

      return node;
    } catch (err) {
      return err;
    }
  }

  // Event handlers
  function handleInput(event) {
    let targetValue = event.target.value;
    vkTextBox.click();
    vkTextBox.innerHTML = `${targetValue}₽ на 89201006977 ( Тинькофф, сбербанк ) или наличными.`;
    if (!targetValue) vkTextBox.textContent = "";
  }
  function sendMessageOnKeyDown(event) {
    if (event.keyCode === 13 && input.value) {
      sendButton.click();
      input.value = "";
    }
  }
  // -----

  return vkSnippetWidget;
}

function addVkWidget(e) {
  let vkRightMenu = document.querySelector(
    "#content > div > div.im-right-menu"
  );
  vkTextBox = document.querySelector("div[role='textbox']");
  sendButton = document.querySelector(
    "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w > div.im-page--chat-input._im_chat_input_w > div.im-chat-input.clear_fix._im_chat_input_parent > div.im-chat-input--textarea.fl_l._im_text_input._emoji_field_wrap._voice_field_wrap > div.im-chat-input--txt-wrap._im_text_wrap > button"
  );

  if (!vkRightMenu) return;
  vkRightMenu.append(vkWidget);
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey) addVkWidget(e);
});

window.addEventListener("load", (e) => {
  addVkWidget(e);
});
