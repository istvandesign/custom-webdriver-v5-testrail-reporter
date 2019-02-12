# custom-webdriver-v5-json-reporter

JSON reporter for WebdriverIO v5

To use this reporter:

1. Install via npm or yarn: `yarn add custom-webdriver-v5-json-reporter`
2. Require it in your WDIO config file

```
    const myReporter = require('custom-webdriver-v5-json-reporter').default;
```

3. Add it to the list of reporters

```
// wdio.conf.js
{
    ...
    reporters: [[myReporter, { stdout: false, outputDir: './reports' }]],
    ...
}
```

You can change `stdout` to `true` if you only want to print to the screen. If you choose `false` the default `'./'` path will be used to generate reports. If you can provide a `outputDir` and `filename` if you want control what data is created.

**NOTE:** The documentation says I can use `this.write()` to create a file or print to screen but I was unable to get it to work properly and looking at the sumo reporter example in the documentation I didn't see it used, so I just used console.log and fs.writeFile.

I was only interested in the test data but in case someone wanted to expose the runner config you can set `printRunnerStats: true` in your WDIO config and it will also create a separate file that has the config `sanitizedCapabilities`. I didn't provide a way to change the filenames and paths here.
