const Task = require("../models/tasks");
const dayjs = require("dayjs");
const _ = require("lodash");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const chartAll = {};
const chartInWork = {}
const chartAllTime = {}

const groupedByHour = (dataset, timezone) => _.groupBy(dataset, (result) => {
  return dayjs.utc(result["time"]).tz(timezone).startOf("hour").format("H");
});

const populateChart = (groupedData, chartData) => {
  for (let i = 0; i < 24; i++) {
    Object.assign(chartData, {
      [`${i}:00`]: groupedData[i] ? groupedData[i].length : 0,
    });
  }
}  

exports.sendTrack = async (req, res, next) => {
  try {
    const time = req.body.time;
    const inWork = req.body.inWork
    await Task.create({
      time,
      inWork
    });
    res.status(200).send();
  } catch (err) {
    console.log(err)
    return next(err);
  }
};

exports.processTrack = async (req, res, next) => {
  try {
    if (req.body.alltime === true) {
      const tasks = await Task.find()
      if (tasks.length < 1) {
        return res.send({
          noTasks: true
        })
      }
      const daysDiff = dayjs(tasks[tasks.length - 1].time).diff(tasks[0].time, 'day')
      const tasksByHour =  groupedByHour(tasks, req.body.timezone)
      for (let i = 0; i < 24; i++) {
        Object.assign(chartAllTime, {
          [`${i}:00`]: tasksByHour[i] ? tasksByHour[i].length / (daysDiff > 0 ? daysDiff : 1)  : 0,
        });
      }
      return res.send({
        chartAllTimeLabels: Object.keys(chartAllTime) || null,
        chartAllTimeValues: Object.values(chartAllTime) || null,
      });
    }
    const date = req.body.tasksDate ? dayjs.utc(req.body.tasksDate) : dayjs.utc();
    const tasksAll = await Task.find({
        time: {
          $gte: date.tz(req.body.timezone).startOf('day').valueOf(),
          $lte: date.tz(req.body.timezone).endOf('day').valueOf(),
        },
    });
    const tasksInWork = await Task.find({
        time: {
          $gte: date.tz(req.body.timezone).startOf('day').valueOf(),
          $lte: date.tz(req.body.timezone).endOf('day').valueOf(),
        },
        inWork: {
          $eq: true
        }
    })
    const allByHour = groupedByHour(tasksAll, req.body.timezone)
    const inWorkByHour = groupedByHour(tasksInWork, req.body.timezone)

    populateChart(allByHour, chartAll)
    populateChart(inWorkByHour, chartInWork)

    res.send({
      chartAllLabels: Object.keys(chartAll) || null,
      chartAllValues: Object.values(chartAll) || null,
      chartInWorkLabels: Object.keys(chartInWork) || null,
      chartInWorkValues: Object.values(chartInWork) || null,
    });
  } catch (err) {
    return next(err);
  }
};
