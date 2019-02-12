# wdio-json-reporter

JSON reporter for WebdriverIO v5

This will create a JSON file when you specify the `outputDir` in the reporters section of your `wdio.conf.js` config file.

The documentation says I can use `this.write()` to create a file or print to screen but I was unable to get it to work properly so I just made it create a file.

I was only interested in the test data but in case someone wanted to expose the runner config you can set `printRunnerStats: true` in your WDIO config and it will also create a separate file that has the config `sanitizedCapabilities`.

There are defaults in place for creating the file but you can provide `outputDir` for the relative path and `filename` for the name of the file.
