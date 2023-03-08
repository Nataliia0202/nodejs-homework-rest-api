const express = require("express");
const router = express.Router();

const { validationBody } = require("../middleware/validationBody");
const { authSchema } = require("../middleware/validationSchemas");
const { tryCatchWrapper } = require("../../helpers");
const { auth } = require("../middleware/auth");
const users = require("../../controllers/userController");
const { upload } = require("../middleware/upload");

router.post(
  "/register",
  validationBody(authSchema),
  tryCatchWrapper(users.register)
);

router.post("/login", validationBody(authSchema), tryCatchWrapper(users.login));

router.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(users.logout));

router.post("/current", tryCatchWrapper(auth), tryCatchWrapper(users.current));

router.patch("/avatars", tryCatchWrapper(auth), upload.single("avatar"), tryCatchWrapper(users.updateAvatar));

module.exports = router;
