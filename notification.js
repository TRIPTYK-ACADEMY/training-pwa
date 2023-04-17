const button = document.getElementById('btnNotif');

button.addEventListener('click', () => {
  console.log(Notification.permission);
  if (Notification.permission === 'granted') {
    createNotification('Ceci est une notification', { body: 'Push hands up'})
  } else {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        createNotification('Ceci est une notification', { body: 'Push hands up'})
      }
    });
  }
});

function createNotification(title, content) {
    const notification = new Notification(title, {...content, icon: './icons/icon-192.png'});
  
    notification.addEventListener('click', () => {
      window.location.href = 'https://technocite.be';
    });
}