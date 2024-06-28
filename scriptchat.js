let socket;
    let username;

    document.getElementById('join-form').addEventListener('submit', (e) => {
      e.preventDefault();
      username = document.getElementById('username').value;
      socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () => {
        socket.send(`join ${username}`);
        document.getElementById('join-form').style.display = 'none';
        document.getElementById('message-form').style.display = 'block';
        // Add a welcome message for the new user
        document.getElementById('chat-log').innerHTML += `<p>You have joined the chat!</p>`;
      };
    });

    document.getElementById('message-form').addEventListener('submit', (e) => {
      e.preventDefault();
      let message = document.getElementById('message').value;
      socket.send(message);
      document.getElementById('chat-log').innerHTML += `<p>${username}: ${message}</p>`;
      document.getElementById('message').value = '';
    });

    socket.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith('**')) { // Handle system messages (e.g., user joined/left)
        document.getElementById('chat-log').innerHTML += `<p>${message}</p>`;
      } else { // Handle regular messages
        document.getElementById('chat-log').innerHTML += `<p>${message}</p>`;
      }
      document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight;
    };

    socket.onclose = () => {
      document.getElementById('chat-log').innerHTML += `<p>Disconnected from the chat room.</p>`;
    };