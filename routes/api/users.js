const express = require("express");
const router = express.Router();

const { validationBody } = require("../middleware/validationBody");
const { authSchema } = require("../middleware/validationSchemas");
const { tryCatchWrapper } = require("../../helpers");
const { auth } = require("../middleware/auth");
const users = require("../../controllers/userController");

router.post(
  "/register",
  validationBody(authSchema),
  tryCatchWrapper(users.register)
);

router.post("/login", validationBody(authSchema), tryCatchWrapper(users.login));

router.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(users.logout));

router.post("/current", tryCatchWrapper(auth), tryCatchWrapper(users.current));

module.exports = router;

