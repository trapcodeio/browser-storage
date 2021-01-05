(function () {
    'use strict';

    class WebStorage {
        /**
         * WebStorage Constructor
         * @param type
         * @param namespace
         */
        constructor(type = "local", namespace) {
            if (type === 'session') {
                this.store = sessionStorage;
            }
            else {
                this.store = localStorage;
            }
            this.namespace = namespace;
            return this;
        }
        /**
         * Get key with namespace prefixed
         * @param key
         * @returns {string}
         */
        n(key) {
            if (this.namespace && this.namespace.length) {
                return this.namespace + ':' + key;
            }
            return key;
        }
        /**
         * Check if key exists
         * @param key
         * @returns {boolean}
         */
        has(key) {
            return !!this.get(key);
        }
        /**
         * Set Variable in store.
         * @param key
         * @param value
         * @returns {WebStorage}
         */
        set(key, value) {
            this.store.setItem(this.n(key), value);
            return this;
        }
        /**
         * Set Object in store.
         * Uses JSON.stringify
         * @param key
         * @param value
         * @returns {WebStorage}
         */
        setObject(key, value) {
            let data = value;
            if (typeof data === "object")
                data = JSON.stringify(data);
            return this.set(key, data);
        }
        /**
         * Set Array in store.
         * Uses JSON.stringify
         * @param key
         * @param value
         * @returns {WebStorage}
         */
        setArray(key, value) {
            return this.setObject(key, value);
        }
        /**
         * Set Number item in store.
         * Uses JSON.stringify
         * @param key
         * @param value
         * @returns {WebStorage}
         */
        setNumber(key, value = 0) {
            return this.set(key, value);
        }
        /**
         * Set Boolean item in store.
         * Uses JSON.stringify
         * @param key
         * @param value
         * @returns {WebStorage}
         */
        setBoolean(key, value = false) {
            return this.set(key, value);
        }
        /**
         * Get item form store
         * @param key
         * @param def
         * @returns {*}
         */
        get(key, def) {
            const value = this.store.getItem(this.n(key));
            if (value === null)
                return def;
            return value;
        }
        /**
         * Get True or false values
         * @param key
         * @returns {boolean}
         */
        getBoolean(key) {
            const value = this.get(key);
            if (value && typeof value === "string") {
                return value.toLowerCase() === 'true';
            }
            return false;
        }
        /**
         * Get object from store
         * Uses JSON.parse
         * @param key
         * @param def
         * @returns {{}|[]}
         */
        getObject(key, def) {
            const value = this.get(key, def);
            if (typeof value === "string") {
                try {
                    return JSON.parse(value);
                }
                catch {
                }
            }
            return value;
        }
        /**
         * Get array from store
         * Uses JSON.parse
         * @param key
         * @param def
         * @returns {[]}
         */
        getArray(key, def) {
            return this.getObject(key, def);
        }
        /**
         * Get Number from store
         * @param key
         * @param def
         * @return {number}
         */
        getNumber(key, def) {
            let value = Number(this.get(key, def));
            if (isNaN(value)) {
                throw Error(`Value for key: {${key}} is not a number!`);
            }
            return value;
        }
        /**
         * Delete Item from store
         * @param key
         * @return {WebStorage}
         * @deprecated - Use .remove instead
         */
        del(key) {
            this.store.removeItem(this.n(key));
            return this;
        }
        /**
         * Remove Item from store
         * @param key
         * @return {WebStorage}
         */
        remove(key) {
            this.store.removeItem(this.n(key));
            return this;
        }
    }

    class BrowserStorage {
        /**
         *  BrowserStorage constructor
         * @param {string} namespace - Namespace for keys
         */
        constructor(namespace) {
            if (namespace) {
                this.namespace = namespace;
            }
            this.local = new WebStorage('local', namespace);
            this.session = new WebStorage('session', namespace);
            return this;
        }
        /**
         * Create new instance of BrowserStorage
         * @param {string} namespace - Namespace for keys
         * @returns {BrowserStorage}
         *
         * @example
         *  const store = BrowserStorage.new()
         *  // same as
         *  const store = new BrowserStorage();
         */
        static new(namespace) {
            return new BrowserStorage(namespace);
        }
        /**
         * Get LocalStorage WebStorage
         * @param namespace
         * @returns {WebStorage}
         */
        static getLocalStore(namespace) {
            return new WebStorage('local', namespace);
        }
        /**
         * Get SessionStore WebStorage
         * @param namespace
         * @returns {WebStorage}
         */
        static getSessionStore(namespace) {
            return new WebStorage('session', namespace);
        }
    }

    if (window && !window.hasOwnProperty('BrowserStorage')) {
        // @ts-ignore
        window['BrowserStorage'] = BrowserStorage;
    }

    return BrowserStorage;

}());
