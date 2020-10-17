# Khetihar-Chat
A serverless agricultural smart chatbot in a multi-user environment 


Setup Instructions:

Models For Sentiment and Image Analytics:

Enable API AutoML sentiment and AutoML Vision API from your project.
use the dataset information provided in our report to clean and organize it before testing.
Create Models in AutoML with the above datasets.
this can take around 3 hrs to train.
Store Model_id and put that in the respective code in the code folder above.
Test the code and evaluate the results.


News Function setup instructions:

Create an intent named "News Function" with entity @sys.any.
Create an account in PeakMetrics API.
Store the API key Listed there. This will also be mailed to you.
Put the API code in news function in INDEX.js
Use Slack to test this Function.


Weather Forecasting:

Create an intent named "Weather Forecasting" with entity @sys.city.
Create an account in OpenWeatherMap API.
Store the API key Listed there. This will also be mailed to you.
Put the API code in weather function in INDEX.js
Use Slack to test this Function.


Big query setup instructions:

Go to your project id and select Apis and services.
Enable Bigquery in API and Services.
Create a JSON credential file for big query
Go to Big Query Console and create a database and table with Following Column Names:
a) User_id
b) Date
c) message
Create an intent for a big query.
Enable Fulfillment code, Index.js will take care of the rest.
Provide credential information in Python Script.
Rune the Script and test.


Function Database Read Write:

create a table in Firebase Realtime Database
Add entries in Database tables for vegetation details.
Initialize DB connection In fulfillment code by providing Database URL
for Intents, log on the Project, and import the zip file agricultural_bot.zip. This will import all the intents
Ensure webhook is enabled for the Intents
Trigger the webhook function by entering the correct intent like "information about" for retrieving database
Trigger the webhook function by entering the intent like "Expert kindly help " for adding entries in the database.


Predict Function using AutoML :

Create a bucket in google storage
Add Plant village dataset in the bucket
Initialize DB connection In fulfillment code by providing Database URL
Create AutoML Model using vision Image function file agro_bot.zip. This will import all the intents
Ensure webhook is enabled for the Intents
Trigger the webhook function by entering the correct intent like "identity" for using Predict Function.
Trigger the webhook function by entering the intent like "Expert kindly help " for adding entries in the database.
Additional Check: Use the Predict function in python by using the python code to Predict .ipynb File
