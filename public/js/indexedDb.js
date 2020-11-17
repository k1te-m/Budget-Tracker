const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

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

function saveRecord(record) {
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}

function checkBudgetDB() {
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

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