const mongoose = require("mongoose")
const app = require('./app')

const { HOST_DB, PORT = 3000 } = process.env;

mongoose
  .set("strictQuery", false)
  .connect(HOST_DB)
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });


