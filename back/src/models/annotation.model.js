const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema(
  {
    panels: {
      type: String,
      enum: ["single", "multiple"],
      required: false,
    },
    containsChart: {
      type: Boolean,
      required: false,
    },
    typeOfChart: {
      type: String,
      required: false,
      enum: [
        "Unknown",
        "Horizontal Bar",
        "Vertical Bar",
        "Horizontal Box",
        "Vertical Box",
        "Pie",
        "Line",
        "Scatter",
        "Scatter With Line",
        "Area",
        "Heatmap",
        "Horizontal Interval",
        "Vertical Interval",
        "Manhattan",
        "Map",
        "Surface",
        "Venn",
      ],
      nullable: true,
    },
    path: {
      type: String,
      required: false,
      unique: true,
    },
    annotatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    verifiedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    confidence: {
      type: Number,
      required: false,
    },
    chartConfidence: {
      type: Number,
      required: false,
    },
    prePanels: {
      type: String,
      enum: ["single", "multiple"],
      required: true,
    },
    preContainsChart: {
      type: Boolean,
      required: false,
      default: false,
    },
    preTypeOfChart: {
      type: String,
      required: false,
      enum: [
        "Unknown",
        "Horizontal Bar",
        "Vertical Bar",
        "Horizontal Box",
        "Vertical Box",
        "Pie",
        "Line",
        "Scatter",
        "Scatter With Line",
        "Area",
        "Heatmap",
        "Horizontal Interval",
        "Vertical Interval",
        "Manhattan",
        "Map",
        "Surface",
        "Venn",
      ],
      nullable: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("annotation", annotationSchema);
