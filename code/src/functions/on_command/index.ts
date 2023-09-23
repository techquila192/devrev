import { client } from "@devrev/typescript-sdk";


export const run = async (events: any[]) => {
    console.info('events', JSON.stringify(events), '\n\n\n');
    for (let event of events) {
      const resp = await handleEvent(event);
      console.log(JSON.stringify(resp.data));
    }
  };
  
  

  async function handleEvent(
    event: any,
  ) {
    const devrevPAT = event.context.secrets.service_account_token;
    const API_BASE = event.execution_metadata.devrev_endpoint;
    const devrevSDK = client.setup({
      endpoint: API_BASE,
      token: devrevPAT,
    })
    const ticketId = event.payload.source_id;
    const ticket=await devrevSDK.worksGet({id:ticketId});
    console.log(ticket);

    }

export default run;