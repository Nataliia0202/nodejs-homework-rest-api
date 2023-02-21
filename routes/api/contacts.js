const express = require("express");
const router = express.Router();

const { validationBody } = require("../middleware/validationBody");
const {
  addContactSchema,
  changeContactSchema,
  changeContactStatusSchema,
} = require("../middleware/validationSchemas");
const { tryCatchWrapper } = require("../../helpers");
const contacts = require("../../controllers/contactController");



router.get("/", tryCatchWrapper(contacts.getAllContacts));

router.get("/:contactId", tryCatchWrapper(contacts.getOneContactById));

router.post(
  "/",
  validationBody(addContactSchema),
  tryCatchWrapper(contacts.addNewContact)
);

router.delete("/:contactId", tryCatchWrapper(contacts.deleteContactById));

router.put(
  "/:contactId",
  validationBody(changeContactSchema),
  tryCatchWrapper(contacts.updateSomeContact)
);

router.patch(
  "/:contactId/favorite",
  validationBody(changeContactStatusSchema),
  tryCatchWrapper(contacts.updateStatusContact)
);

module.exports = router;
