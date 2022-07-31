const mongoose = require('mongoose');


const ConnectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
            // useFindModify: true
        })
        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log('db connected');
        });
    }
    catch(err){
        console.log(`Oops Error Occured while connecting DB due to ${err}`);
    }
}

module.exports = ConnectDB;
