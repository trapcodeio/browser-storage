# Browser Storage

Using `localStorage` and `sessionStorage` in your projects.

#### Example

```javascript
const store = BrowserStorage.new('app')
// or 
const store = new BrowserStorage('app')

// Usage
store.local.set('foo', 'bar'); // {'app:foo': 'bar'}
store.local.setObject('foo', {key: 'name', value: 'john'}); // {'app:foo': "{key: 'name', value: 'john'}"}

// Same with session
store.session.set('foo', 'bar'); // {'app:foo': 'bar'}
store.session.setObject('foo', {key: 'name', value: 'john'}); // {'app:foo': "{key: 'name', value: 'john'}"}
```

### Example 2

```javascript
const store = new BrowserStorage('app')

store.setObject('object', {foo: 'bar'});
store.setArray('array', [1, 2, 3, 4, 5]);
store.setBoolean('boolean', true);
store.setNumber('number', 1910);

console.log('object:', store.getObject('object'));
console.log('array:', store.getArray('array'));
console.log('boolean:', store.getBoolean('boolean'));
console.log('number:', store.getNumber('number'));
```