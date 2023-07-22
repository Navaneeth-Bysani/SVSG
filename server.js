const app = require("./app");
const mongoose = require("mongoose");
const {mongodb_uri} = require("./utils/config");

const config = require("./utils/config");

const port = config.PORT || 3000;


mongoose
  .connect(mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    console.log("Starting the server ...");

    app.listen(port, () => {
      console.log(`✅ Server is running on PORT ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Could not connect to MongoDB server! Shutting down...");
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.log(err.name, err);
  console.log("UNHANDLED REJECTION! 💥 Shutting Down...");

  app.close(() => {
    process.exit(1);
  });
});