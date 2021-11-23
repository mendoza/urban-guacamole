const express = require("express");
const middlewares = require("../middlewares");
const AnnotationRepo = require("../models/annotation.model");

const router = express.Router();

router.use(middlewares.checkJWT);
router.post("/annotate", async (req, res, next) => {
  const { user, body } = req;
  console.log(user, body);
  const item = await AnnotationRepo.findOne({ path: body.path });
  console.log(item);

  res.send({ salio: "tuanis" });
});

router.post("/preclass", async (req, res, next) => {
  const { user } = req;

  if (["admin", "verifier"].includes(user.role)) {
    const { data } = req.body;
    const paths = Object.keys(data).filter((key) => !data[key]["error"]);
    try {
      let found = await AnnotationRepo.find({ path: { $in: paths } });
      found = found.map((object) => object.path);
      // create new annotations
      const objects = paths
        .filter((path) => !found.includes(path))
        .map((key) => {
          const classfied = data[key];
          const created = {
            path: key,
            prePanels: classfied.multi_panel ? "multiple" : "single",
            preContainsChart: classfied.has_charts,
            preTypeOfChart: classfied.chart_class,
          };
          return created;
        });
      await AnnotationRepo.collection.insertMany(objects);
      res.send({ data: "pong" });
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(403);
  }
});

router.use(middlewares.defaultError);

module.exports = router;
