
const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/items.controllers");

router.get("/items", itemsController.getAll);

module.exports = router;