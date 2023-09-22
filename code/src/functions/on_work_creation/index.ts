import axios , {AxiosResponse} from 'axios';
const instance = axios.create({
  timeout: 70000, // Set a 10-second timeout for all requests made using this instance
});

export const run = async (events: any[]) => {
  for(const event of events) {
    console.info(event);
    console.info(`Event ${event.payload.work_created.work.type} has been received.`);
    if(event.payload.work_created.work.type === 'ticket') {
      // Do something
      const result = await addIssue(event.payload.work_created)
    }
  }
  console.info(`The work ${events[0].payload.work_created.work.id} has been created.`)
};

const addIssue = async (workcreated : any) => {
  
  // API call to get prev issues
  const config = {
    headers: {
      'Authorization': "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvL3lIeURwd3o0OmRldnUvMyIsImV4cCI6MTc4OTY1NTQzOCwiaHR0cDovL2RldnJldi5haS9hdXRoMF91aWQiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vc3VwZXI6YXV0aDBfdXNlci9nb29nbGUtb2F1dGgyfDEwOTgyODk4NTIwMzYxMjIyNzY4NSIsImh0dHA6Ly9kZXZyZXYuYWkvYXV0aDBfdXNlcl9pZCI6Imdvb2dsZS1vYXV0aDJ8MTA5ODI4OTg1MjAzNjEyMjI3Njg1IiwiaHR0cDovL2RldnJldi5haS9kZXZvX2RvbiI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by95SHlEcHd6NCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2b2lkIjoiREVWLXlIeURwd3o0IiwiaHR0cDovL2RldnJldi5haS9kZXZ1aWQiOiJERVZVLTMiLCJodHRwOi8vZGV2cmV2LmFpL2Rpc3BsYXluYW1lIjoibmlsYW5qYW5iaGF0dGFjaGFyeWEyMiIsImh0dHA6Ly9kZXZyZXYuYWkvZW1haWwiOiJuaWxhbmphbmJoYXR0YWNoYXJ5YTIyQGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJOaWxhbmphbiBCaGF0dGFjaGFyeWEiLCJodHRwOi8vZGV2cmV2LmFpL2lzX3ZlcmlmaWVkIjp0cnVlLCJodHRwOi8vZGV2cmV2LmFpL3Rva2VudHlwZSI6InVybjpkZXZyZXY6cGFyYW1zOm9hdXRoOnRva2VuLXR5cGU6cGF0IiwiaWF0IjoxNjk1MDQ3NDM4LCJpc3MiOiJodHRwczovL2F1dGgtdG9rZW4uZGV2cmV2LmFpLyIsImp0aSI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by95SHlEcHd6NDp0b2tlbi9iMk8xNk5jZSIsIm9yZ19pZCI6Im9yZ19IVlBYWUFOUFNpcDFKQ1lYIiwic3ViIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvL3lIeURwd3o0OmRldnUvMyJ9.riTCPgsDXHESE7Icomvg5dZSxE_iYq_W5zBIMM1X8hgq_4sx-myiGE8c4XJy5w3_binwhFCU15ippOyUlJ9PcY2A8YNtX8RHb93K0R4RZ1SEI33YfMEupbvDjN46SXcQS8sItyrWLiy2ewXHH0J2J0TB7JWaiSRPQG6hgHg7ConkqDcLLPcW77GUyesancMOlWxWpJX3jWqyRovUDQ8HRuA67iKGApjn7zda-9cbxYcMopwI_hebCgRAbZR7OCW-ZpesQ2HwOrfpsoqNoqr86Zd13seLNHqAbMwbCDddiaW298FIj5FhEAwuPgwyeVyU-qSjUaF8EPAm1FLBcJBDxQ",
      'Content-Type': 'application/json'
    }
  }
  const res = await axios.get('https://api.devrev.ai/works.list?type="issue"' , config)
  .then((response: AxiosResponse) => {
    return response.data
  })
  .catch((err) => {
    console.log(err)
  })
  //console.log(res.works)


  // Send prev issues + new issue to openai and get matching issue
  const response = await axios.post("https://hackerhive.onrender.com/group-issue" , {
    "ticket": workcreated,
    "issues": res.works
  }).then((response: AxiosResponse) => {
    return response.data
  })
  .catch((err) => {
    console.log(err)
  })
  console.log(response)

  const ticketId= workcreated.work.id;
  const issueIds=response.issueIds;
  const issueNames=response.issueNames;
  const issueBody=response.issueBody;
    // create or add issue
    //loop through issues and link ticket with all issues
    for(const issue of issueIds) {
    const linker = await axios.post('https://api.devrev.ai/links.create',{"source":ticketId,"link_type":"is_dependent_on", "target":issue} ,
    config)
    .then((response: AxiosResponse) => {
      console.log(response.data);
      return response.data
    })
    .catch((err) => {
      console.log(err)
    })
    }

    //create new issue and then link ticket to it 
    const appliesToPart= workcreated.work.applies_to_part;
    const ownedBy= workcreated.work.owned_by;
    const idArray: string[] = [];
    // Iterate through each object in ownedBy and extract the "id" field
    ownedBy.forEach((item:any) => {
    idArray.push(item.id);
    });
    let j=0;
    for (const issueName of issueNames) {
    const title= issueName  
    const body = {
      "applies_to_part": appliesToPart.id,
      "title": title,
      "body": issueBody[j],
      "owned_by": idArray,
      "type": "issue"
    }
    j++;
    const newIssue = await axios.post('https://api.devrev.ai/works.create' , body,config)
  .then((response: AxiosResponse) => {
    return response.data
  })
  .catch((err) => {
    console.log(err);
  })

  const newLinker = await axios.post('https://api.devrev.ai/links.create' ,{"source":ticketId,"link_type":"is_dependent_on", "target":newIssue.work.id} ,
  config)
  .then((response: AxiosResponse) => {
    return response.data
  })
  .catch((err) => {
    console.log(err)
  })
  }
  //console.log(newLinker)


}

export default run;
