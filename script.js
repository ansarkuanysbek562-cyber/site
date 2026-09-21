document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat window
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Add a message to the UI
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle sending a message
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Display user message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Add loading indicator
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.textContent = '...печатает...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Call the backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Remove loading indicator
            document.getElementById(loadingId).remove();

            if (response.ok) {
                appendMessage(data.reply, 'bot');
            } else {
                appendMessage('Извините, произошла ошибка: ' + (data.error || 'Неизвестная ошибка'), 'bot');
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById(loadingId).remove();
            appendMessage('Извините, не удалось подключиться к серверу.', 'bot');
        }
    }

    // Event listeners for sending
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
