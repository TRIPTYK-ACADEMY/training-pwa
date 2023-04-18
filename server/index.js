const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const differenceInMinutes = require('date-fns/differenceInMinutes')
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8000;

const publicVapidKey = "BFGNelRiLJgHLvUB7tMHYtAh0RPLifoYD55KOWBtCA2h0Tu8l4AKYIaGylPjdM3KfJxjPx2X84UFjV3jL5BMLGc";
const privateVapidKey = "6TXz0GbQbyHKFJK7wsGcb9qoQF5bza63Bn_JFtojYgU";

app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
app.use(function(req, res, next) {
  const start = Date.now();
  const { method, url} = req;

  res.on('finish', function() {
    const elapsedTime = Date.now() - start;
    const { statusCode } = res;

    console.log(`${method} ${url} - ${statusCode} - ${elapsedTime}ms`);
  });

  next();
});

webpush.setVapidDetails("mailto:sebastien@triptyk.eu", publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    fs.writeFileSync('./subscribe-token.json', JSON.stringify(subscription));
    res.status(201).json({});
})

app.post('/notification', (req, res) => {
  const payload = JSON.stringify(req.body);
  if (fs.existsSync('./subscribe-token.json')) {
    const subscription = JSON.parse(fs.readFileSync('./subscribe-token.json'));
    webpush.sendNotification(subscription, payload).catch(console.log);

    res.status(201).json({});
  } else {
    res.status(404).json({ title: 'Not found subscribe-token'});
  }
})

app.post('/budget', (req, res) => {
  const payload = JSON.stringify(req.body);
  if (fs.existsSync('./subscribe-token.json')) {
    const subscription = JSON.parse(fs.readFileSync('./subscribe-token.json'));

    if (lastNotificationIsOver5min()) {
      fs.writeFileSync('./last-notification.txt', new Date().toISOString());
      webpush.sendNotification(subscription, payload).catch(console.log);
      res.status(201).json({});
    } else {
      res.status(418).json({ error: 'Last notification is under 5 minutes, retry in a moment'});
    }
  } else {
    res.status(404).json({ title: 'Not found subscribe-token'});
  }
})

function lastNotificationIsOver5min() {
  if (!fs.existsSync('./last-notification.txt')) {
    return true;
  }

  const lastNotification = new Date(fs.readFileSync('./last-notification.txt'));
  const currentNotificationDate = new Date();

  const differenceMinutes = differenceInMinutes(currentNotificationDate, lastNotification);
  if (differenceMinutes <= 5) {
    return false;
  }

  return true;
}


app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});