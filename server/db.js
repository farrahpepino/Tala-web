const mongoose = require('mongoose')
module.exports = () =>{
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    try{
        mongoose.connect(process.env.DB)
        console.log('Connected to the database successfully')
    }
    catch(error){
        console.log(error)
        console.log('Cannot connect to the database')
    }
}