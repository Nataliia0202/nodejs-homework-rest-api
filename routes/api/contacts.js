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
const { auth } = require("../middleware/auth");


router.get("/", tryCatchWrapper(auth), tryCatchWrapper(contacts.getAllContacts));

router.get(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(contacts.getOneContactById)
);

router.post(
  "/",
  tryCatchWrapper(auth),
  validationBody(addContactSchema),
  tryCatchWrapper(contacts.addNewContact)
);

router.delete(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(contacts.deleteContactById)
);

router.put(
  "/:contactId",
  tryCatchWrapper(auth),
  validationBody(changeContactSchema),
  tryCatchWrapper(contacts.updateSomeContact)
);

router.patch(
  "/:contactId/favorite",
  tryCatchWrapper(auth),
  validationBody(changeContactStatusSchema),
  tryCatchWrapper(contacts.updateStatusContact)
);

module.exports = router;
