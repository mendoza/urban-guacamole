const express = require("express");
const middlewares = require("../middlewares");

const router = express.Router();

router.use(middlewares.checkJWT);
router.post("/annotate", (req, res, next) => {
  const { user } = req;
});

router.use(middlewares.defaultError);

module.exports = router;
