const mongoose =require('mongoose');
//MONGODB-LOCAL
//const URL = 'mongodb://localhost/chat-ua';
//MONGODB-NUBE
const URL = 'mongodb+srv://dbDiego:1234@cluster0.ofinp.mongodb.net/chat-ua?authSource=admin&replicaSet=atlas-ljhf3l-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

mongoose.connect(URL)
  .then(db=>console.log('db is connected'))
  .catch(err=>console.log(err));

module.exports=mongoose;



// module.exports = {
// 	'url': 'mongodb://localhost/chat-database'
// };
