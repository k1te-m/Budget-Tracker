// Browser compatability for indexedDB
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

// create a new request for indexedDB "budgetTracker" database
const request = indexedDB.open("budgetTracker", 1);

request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore("pending", {
        keyPath: "id",
        autoIncrement: true
    });
};


request.onerror = (error) => {
    console.log(error);
}

request.onsuccess = (event) => {
    db = event.target.result;

    if(navigator.onLine) {
        checkBudgetDB();
    }
}

// Called in index.js when offline
function saveRecord(record) {
    // Creates "pending" objectStore with readwrite access
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    // add the record to the pending object store
    store.add(record);
}

// called when connection is re-established
function checkBudgetDB() {
    // opens a transaction on the pending db with readwrite access
    // Gets all Records from store
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    // on success, open a transaction in the pending db, then clear
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
              .then((response) => response.json())
              .then(() => {
                  const transaction = db.transaction("pending", "readwrite");
                  const store = transaction.objectStore("pending");
                  store.clear();
              })
        }
    }
}

// listen for app coming back online
window.addEventListener("online", checkBudgetDB);