## Docker execution
1. `docker-compose -f docker-compose.yml build`
2. `docker-compose -f docker-compose.yml up --scale chrome=2 --scale firefox=2 --scale edge=2 -d`

## Selenium Web Driver in different environments
### OS (Windows)
```javascript
const driver = await new Builder().forBrowser(Browser.CHROME).build();
```
### Docker (`selenium/hub` + `selenium/node-[browserName]` images)
```javascript
const capabilities = Capabilities.chrome();

const driver = new Builder()
  .usingServer('http://selenium-hub:4444/wd/hub')
  .withCapabilities(capabilities)
  .build();
```
## Warning #1
Selenium Webdriver cannot set the browser window width below 500px in any environment.
One possible solution is to use [browser's mobile emulation](https://stackoverflow.com/questions/56054665/chrome-webdriver-set-viewport-below-500px).

## Warning #2

If a screenshot contains a vertical scrollbar, it is always cropped automatically.
The width of the vertical scrollbar is 17 pixels. This means that the width of the output screenshot will be 17 pixels smaller than expected.

## Warning #3
Selenium Webdriver cannot set the browser window height greater than the actual height of the display (in my case 1080px) on WINDOWS.
Including the browser app bar, a screenshot height cannot exceed 962.
***This does not apply to the docker environment!***

| Expected screenshot size | 800x800 | 1920x1080 | 1200x1000 |
|--------------------------|---------|-----------|-----------|
| OS (Windows)             | 800x800 | 1920x962  | 1200x962  |
| Docker                   | 800x800 | 1920x1080 | 1200x1000 |

It's not a big deal. It's just a fact, that I should've taken into account during my local tests.

## HTTP access across containers of docker-compose
1. Selenium hub: `http://selenium-hub:4444/wd/hub`
2. Reference solution: `http://reference-solution:8080/`
