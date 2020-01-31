# Browser Storage
Using `localStorage` and `sessionStorage` in your projects.

#### Docs Coming Soon
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