//import { client } from "@devrev/typescript-sdk";
import axios from 'axios';
import { MongoClient, Db, } from 'mongodb';

const uri = 'mongodb+srv://nilupilu:hellomello@cluster0.tjvd3bk.mongodb.net/'; // Replace with your MongoDB URI
const databaseName = 'Customer'; // Replace with your database name
const collectionName = 'CallData'; 
const client = new MongoClient(uri);

const twiclient = require('twilio')("AC2deea27febf4d49d44979e23c46aad2c","fe472d53fb4ae0b7b0d7b29612a986dc");


export const run = async (events: any[]) => {
    console.info('events', JSON.stringify(events), '\n\n\n');
    await client.connect();
    console.log('Connected to MongoDB');
    
    for (let event of events) {
      const resp = await handleEvent(event);
      //console.log(JSON.stringify(resp!.data));
    }
  };
  
  

  async function handleEvent(
    event: any,
  ) {
    const db: Db = client.db(databaseName);
    const collection = db.collection(collectionName);
    const ticketId = event.payload.source_id;
    const entry = await collection.findOne({ticket_id:ticketId});
    const custNum=entry!.number;

    axios.post(" https://b742-103-44-174-33.ngrok-free.app/set-number", {"custNum":custNum,"ticketId":ticketId})
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  twiclient.calls
      .create({
         url:"https://b742-103-44-174-33.ngrok-free.app/answer",
         to:    custNum,
         from: '+12564856295'  //set this as support number in env
       })
      .then((call:any)=> console.log(call.sid));

    //console.log("bye");

  }

export default run;