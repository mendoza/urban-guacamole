const express = require("express");
const middlewares = require("../middlewares");
const AnnotationRepo = require("../models/annotation.model");
const AnnotationMetaRepo = require("../models/annotationMeta.model");

const router = express.Router();

router.use(middlewares.checkJWT);
router.get("/", async (req, res, next) => {
  const { user } = req;
  try {
    const found = await AnnotationMetaRepo.aggregate([
      {
        $match: {
          done: { $eq: false },
          annotatedBy: { $eq: user._id },
        },
      },
      {
        $lookup: {
          from: "annotations",
          localField: "annotationId",
          foreignField: "_id",
          as: "annotation",
        },
      },
      {
        $set: {
          annotation: { $first: "$annotation" },
        },
      },
    ]);
    res.send({ items: found, item: found[0] });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/annotate", async (req, res, next) => {
  const { body } = req;
  const { _id } = req.user;
  try {
    const item = await AnnotationRepo.findOne({ path: body.path });
    if (item) {
      const update = {
        panels: body.panels,
        containsChart: body.containsChart,
        annotatedBy: _id,
      };

      if (body.panels === "single" && body.containsChart) {
        update.typeOfChart = body.chartType;
      }

      const confirm = await AnnotationRepo.updateOne(
        { path: body.path },
        { $set: { ...update } }
      );
      const changed = await AnnotationMetaRepo.updateOne(
        { annotationId: item._id },
        { $set: { done: true, annotatedBy: _id } }
      );
      console.log(changed);
      res.send(confirm);
    } else {
      res.status(400).send({ message: "Path not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const found = await AnnotationMetaRepo.aggregate([
      {
        $match: { done: true, verifiedBy: { $exists: false } },
      },
      {
        $lookup: {
          from: "annotations",
          localField: "annotationId",
          foreignField: "_id",
          as: "annotation",
        },
      },
      {
        $set: {
          annotation: { $first: "$annotation" },
        },
      },
    ]);
    res.send({ found: found.map((item) => item.annotation) });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  const { correct, wrong } = req.body;
  const { _id } = req.user;
  try {
    let confirm;
    if (correct && correct.length !== 0) {
      const items = await AnnotationRepo.find({
        path: { $in: correct },
      });
      if (items && items.length !== 0) {
        const ids = items.map((item) => item._id);
        confirm = await AnnotationMetaRepo.updateMany(
          { annotationId: { $in: ids } },
          { verifiedBy: _id }
        );
      }
    }

    if (wrong && wrong.length !== 0) {
      const items = await AnnotationRepo.find({
        path: { $in: wrong },
      });
      if (items && items.length !== 0) {
        const ids = items.map((item) => item._id);
        confirm = await AnnotationMetaRepo.updateMany(
          { annotationId: { $in: ids } },
          { $set: { done: false } }
        );
      }
    }
    res.send({ confirm });
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
      next(error);
    }
  } else {
    res.sendStatus(403);
  }
});

router.use(middlewares.defaultError);

module.exports = router;
