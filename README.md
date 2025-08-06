## nodeotdmtools

To decifer it ... node with oiyshTerminal tools set. Wraper
About the [otdmTools.py in wiki](https://github.com/yOyOeK1/oiyshTerminal/wiki/otdm-tools)

### using it

in bash

```bash
$ npm run ott -- -v 1
$ npm run ott -- -cliSapi "sum/1/2/.json"
$ npm run ott -- -cliSapi "echo/Hello from otdmTools :)/.json"
```

or 

in code nodejs

```js
runArgs( array_of_strings, callBack );
```

*array_of_strings* - **example** ['-v','1'] or [ "-cliSapi", "echo/Hello from otdmTools :)/.json" ]
*callBack* - will recive **data** *string* of result