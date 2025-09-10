const mongoose = require('mongoose')

mongoose.connect(process.env.MDB_URI)
.then(()=>{
  console.log("Database is connected")
})
.catch((err)=>(
  console.log(err.massage)
))

module.exports = mongoose.connection;