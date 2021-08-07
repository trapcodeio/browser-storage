/**
 * This is an extension of the Trapcode.io Browser Storage for VUE.
 */
import {isRef, ref, watch} from "vue";
import WebStorage from "./WebStorage";

class VueWebStorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "VueWebStorage";
    }
}

class VueWebStorage extends WebStorage {
    private readonly types: Record<string, string> = {};

    constructor(type: string, namespace?: string, enableBase64Encryption: boolean = false) {
        super(type, namespace);
        this.enableBase64Encryption(enableBase64Encryption);

        let types: any = this.getObject("__types__", {});
        if (typeof types === "string") {
            // Encryption maybe enabled late.
            this.enableBase64Encryption();
            types = this.getObject("__types__", {});
            this.enableBase64Encryption(false);
        }

        this.types = types;
    }

    private setType(key: string, type: string) {
        this.types[key] = type;
        super.setObject("__types__", this.types);
        return this;
    }

    setAsType(key: string, value: any): this {
        const type = typeof value;

        switch (type) {
            case "undefined":
                return this.remove(key);
            case "boolean":
                return this.setType(key, "boolean").setBoolean(key, value);
            case "bigint":
                return this.setType(key, "bigint").setNumber(key, value);
            case "number":
                return this.setType(key, "number").setNumber(key, value);
            case "object":
                return this.setType(key, "object").setObject(key, value);
            default:
                return this.setType(key, "string").set(key, value);
        }
    }

    getAsType<T>(key: string, def?: T): T {
        const type = this.types[key];
        switch (type) {
            case "boolean":
                return super.getBoolean(key, def as any) as unknown as T;
            case "bigint":
                return super.getNumber(key, def as any) as unknown as T;
            case "number":
                return super.getNumber(key, def as any) as unknown as T;
            case "object":
                return super.getObject(key, def as any) as unknown as T;
            default:
                return super.get(key, def) as unknown as T;
        }
    }

    persist(set: Record<string, any>) {
        return persistToStorage(this, set);
    }

    persistedRef<T>(key: string, value?: T) {
        return persistedRefFromStorage<T>(this, key, value);
    }
}

function persistToStorage(store: VueWebStorage, set: Record<string, any>) {
    if (isRef(set))
        return console.warn(new VueWebStorageError(`persist must be an object not a ref!`));

    Object.entries(set).forEach(([key, val]) => {
        if (!isRef(val)) {
            return console.warn(
                new VueWebStorageError(`Persist object value must be a type of vue <Ref>`)
            );
        }

        if (val.value === undefined) {
            val.value = store.getAsType(key);

            if (val.value === undefined) store.remove(key);
        } else {
            store.setAsType(key, val.value);
        }

        watch(val, (n: any) => (n === undefined ? store.remove(key) : store.setAsType(key, n)));
    });

    return store;
}

function persistedRefFromStorage<T>(store: VueWebStorage, key: string, value?: T) {
    const thisRef = ref<T | undefined>(store.getAsType(key, value));
    store.persist({[key]: thisRef});
    return thisRef;
}

export function vueLocalStorage(namespace?: string, enableBase64Encryption?: boolean) {
    return new VueWebStorage("local", namespace);
}

export function vueSessionStorage(namespace?: string, enableBase64Encryption?: boolean) {
    return new VueWebStorage("session", namespace, enableBase64Encryption);
}

export default VueWebStorage;
