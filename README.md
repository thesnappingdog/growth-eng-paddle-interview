# Growth Engineer @ Paddle Technical Assignment

During the interview, please be prepared to show and run the program.

We currently use a customer data platform (CDP) called Hull.io at Paddle. This tool allows us to connect commercial tools like Salesforce and HubSpot to a centralised unit, compute properties by using virtual javascript environments (hull processor), sync data to tools, programmatically stitch together user and account profiles (identity resolution).

The core piece of Growth Engineering (and Hull) are called processors. They allow us to write custom business logic, and use data from sources that we purchase or scrape, without having to export/import or for it to live inside of another tool.

Think of Processors as one off scripts that receive a data payload, and are able to update attributes in the database.

This particular processor is called 'Account Compute'.

It's purpose is to listen to changes in account data, and then evaluate whether the account's attributes need to be updated.

The 'engine' so to speak is the class Compute. It takes in a strategy (set of instructions), and decides whether an update is needed, and if so, what the new attribute should be.

At the beginning we define a list of these strategies. Each strategy is looped through Compute, and if needed, the outputted attribute is added to the attributes object.

These will be the attributes that are updated.

You have been asked to add a couple of additional computations to the engine.

Feel free to use either TypeScript or JavaScript versions.

# Assignment

1. Fix strategy for 'name' property
2. Finish extracting the domain from website values

Add new strategies to array:

3. Compute unified value for number of employees
4. Compute unified value for name of country
5. Compute unified value for ISO-2 country code.

Use all available data in sample_account.json

Bonus: Add new features to Compute if something becomes repetetive.

# Compute features

- Able to find input data from a path specified
- Supports custom functions as a means to compute
- Checks account data against computation to see if an update is necessary

# interface Strategy

- output property: string => the name of the attribute to update
- input properties: string[] => array of paths to desired input values. derived from the account object
- compute_template: string => decides how the strategy is routed inside of Compute
- custom_method?: function + returns any value including objects => write your own custom function if no sutiable method present

# Requirements

- NodeJS https://nodejs.org/en/
- TypeScript (Optional) https://www.typescriptlang.org/download

# Setup

- git clone or download this repository
- install nodemon globally npm install -g nodemon
- use npm install or yarn to install dependencies

# Run Program in watch mode

- npm run compute-js for javascript version
- npm run compute-ts for typescript version
