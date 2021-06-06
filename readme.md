# Browser Storage

A simple package for managing `localstorage` & `sessionStorage`.
### Installation
```shell
npm i @trapcode/browser-storage
# OR
yarn add @trapcode/browser-storage
```

### Problem
The native `localstorage` and `sessionStorage` stores every data as `string` by default, This makes **setting** and **getting** other types difficult.
For example: 

```javascript
localStorage.setItem("isVerified", true)
localStorage.setItem("age", 18)
localStorage.setItem("object", {foo: "bar"})

// All will return as string regardless
localStorage.getItem("isVerified") // "true" as string
localStorage.getItem("age") // "18" as string
localStorage.getItem("object") // "[Object Object]" as string
```

From the above example, you will have to do some conversions to get the original data type stored.

### Solution
The way the browser stores data cannot be modified but how you **set & get** data can make a huge difference. 
This package includes **semantic helper methods** that adds some sort of **type certainty**.

For example:
```javascript
// Import and initialize store.
import BrowserStorage from '@trapcode/browser-storage';
const localStore = BrowserStorage.getLocalStore();

localStore.setBoolean("isVerified", true)
localStore.setNumber("age", 18)
localStore.setObject("object", {foo: "bar"})


// Your sure you get teh exact type.
localStore.getBoolean("isVerified") // true as boolean
localStore.getNumber("age") // 18 as number
localStore.getObject("object", {foo: "bar"}) // {foo: "bar"} as object
```


### Base64Encryption
if you don't want the values in your store to be humanly readable, you can enable `Base64Encryption`. 
Your data will be **Encoded** on `set` actions and **Decoded** automatically on `get` actions

```javascript
import BrowserStorage from '@trapcode/browser-storage';

// Initialize
const localStore = BrowserStorage.getLocalStore();
// Enable Encryption
localStore.enableBase64Encryption()


// Also accepts true/false value as argument
localStore.enableBase64Encryption(true/false)

// For example
localStore.enableBase64Encryption(process.env.NODE_ENV === "production")
```