const express = require('express');
const PORT = process.env.PORT || 5000;

const authRouter = require('./Routes/authRouter');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const start = () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log('Error ', error.message);
  }
};

start();
