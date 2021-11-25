const express = require("express");
const middlewares = require("../middlewares");
const AnnotationRepo = require("../models/annotation.model");

const router = express.Router();

router.use(middlewares.checkJWT);
router.get("/", async (req, res, next) => {
  const { query } = req;
  const { path } = query;
  try {
    const found = await AnnotationRepo.findOne({ path });
    res.send({ item: found });
  } catch (error) {
    next(error);
  }
});

router.post("/annotate", async (req, res, next) => {
  const { body } = req;
  try {
    const item = await AnnotationRepo.findOne({ path: body.path });
    if (item) {
      const update = {
        panels: body.panels,
        containsChart: body.containsChart,
        typeOfChart: body.chartType,
      };
      const confirm = await AnnotationRepo.updateOne(
        { path: body.path },
        { $set: { ...update } }
      );
      res.send(confirm);
    } else {
      res.status(400).send({ message: "Path not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/preclass", async (req, res, next) => {
  const { user } = req;

  if (["admin", "verifier"].includes(user.role)) {
    const { data } = req.body;
    let paths = Object.keys(data).filter((key) => !data[key]["error"]);
    try {
      let found = await AnnotationRepo.find({ path: { $in: paths } });
      found = found.map((object) => object.path);
      paths = paths.filter((path) => !found.includes(path));
      console.log("found: %d", found.length);
      const toUpdate = found;
      // create new annotations
      const objects = paths.map((key) => {
        const classified = data[key];
        const created = {
          path: key,
          prePanels: classified.multi_panel ? "multiple" : "single",
          preContainsChart: classified.has_charts,
          preTypeOfChart: classified.chart_class,
          confidence: classified.hl_confidence,
          chartConfidence: classified.chart_confidence,
        };
        return created;
      });
      console.log("creating: %d", objects.length);
      if (objects.length > 0)
        await AnnotationRepo.collection.insertMany(objects);

      // update on bulk
      const updates = toUpdate.map((key) => {
        const classified = data[key];
        const created = {
          updateOne: {
            filter: { path: key },
            update: {
              $set: {
                path: key,
                prePanels: classified.multi_panel ? "multiple" : "single",
                preContainsChart: classified.has_charts,
                preTypeOfChart: classified.chart_class,
                confidence: classified.hl_confidence,
                chartConfidence: classified.chart_confidence,
              },
            },
          },
        };
        return created;
      });
      console.log("updating: %d", updates.length);
      if (updates.length > 0)
        await AnnotationRepo.collection.bulkWrite(updates);

      res.send({ data: "pong" });
    } catch (error) {
      console.log(error.stack);
      next(error);
    }
  } else {
    res.sendStatus(403);
  }
});

router.use(middlewares.defaultError);

module.exports = router;
