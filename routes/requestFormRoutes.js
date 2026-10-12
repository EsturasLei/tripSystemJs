
const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/requestController");

router.get("/", RequestController.getAll);
router.get("/:id", RequestController.getById);
router.post("/", RequestController.create);
router.put("/:id", RequestController.update);
router.delete("/:id", RequestController.delete);

module.exports = router;
