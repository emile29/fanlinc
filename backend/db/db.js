import mongoose from 'mongoose';

export function connection() {
  const uri = "mongodb+srv://User:28qHA0Fvm9gYNYxw@cluster0.b18to.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(uri, {
                          useNewUrlParser : true,
                          useUnifiedTopology : true,
                        });
  mongoose.connection.once('open', () => {
      console.log('MongoDB database connection established successfully!');
  });
}
