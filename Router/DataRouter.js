const express = require("express");
const DataLogic = require("../Controller/DataLogic");
const router = express.Router();

router.post("/entry", DataLogic.DataentryLogic);
router.get("/fetch-entry", DataLogic.fetchEntries);
router.delete("/entry/:id", DataLogic.DeleteData);
router.put("/editentry/:id", DataLogic.editEntry);
router.get("/export", DataLogic.exportentry);
router.post("/entries", DataLogic.bulkUploadStocks);
module.exports = router;
