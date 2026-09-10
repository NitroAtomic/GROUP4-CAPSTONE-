const chatbotLoaderScript = document.currentScript;

const chatbotWidgetPath = new URL(
    "../chatbot/chatbot-widget.html",
    chatbotLoaderScript.src
);

fetch(chatbotWidgetPath)
    .then(response => {
        if (!response.ok) {
            throw new Error(
                `Failed to load chatbot widget: ${response.status}`
            );
        }

        return response.text();
    })
    .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);

        const chatbotPanel = document.getElementById("chatbot-panel");

        const chatbotFloatingButton = document.querySelector(
            ".chatbot-floating-button"
        );

        const chatbotCloseButton = document.querySelector(
            ".chatbot-close-button"
        );

        const chatbotMessageForm = document.querySelector(
            ".chatbot-message-form"
        );

        const chatbotMessageInput = document.getElementById(
            "chatbot-message-input"
        );

        const chatbotConversation = document.getElementById(
            "chatbot-conversation"
        );


        /* =========================
           Open Chatbot
           ========================= */

        chatbotFloatingButton.addEventListener("click", () => {
            chatbotPanel.classList.add("chatbot-panel-open");
            chatbotMessageInput.focus();
        });


        /* =========================
           Close Chatbot
           ========================= */

        chatbotCloseButton.addEventListener("click", () => {
            chatbotPanel.classList.remove("chatbot-panel-open");
        });


        /* =========================
           Message Submission
           ========================= */

        chatbotMessageForm.addEventListener("submit", event => {
            event.preventDefault();

            const userMessage = chatbotMessageInput.value.trim();

            if (!userMessage) {
                return;
            }

            const userMessageElement = document.createElement("div");

            userMessageElement.classList.add(
                "chatbot-message",
                "chatbot-user-message"
            );

            userMessageElement.textContent = userMessage;

            chatbotConversation.appendChild(userMessageElement);

            chatbotMessageInput.value = "";

            chatbotConversation.scrollTop =
                chatbotConversation.scrollHeight;
        });
    })
    .catch(error => {
        console.error("Failed to load chatbot widget:", error);
    });