
# ECG Power App Recharge Platform

## Running Locally

Make sure you have [Go](http://golang.org/doc/install) version 1.12 or newer and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone https://github.com/jayluxferro/enersmart.git
$ cd enersmart
$ go build -o bin/enersmart -v . # or `go build -o bin/enersmart -v .` in git bash
github.com/mattn/go-colorable
gopkg.in/bluesuncorp/validator.v5
golang.org/x/net/context
github.com/heroku/x/hmetrics
github.com/gin-gonic/gin/render
github.com/manucorporat/sse
github.com/heroku/x/hmetrics/onload
github.com/gin-gonic/gin/binding
github.com/gin-gonic/gin
github.com/jayluxferro/enersmart
$ heroku local
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```sh
$ heroku create
$ git push heroku main
$ heroku open
```

or

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
