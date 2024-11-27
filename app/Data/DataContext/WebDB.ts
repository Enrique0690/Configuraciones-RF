export function openDB(db_name: string, version = 1) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        let request = indexedDB.open(db_name, version); // "myDatabase" is the name of the database

        // Event handler for when the database is being upgraded (or created)
        request.onupgradeneeded = function (event) {
            const target: any = event.target;
            const db: IDBDatabase = target.result;

            // Check if the object store already exists to avoid re-creating it
            if (!db.objectStoreNames.contains("ajustes")) {
                // Create an object store with a primary key (keyPath can be "id" or any unique field)
                db.createObjectStore("ajustes", {});
            }
        };
        request.onsuccess = (event) => {
            const target: any = event.target;
            const db: IDBDatabase = target?.result;
            // You can now interact with the database
            resolve(db);
        };
        request.onerror = function (event) {
            const target: any = event.target;
            console.error("Database error: " + target?.error);
            reject(target?.error);
        };
    });
}

export function readStoreKey<T extends {}>(db: IDBDatabase, storeName: string, id: number) {
    return new Promise<T>((resolve, reject) => {
        let transaction = db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);

        const cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (event) {
            const target: any = event.target;
            let data = target.result;
            resolve(data);
        };

        cursorRequest.onerror = function (event) {
            const target: any = event.target;
            console.error("Error reading data:", target.error);
            reject(target.error);
        };
    })
}


export function writeStore<T extends {}>(db: IDBDatabase, storeName: string, id: number, value: any) {
    return new Promise<Array<T>>((resolve, reject) => {
        let transaction = db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);

        const cursorRequest = store.put(value, id);

        cursorRequest.onsuccess = function (event) {
            const target: any = event.target;
            let data = target.result;
            resolve(data);
        };

        cursorRequest.onerror = function (event) {
            const target: any = event.target;
            console.error("Error reading data:", target.error);
            reject(target.error);
        };
    })
}
