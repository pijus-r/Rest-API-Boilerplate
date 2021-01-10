// Set up mongoose connection
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/node_rest_api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('🏃🏻 MongoDB connected...');
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
