const Task = require("../models/tasks");
const dayjs = require("dayjs");
const _ = require("lodash");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const {compileQueryParser} = require("express/lib/utils");

dayjs.extend(utc);
dayjs.extend(timezone)

let chartLabels = [
  '0:00',  '1:00',  '2:00',
  '3:00',  '4:00',  '5:00',
  '6:00',  '7:00',  '8:00',
  '9:00',  '10:00', '11:00',
  '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
  '21:00', '22:00', '23:00'
]

//const groupedByHour = (dataset, timezone) => _.groupBy(dataset, (result) => {
//  return dayjs.utc(result["time"]).tz(timezone).startOf("hour").format("H");
//});

const toAxisX = (values, diff) => {
  return values
      .map(hour => {
        return {
          x: `${hour._id.hour}:00`,
          count: diff ? hour.count / diff : hour.count,
        }
      })
}

const aggregateTasks = async (query, timezone) => {
  try {
    const taskAggregation = await Task.aggregate([
      {
        $match: {
          ...query,
        }
      },
      {
        $group: {
          _id: {
            hour: {
              $hour: {
                date: {
                  $toDate: "$time"
                },
                timezone: timezone
              }
            }
          },
          count: {$sum: 1}
        }
      },
      {
        $sort: {'_id.hour': 1},
      }])
    return taskAggregation
  } catch (error) {
    console.log(error)
    return null
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
      try {
        const firstTask = await Task.find().limit(1).sort({_id: 1})
        const lastTask = await Task.find().limit(1).sort({_id: -1})

        if (!firstTask.length && !lastTask.length) {
          return res.status(200).send({
            chartAllTimeLabels: null,
            chartAllTimeValues: null,
          });
        }

        const daysDiff = dayjs(lastTask[0].time).diff(firstTask[0].time, 'day')
        const groupedTasks = await aggregateTasks(null, req.body.timezone)

        return res.status(200).send({
          chartLabels: chartLabels,
          chartAllTime: toAxisX(groupedTasks, daysDiff) || null,
        });
      } catch (e) {
        console.log(e)
      }
    }
    const date = req.body.tasksDate ? dayjs.utc(req.body.tasksDate) : dayjs.utc();

    const groupedAll = await aggregateTasks({
          time: {
            $gte: date.tz(req.body.timezone).startOf('day').valueOf(),
            $lte: date.tz(req.body.timezone).endOf('day').valueOf(),
          },
        },
        req.body.timezone
    )

    const groupedInWork = await aggregateTasks({
          time: {
            $gte: date.tz(req.body.timezone).startOf('day').valueOf(),
            $lte: date.tz(req.body.timezone).endOf('day').valueOf(),
          },
          inWork: true
        },
        req.body.timezone
    )

     res.send({
      chartLabels: chartLabels,
      chartAll: toAxisX(groupedAll) || null,
      chartInWork: toAxisX(groupedInWork) || null,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const tasks = await Task.aggregate([
          {
            $facet: {
              'overall': [
                {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }
              ],
              'worked': [
                {$match: {inWork: true}},
                {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }],
              'firstTask': [
                {$limit: 1},
                {$sort: {_id: 1}},
              ]
            }
          }
        ]
    )

    const estimateHours = (tasks[0].worked[0].count / 2) / 60
    const firstDay = dayjs(tasks[0].firstTask.time).format('DD/MM/YYYY').toString()
    res.status(200).json({
      taskAmount: tasks[0].overall[0].count || null,
      estimatedHours: estimateHours || null,
      firstDay: firstDay || null
    })
  } catch (err) {
    console.log(err)
    return next(err)
  }
}