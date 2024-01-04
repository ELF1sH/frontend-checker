## Docker execution
1. `docker-compose -f docker-compose.yml build`
2. `docker-compose -f docker-compose.yml up -d`

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



## HTTP access between containers of docker-compose
1. Selenium hub: `http://selenium-hub:4444/wd/hub`
2. Reference solution: `http://reference-solution:8080/`
