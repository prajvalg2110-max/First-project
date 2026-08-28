const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'CI/CD demo app is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start the server when run directly (not when imported by tests).
if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
