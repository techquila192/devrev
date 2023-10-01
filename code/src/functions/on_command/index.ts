//import { client } from "@devrev/typescript-sdk";
import axios from 'axios';
import { MongoClient, Db, } from 'mongodb';

// Replace with your MongoDB URI
const databaseName = 'Customer'; // Replace with your database name
const collectionName = 'CallData'; 
var client:any;


var twiclient:any;


export const run = async (events: any[]) => {
    console.info('events', JSON.stringify(events), '\n\n\n');
    
    
    for (let event of events) {
      const uri = event.input_data.keyrings.mongo; 
      client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB');
      twiclient = require('twilio')("AC2deea27febf4d49d44979e23c46aad2c",event.input_data.keyrings.twilio);
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

    axios.post("https://hackerhive.onrender.com/set-number", {"custNum":custNum,"ticketId":ticketId})
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  twiclient.calls
      .create({
         url:"https://hackerhive.onrender.com/answer",
         to:    custNum,
         from: '+12564856295'  //set this as support number in env
       })
      .then((call:any)=> console.log(call.sid));

    //console.log("bye");

  }

export default run;