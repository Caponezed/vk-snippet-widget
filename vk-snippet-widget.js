let vkWidget = createVkSnippetWidget();

function createVkSnippetWidget() {
  let vkSnippetWidget = document.createElement("div");
  vkSnippetWidget.classList.add("vk-snippet-widget");

  let vkTextBox;
  let sendButton;

  let voiceButtonIconClass = `im-send-btn_audio`;
  let sendButtonIconClass = `im-send-btn_send`;

  let inputContainer = createNode({ tagType: "div", sendSnippet: false });
  let buttonContainer = createNode({ tagType: "div", sendSnippet: false });

  // SELECT
  let pagePrice = createNode({ tagType: "select", sendSnippet: false });
  let pagePriceOptions = {
    A4: 5,
    "A4 Matte": 13,
    "A4 Glossy": 15,
    "A4 Glossy Thin": 13,
    "A4 Glossy Sticker": 50,
    "10x15 Glossy/Matte": 13,
  };
  let optionsKeys = Object.keys(pagePriceOptions);
  for (let i = 0; i < optionsKeys.length; i++) {
    let pagePriceOption = createNode({ tagType: "option", sendSnippet: false });
    pagePriceOption.textContent = optionsKeys[i];
    pagePriceOption.value = pagePriceOptions[optionsKeys[i]];
    pagePrice.append(pagePriceOption);
  }

  // PAGE COUNT INPUT
  let pageCountInput = createNode({ tagType: "input" });
  pageCountInput.placeholder = "Количество страниц";
  pageCountInput.addEventListener("keydown", sendMessageOnKeyDown);
  pageCountInput.addEventListener("input", () => {
    let pageCount = pageCountInput.value;
    pageCount
      ? (input.value = pageCount * pagePrice.value)
      : (input.value = "");
    handleInput();
    if (!vkTextBox.innerHTML) pageCount.value = "";
  });

  // INPUT
  let input = createNode({ tagType: "input" });
  input.addEventListener("input", handleInput);
  input.placeholder = "Стоимость печати (₽)";

  let moneyButton = createNode({
    tagType: "button",
    name: "💸",
    sendSnippet: false,
    sendNonEmptyOnClick: true,
  });
  let clearButton = createNode({
    tagType: "button",
    name: "❌",
    sendSnippet: false,
  });
  let questionButton = createNode({
    tagType: "button",
    name: "❓",
    messageToSend:
      "Нужно ли: <br/> - дыроколить 🕳️ <br/> - скреплять скрепкой 📎 или степлером 〰 <br /> <br /> Нужен ли скоросшиватель? 🗂️ (20₽ шт.)",
  });
  let iPrintButton = createNode({
    tagType: "button",
    name: "🖨️",
    messageToSend:
      "Печатаю 🖨️ (ˉ﹃ˉ) <br/> - цвет 🎨 <br/> - чб ⚫ <br/> - фото 🖼️(матовое, глянцевое) <br/> - скрепки 📎 <br/> - скоросшиватели 🗂️ <br/> - файлики 📄 <br/> ",
  });
  let doneButton = createNode({
    tagType: "button",
    name: "👍",
    messageToSend:
      "Всё готово ✅ <br/> Можешь приходить в комнату 5403 ╰(*°▽°*)╯",
  });

  vkSnippetWidget.append(inputContainer);
  vkSnippetWidget.append(buttonContainer);

  inputContainer.append(pageCountInput);
  inputContainer.append(pagePrice);
  inputContainer.append(input);
  inputContainer.append(moneyButton);

  buttonContainer.append(clearButton);
  buttonContainer.append(questionButton);
  buttonContainer.append(iPrintButton);
  buttonContainer.append(doneButton);

  function createNode({
    tagType = "div",
    name = "",
    messageToSend = "",
    sendSnippet = true,
    sendNonEmptyOnClick = false,
  }) {
    try {
      let node = document.createElement(tagType);
      node.textContent = name;
      let cssNodeClass = node.tagName.toLowerCase();
      node.classList.add(`vk-snippet-widget__${cssNodeClass}`);

      switch (true) {
        case node.tagName == "INPUT": {
          node.type = "number";
          node.addEventListener("keydown", sendMessageOnKeyDown);
          break;
        }
        case node.tagName == "BUTTON": {
          node.addEventListener("click", () => {
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
            pageCountInput.value = "";
          });
          break;
        }
      }

      return node;
    } catch (err) {
      return err;
    }
  }
  function addVkWidget() {
    try {
      let vkRightMenu = document.querySelector(
        "#content > div > div.im-right-menu > div.page_block.ui_rmenu._im_right_menu.ui_rmenu_pr"
      );
      vkTextBox = document.querySelector("div[role='textbox']");
      sendButton = document.querySelector(
        "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w > div.im-page--chat-input._im_chat_input_w > div.im-chat-input.clear_fix._im_chat_input_parent > div.im-chat-input--textarea.fl_l._im_text_input._emoji_field_wrap._voice_field_wrap > div.im-chat-input--txt-wrap._im_text_wrap > button"
      );
      sendButton.addEventListener("click", () => {
        if (input.value) {
          input.value = "";
          pageCountInput.value = "";
        }
      });
      if (!vkRightMenu) return;
      vkRightMenu.append(vkWidget);
    } catch (err) {
      return err;
    }
  }

  // Event handlers
  function handleInput() {
    let targetValue = input.value;
    vkTextBox.click();
    vkTextBox.innerHTML = `${targetValue}₽ за ${pageCountInput.value} ед. ${
      optionsKeys[pagePrice.selectedIndex]
    } на 89201006977 ( Тинькофф, сбербанк ) или наличными.`;
    if (!targetValue) vkTextBox.textContent = "";
    if (vkTextBox.innerHTML) {
      sendButton.classList.remove(voiceButtonIconClass);
      sendButton.classList.add(sendButtonIconClass);
    } else {
      sendButton.classList.remove(sendButtonIconClass);
      sendButton.classList.add(voiceButtonIconClass);
    }
  }
  function sendMessageOnKeyDown(event) {
    if (event.keyCode === 13 && event.target.value) {
      sendButton.click();
      event.target.value = "";
    }
  }

  // Adds a widget with CTRL + SHIFT (any) to the page if it hasn`t showed up
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey) addVkWidget(e);
  });
  // Adds a widget to the page as the page is fully loaded and if VK messages are open (and if nothing is broken)
  window.addEventListener("load", (e) => addVkWidget(e));

  return vkSnippetWidget;
}
