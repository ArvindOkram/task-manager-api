const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
//Email api key
//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
const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize: 1000000 //in bytes
//     },
//     fileFilter(res, file, cb){
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document!'))
//         }
         
//         cb(undefined, true)
//     }
// })

// // const errorMiddleware = (req, res, next) => {
// //     throw new Error('Please upload a text file')
// // }

// app.post('/upload', upload.single('upload'),(req,res)=>{
//     res.send()
// },(error, req, res, next)=>{
//     res.status(400).send({error: error.message})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
//app.use()

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()

// const Task = require("./models/task");
// const User = require("./models/user");
 
// const main = async () => {
//   // const task = await Task.findById('61ebe8bbc9f15f1980f8ad94')
//   // await task.populate('owner').execPopulate()
//   // console.log(task.owner)
 
//   const user = await User.findById("62f343883e52098717bce936");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };
 
// main();

// main()

