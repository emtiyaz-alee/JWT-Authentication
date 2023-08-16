import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dbuser:dbpassword@cluster0.vanduyi.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
    }
}
run().catch(console.dir);

process.once('SIGINT', function (code) {
  console.log('App is terminating...');
  process.exit(0)
});