const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema(
  {
    panels: {
      type: String,
      enum: ["single", "multiple"],
      required: true,
    },
    containsChart: {
      type: Boolean,
      required: false,
      default: false,
    },
    typeOfChart: {
      type: Number,
      max: 15,
      min: -2,
      enum: ["single", "multiple"],
      required: false,
      default: -2,
    },
    annotatedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    verifiedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("annotation", annotationSchema);
