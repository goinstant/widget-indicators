[![Build Status](https://travis-ci.org/goinstant/widget-indicators.png?branch=master)](https://travis-ci.org/goinstant/widget-indicators)

## [Widget Indicators](https://developers.goinstant.com/v1/widgets/widget_indicators.html)

The [GoInstant](https://goinstant.com) Widget Indicators component creates an
indicator when some action is performed on an unfocused widget.

[Sign up](https://goinstant.com/signup) and build a GoInstant application today.
You can learn more in our [guides](https://developers.goinstant.com/v1/widgets/guides/index.html),
and [documentation](https://developers.goinstant.com/v1/widgets/widget_indicators.html).

Have questions? Contact us using [this form](https://goinstant.com/contact) or
chat with us on IRC. #goinstant on [Freenode](http://freenode.net/).

## Contributing

### Development Dependencies

- [node.js](http://nodejs.org/) >= 0.8.0
- [grunt-cli installed globally](http://gruntjs.com/getting-started)
  - `npm install -g grunt-cli`

### Set-Up

The following assumes that you have already installed the dependencies above.

```
git clone https://github.com/goinstant/widget-indicators.git
cd widget-indicators
npm install
```

#### Building Widget Indicators for Development

The Widget Indicators component is built as a [component](https://github.com/component/component).
Feel free to manually install dependencies and build using the `component`
command line tool.

For convenience, we've included a simple grunt command for installing
component dependencies and building:

```
grunt build
```

If this command runs succesfully you'll now have `components` and `build`
directories in your Git repo root.

### Running Tests

Tests are written in [mocha](http://mochajs.org/). They're run
in an [HTML file](http://mochajs.org/#html).

Just open the test/index.html file to run the tests.

On Mac OS, you can just run this command to open the HTML Runner in your
default browser:

```
open test/index.html
```
