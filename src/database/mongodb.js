const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_MAIN, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}) 
 