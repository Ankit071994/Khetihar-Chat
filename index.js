const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {google} = require('googleapis');
const vision = require('@google-cloud/vision');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');

// initialise DB connection
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://agricultural-bot-njdmck-63206.firebaseio.com/',
});
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
const host = 'api.worldweatheronline.com';
const wwoApiKey = 'd2e480478e64483b8de204301201407';
const BIGQUERY = require('@google-cloud/bigquery');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'America/Los_Angeles';
const timeZoneOffset = '-07:00';
 
//providing storage details:
const bucketName = 'agricultural-bot-njdmck.appspot.com';
//console.log("Parameters", agent.parameters);
const getNameHandler = "get_type";
const applyML = "explore_image";


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request,response) =>{
  const agent = new WebhookClient({request, response });
console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


  console.log("Parameters", agent.parameters);
  const appointment_type = agent.parameters.AppointmentType;

// Function to create appointment in calendar  
function makeAppointment (agent) {
      addToBigQuery(agent);
      }




  // Get the city and date from the request
  
  	let city = req.body.queryResult.parameters['geo-city']; // city is a required param

  // Get the date for the weather forecast (if present)
	let date = '';
  if (req.body.queryResult.parameters.date) {
    date = req.body.queryResult.parameters.date;
    console.log('Date: ' + date);
  }

  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
  });
});

 
//let type = request.body.queryResult.parameters.type;
 
function vegetation_schedule(agent)
  {
    let type = agent.parameters.type;

   agent.add(`fulfillment:you selected type: ${type}`);
      if(type.toLowerCase() == "herbs"){
 agent.add(`you selected ${type}. You can grow below herbs based on the schedule. Basil - May to October, Corriander - June to September, Parsley - May to December, Dill - June to October.Do you wish to know anything else?`);
 }
 else if(type.toLowerCase() == "salads"){
 agent.add(`you selected ${type}.You can grow below salads based on the schedule. Celery - July to November, Courgettes from July to September, Cucumbers from May to September, Lettuce from June to September.Do you wish to know anything else?`);
 }
 else if(type.toLowerCase() == "Fruits"){
 agent.add(`you selected ${type}. You can grow below Fruits based on the schedule. Apples in October, blackberries in August, strawberries from June to October, Raspberries from July to October.Do you wish to know anything else?`);
 }
 else if(type.toLowerCase() == "vegetables"){
 agent.add(`you selected ${type}. You can grow below vegetables based on the schedule. Asparagus from May and June, Aubergines From May to August, Beetroot from August to Feb, Broad beans from June to August, Brocolli from June till November.Do you wish to know anything else ?`);
 }
 else{
 agent.add("Sorry , i dont Understand this ");
 }  
}
 
function visionapi(agent){
   // const filename = agent.parameters.filename;
   // const filename = request.body.queryResult.parameters.filename;
    console.log("filename is: ", filename);

    // call vision API to detect text
   // return callVisionApi(agent, bucketName, filename).then(result => {
    return callVisionApi(agricultural_bot, agricultural-bot-njdmck.appspot.com, demo.jpg).then(result => {
                      console.log(`result is ${result}`);
                      agent.add(`file is being processed, here are the results:  ${result}`);
            //agent.add(`file is being processed ${result}`);
        }).catch((error)=> {
            agent.add(`error occurred at apply ml function`  + error);
        });
}

var CVFNews = axios.create({
    method: 'get',
    baseURL: 'https://api-beta.civicfeed.com',
    headers: {'x-api-key': 'Ah3qLhN4ZS3LffYa1eFNu930KzSOiaL22np8ctym'}
    });  
 
function news(agent) {
  console.log('news function', JSON.stringify(request.body.queryResult.parameters));
  const word = request.body.queryResult.parameters.search;
  return CVFNews.get('/news/search?q='+encodeURIComponent(word)+'&limit=1&tags=news').then(function(response){
    const {title, source} = response.data.articles[0];
    console.log('response', response.data.articles[0]);
    return agent.add('The last article about ' + word + ' was: ' + title + ' and was published by ' + source.name);
    }).catch(function(error){
    console.log(error);
  });
}

//Add data to BigQuery
function addToBigQuery(agent) {
    return new Promise((resolve, reject) => {
    console.log(`add to bigquery tak pahunch gaya!`);    
    const msg = agent.query;
    const user_id = "user2";
    /**
    * TODO(developer): Uncomment the following lines before running the sample.
    */
    const projectId = "sentimental-big-query-gf9j"; 
    const datasetId = "sentiment";
    const tableId = "sentiment_tb";
    const bigquery = new BIGQUERY({
      projectId: projectId
    });
   const rows = [{user_id: user_id, message:msg }];
  console.log(` ${rows}`);
   bigquery
  .dataset(datasetId)
  .table(tableId)
  .insert(rows)
  .then(() => {
    console.log(`Inserted ${rows.length} rows`);
  })
  .catch(err => {
    if (err && err.name === 'PartialFailureError') {
      if (err.errors && err.errors.length > 0) {
        console.log('Insert errors:');
        err.errors.forEach(err => console.error(err));
      }
    } else {
      console.error('ERROR:', err);
    }
  });
  agent.add(`Added ${user_id} and ${msg} into the table`);

    
  });
}

 
function ReadfromDB(agent){  

const DBName = agent.parameters.DBName;

return admin.database().ref('vegetables').once('value').then((snapshot) => {
  var details = snapshot.child(DBName).val();
  if (snapshot.hasChild(`${DBName}`)){
   // agent.add(`${DBName} already exists in database.`);
    agent.add(`Below are the details:`);
        var time_to_grow = details.grow_time;
    var ph_val = details.ph_value;
    var ph_season = details.growing_season;
    agent.add(`***************************************`);
    agent.add(`Plant name  is  #:${DBName}`);
    agent.add(`Time for growth for ${DBName} #:${time_to_grow}`);
    agent.add(`Soil ph value for ${DBName} #:${ph_val}`);
    agent.add(`Growing season for ${DBName} #:${ph_season}`);
    agent.add(`***************************************`);
  }
  else{
    agent.add(`I do not have information about this`);
    agent.add(`**Expert **Please provide information about ## ${DBName}:`);
  }
});
}
 
 
function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response.data.weather[0];
        let location = response.data.request[0];
        let conditions = response.data.current_condition[0];
        let currentConditions = conditions.weatherDesc[0].value;

        // Create response
        let output = `Current conditions in the ${location.type} 
        ${location.query} are ${currentConditions} with a projected high of
        ${forecast.maxtempC}°C or ${forecast.maxtempF}°F and a low of 
        ${forecast.mintempC}°C or ${forecast.mintempF}°F on 
        ${forecast.date}.`;

        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`);
        reject();
      });
    });
  });
}
 
function WritetoDB(agent){  
  var DBName = request.body.queryResult.parameters.DBName;
  var grow_time = agent.parameters.grow_time11;
  var growing_season = agent.parameters.growing_season11;
  var ph_value = agent.parameters.ph_value11;
 

  agent.add(`Thanks Expert for the details, below data has been updated in Database:`);
   agent.add(`***************************************`);
  agent.add(`**plant name is ${DBName}:`);
  agent.add(`**grow_time is ${grow_time}:`);
  agent.add(`**growing_season is ${growing_season}:`);
  agent.add(`**ph value is ${ph_value}:`);
  agent.add(`***************************************`);
 return admin.database().ref('vegetables').child(`${DBName}`).set({
     grow_time: `${grow_time}`,
     growing_season: `${growing_season}`,
ph_value : `${ph_value}`,
   
});
 
}
 
async function callVisionApi(agent, bucketName, filename){
    // [START vision_text_detection_gcs]
  // Imports the Google Cloud client libraries
  // Creates a client
 
  const client = new vision.ImageAnnotatorClient();
  try {
    // Performs text detection on the gcs file
    const [result] = await client.landmarkDetection(`gs://agricultural-bot-njdmck.appspot.com/demo.jpg`);
    const detections = result.landmarkAnnotations;
    var detected = [];
    detections.forEach(text => {
    console.log(text.description);
    detected.push(text.description);
   });
    return detected;
    }
    catch(error) {
      console.log('fetch failed', error);
      return [];
    }
}
 
   
let intentMap = new Map();
intentMap.set('get_type', vegetation_schedule);
intentMap.set('explore_image', visionapi);
intentMap.set('news', news);
intentMap.set('DBName_intent', ReadfromDB);
intentMap.set('ask_expert', WritetoDB);
agent.handleRequest(intentMap);
});
