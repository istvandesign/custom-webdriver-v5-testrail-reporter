# custom-webdriver-v5-testrail-reporter

# Getting started

Install the reporter `npm i custom-webdriver-v5-testrail-reporter`

# Set up

There are four fields that are required in the reporter config in order to be able to use this reporter. See example below.

```
// wdio.conf.js
const myReporter = require('custom-webdriver-v5-testrail-reporter');

const config = {
    ...
    reporters: [
            [
                myReporter,
                {
                    testRailUrl: '<base url, no http prefix>',
                    username: '<testrail username>',
                    password: '<testrail password>',
                    projectId: <testrail project id, number>,
                },
            ],
        ],
    ...
}
```

#
