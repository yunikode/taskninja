const mongoose = require('mongoose')
const assert = require('assert')
const chalk = require('chalk')
const Table = require('cli-table2')
const colors = require('colors')

mongoose.Promise = global.Promise // Allows for Native promises without throwing errors

const db = mongoose.connect('mongodb://localhost:27017/task-mamager')

function toLower(v) {
  return v.toLowerCase()
}

const taskSchema = mongoose.Schema({
  task: { type: String, set: toLower },
  due: { type: String, set: toLower },
  priority: { type: String, set: toLower },
  email: { type: String, set: toLower }
})

const Task = mongoose.model('Task', taskSchema)

const addTask = (task) => {
  Task.create(task, (err) => {
    assert.equal(null, err)
    console.info(chalk.green('New task added'))
    db.disconnect()
  })
}

const getTask = (name) => {
  const search = new RegExp(name, 'i')
  Task.find({$or: [{task: search}, {priority: search}, {due: search}]})
  .exec((err, task) => {
    assert.equal(null, err)
    var table = new Table({head: ['task', 'due', 'priority'], style:{head: []}})
    task.forEach(function(t, index) {
      if (t.task != undefined)
      table.push([t.task, t.due, t.priority])
    })
    console.info(table.toString())
    console.info(chalk.yellow(`${task.length} matches`))
    db.disconnect()
  })
}

const updateTask = (_id, task) => {
  Task.update({_id}, task)
  .exec((err, status) => {
    assert.equal(null, err)
    console.info(chalk.green('Updated successfully'))
    db.disconnect()
  })
}

const deleteTask = (name) => {
  let search = chalk.red('Not specific enough')
  if (name.length >= 4) {
    search = new RegExp(name, 'i')
  }
  Task.find({task: search})
  .exec((err, task) => {
    assert.equal(null, err)
    task.forEach(function(t, index) {
      let _id = t._id
      Task.remove({_id})
      .exec((err, status) => {
        assert.equal(null, err)
        console.info(chalk.yellow.bold(`Task: ${t.task} successfully deleted.`))
      })
    })
    db.disconnect()
  })
}

const getTaskList = () => {
  Task.find()
  .exec((err, tasks) => {
    assert.equal(null, err)
    var table = new Table({head: ['task', 'due', 'priority'],style:{head: []}})
    tasks.forEach(function(task, index) {
      if (task.task != undefined)
      (task.priority === 'high' || 'severe') ? task.priority = colors.yellow(task.priority) : ''
      table.push([task.task, task.due, task.priority])
    })
    console.info(table.toString())
    console.info(chalk.yellow(`${tasks.length} matches`))
    db.disconnect()
  })
}

module.exports = { addTask, getTask, getTaskList, updateTask, deleteTask }
