'use strict';

require('dotenv').config();

const { CloudRobot } = require('@automationcloud/cloud-robot');
const inquirer = require('inquirer');

const robot = new CloudRobot({
    serviceId: '0fdb77e6-2871-4b13-9e98-cc62a60e4af7',
    auth: process.env.SECRET_KEY
});

robot.createJob().then(async job => {
    const { search } = await inquirer.prompt([{
        type: 'input',
        name: 'search',
        message: 'What should your job search for?'
    }]);

    await job.submitInput('search', search);

    job.onAwaitingInput('selectedSearchResult', async () => {
        const [ availableSearchResults ] = await job.waitForOutputs('availableSearchResults');
        const { selectedSearchResult } = await inquirer.prompt([{
            type: 'list',
            name: 'selectedSearchResult',
            message: 'Pick a search result to visit',
            choices: availableSearchResults
        }]);
        return selectedSearchResult;
    });

    const [ title ] = await job.waitForOutputs('title');
    console.log(title);
})
    .catch(err => {
        console.log('error processing job', err);
        process.exit(1);
    });
