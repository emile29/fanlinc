import mongoose from 'mongoose';

export function connection() {
  const uri = "<mongodb_url>";
  mongoose.connect(uri, {
                          useNewUrlParser : true,
                          useUnifiedTopology : true,
                        });
  mongoose.connection.once('open', () => {
      console.log('MongoDB database connection established successfully!');
  });
}
