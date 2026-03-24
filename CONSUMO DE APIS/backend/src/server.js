require("dotenv").config({ debug: false, override: false });
const express = require("express");
const cors = require("cors");

const itemsRouter = require("./routes/items.route");

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());
app.use("/api", itemsRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint disponible: GET http://localhost:${PORT}/api/items`);
});