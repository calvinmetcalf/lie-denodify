# lie-denodify


## API

```bash
npm install lie-denodify
```

```javascript
var denodify = require('lie-denodify');
```

###denodify

```javascript
denodify(func, context[optional]);
```

takes as an argument a function which has a callback as it's last argument, returns a function that acts identically except it returns a promise instead of taking a callback and that arguments passed to the function may be promises as well

As a second argument it can take an object to call the function as a method of, if omitted calls it in the same context that the function was called (i.e. like normal).

## License

  MIT
