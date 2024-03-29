type NativeObject = Record<string | number, any>;

const my_btoa = btoa || ((value: any) => value);
const my_atob = atob || ((value: any) => value);

class WebStorage {

    public namespace?: string;
    public store: Storage;
    private base64Encrypt: boolean = false;

    /**
     * WebStorage Constructor
     * @param type
     * @param namespace
     */
    constructor(type = "local", namespace?: string) {
        if (type === 'session') {
            this.store = window.sessionStorage;
        } else {
            this.store = window.localStorage;
        }

        this.namespace = namespace;

        return this;
    }


    /**
     * Enable Base64Encrypt
     */
    enableBase64Encryption(to ?: boolean) {
        try {
            if (!atob || !btoa) return this;
        } catch {
            return this;
        }

        this.base64Encrypt = to !== undefined ? to : true;

        return this;
    }

    /**
     * Get key with namespace prefixed
     * @param key
     * @returns {string}
     */
    n(key: string) {
        if (this.namespace && this.namespace.length) {
            return this.namespace + ':' + key;
        }

        return key
    }

    /**
     * Check if key exists
     * @param key
     * @returns {boolean}
     */
    has(key: string) {
        return !!this.get(key);
    }

    /**
     * Set Variable in store.
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    set(key: string, value: any) {
        this.store.setItem(this.n(key), this.base64Encrypt ? my_btoa(value) : value);
        return this;
    }


    /**
     * Set Object in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setObject(key: string, value: NativeObject) {
        let data: any = value;

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
    setArray(key: string, value: any[]) {
        return this.setObject(key, value);
    }


    /**
     * Set Number item in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setNumber(key: string, value: number = 0) {
        return this.set(key, value);
    }

    /**
     * Set Boolean item in store.
     * Uses JSON.stringify
     * @param key
     * @param value
     * @returns {WebStorage}
     */
    setBoolean(key: string, value: boolean = false) {
        return this.set(key, value);
    }

    /**
     * Get item form store
     * @param key
     * @param def
     * @returns {*}
     */
    get<T = any>(key: string, def?: T): T {
        const value: any = this.store.getItem(this.n(key));
        if (value === null) return def as T;
        return (this.base64Encrypt ? my_atob(value) : value) as T;
    }

    /**
     * Get True or false values
     * @param key
     * @param def
     * @returns {boolean}
     */
    getBoolean(key: string, def: boolean = false): boolean {
        if (!this.has(key)) return def;
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
    getObject<T = NativeObject>(key: string, def?: T): T {
        const value: any = this.get(key, def);
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
            }
        }
        return value as T;
    }

    /**
     * Get array from store
     * Uses JSON.parse
     * @param key
     * @param def
     * @returns {[]}
     */
    getArray<T = any[]>(key: string, def?: T): T {
        return this.getObject(key, def);
    }


    /**
     * Get Number from store
     * @param key
     * @param def
     * @return {number}
     */
    getNumber(key: string, def?: any): number {
        let value = Number(this.get(key, def));

        if (isNaN(value)) {
            throw Error(`Value for key: {${key}} is not a number!`)
        }

        return value;
    }

    /**
     * Delete Item from store
     * @param key
     * @return {WebStorage}
     * @deprecated - Use .remove instead
     */
    del(key: string) {
        this.store.removeItem(this.n(key));
        return this;
    }


    /**
     * Remove Item from store
     * @param key
     * @return {WebStorage}
     */
    remove(key: string) {
        this.store.removeItem(this.n(key));
        return this;
    }
}

export default WebStorage;