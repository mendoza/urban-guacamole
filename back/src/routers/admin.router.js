const express = require("express");
const userRepo = require("../models/user.model");
const annotationRepo = require("../models/annotation.model");
const annotationMetaRepo = require("../models/annotationMeta.model");
const middlewares = require("../middlewares");
const bcrypt = require("bcrypt");

const router = express.Router();
const saltRounds = Number(process.env.SALT_ROUNDS);
router.use(middlewares.checkAdminJWT);

router.get("/users", async (_req, res, next) => {
  try {
    const users = await userRepo.find({ role: "annotator" });
    res.send({
      users: users.map((user) => {
        delete user["password"];
        return user;
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  const { email, password, name, role } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  try {
    const doc = await userRepo.create({ email, password: hash, name, role });
    res.json({ success: true, user: doc.toJSON() });
  } catch (error) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const found = await annotationMetaRepo.aggregate([
      {
        $match: {
          done: { $eq: true },
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
    ]);
    const mapped = found.map((item) => item.annotation);
    const data = JSON.stringify({ found: mapped });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/assign", async (req, res, next) => {
  const { difficulty, limit, who } = req.body;
  try {
    const found = await annotationRepo.aggregate([
      {
        $lookup: {
          from: "annotationMeta",
          localField: "_id",
          foreignField: "annotationId",
          as: "trans",
        },
      },
      {
        $match: {
          "trans.annotationId": {
            $exists: false,
          },
        },
      },
      {
        $addFields: {
          avgConfidence: { $avg: ["$confidence", "$chartConfidence"] },
        },
      },
      { $sort: { avgConfidence: difficulty === "easy" ? -1 : 1 } },
      {
        $limit: limit,
      },
      { $unset: "trans" },
    ]);
    const bulkWrite = found.map((item) => {
      return {
        insertOne: {
          document: {
            annotationId: item._id,
            annotatedBy: who,
            done: false,
          },
        },
      };
    });
    await annotationMetaRepo.bulkWrite(bulkWrite);
    res.send({ found });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.use(middlewares.defaultError);

module.exports = router;
