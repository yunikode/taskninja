const program = require('commander')
const  { prompt } = require('inquirer')

const {addTask, getTask, getTaskList, updateTask, deleteTask} = require('./logic')

const questions = [
  {
    type: 'input',
    name: 'task',
    message: 'What to do...'
  },
  {
    type: 'input',
    name: 'due',
    message: 'When should it be done...'
  },
  {
    type: 'input',
    name: 'priority',
    message: 'How serious is it...'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Who should be notified...'
  }
]


program
  .version('0.0.2')
  .description('Task managment system')

program
  .command('addTask')
  .alias('a')
  .description('Add a task')
  .action(() => {
    prompt(questions).then(answers => addTask(answers))
  })

program
  .command('getTask <name>')
  .alias('r')
  .description('Get task')
  .action(name => getTask(name))

program
  .command('updateTask <_id>')
  .alias('u')
  .description('Update task')
  .action(name => {
    prompt(questions).then((answers) => updateTask(_id, answers))
  })

program
  .command('deleteTask <_id>')
  .alias('d')
  .description('Delete task')
  .action(_id => deleteTask(_id))

program
  .command('getTaskList')
  .alias('l')
  .description('List tasks')
  .action(() => getTaskList())

if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
  program.outputHelp()
  process.exit()
}

program.parse(process.argv)
