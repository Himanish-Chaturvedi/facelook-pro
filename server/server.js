const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This will respond to the VERY FIRST page (https://facelook-pro-njx2.onrender.com/)
app.get('/', (req, res) => {
  res.send("<h1>FACÉLOOK Engine is LIVE at the Root! 🚀</h1>");
});

// This responds to /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: "All good!" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});