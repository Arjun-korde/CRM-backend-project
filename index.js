const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`server listening on http:/localhost:${PORT}`);
})