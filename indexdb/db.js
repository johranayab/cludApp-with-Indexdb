const form = document.querySelector("form");
const submit = document.querySelector(".submit");

const updates = document.querySelector(".update");

const tbody = document.querySelector("table>tbody");

submit.addEventListener("click", () => {
  let idb = indexedDB.open("crud", 1);
  idb.onupgradeneeded = () => {
    let res = idb.result;
    res.createObjectStore("data", { autoIncrement: true });
  };
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction("data", "readwrite");
    let store = tx.objectStore("data");
    store.put({
      name: form[0].value,

      email: form[1].value,
      number: form[2].value,
      address: form[3].value,
    });
  };
});

function read() {
  let idb = indexedDB.open("crud", 1);
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction("data", "readonly");
    let store = tx.objectStore("data");
    let cursor = store.openCursor();
    cursor.onsuccess = () => {
      let curRes = cursor.result;
      if (curRes) {
        console.log(curRes.value.name);

        tbody.innerHTML += `
        
        <tr>
<td>${curRes.value.name}</td>
<td>${curRes.value.email}</td>
<td>${curRes.value.number}</td>
<td>${curRes.value.address}</td>
<td onclick=update(${curRes.primaryKey}) class="up"> 
Update
</td>

<td onclick=del(${curRes.primaryKey}) class="del"> 
delete
</td>
        </tr> 
        
        `;

        curRes.continue();
      }
    };
  };
}

function del(id) {
  let idb = indexedDB.open("crud", 1);
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction("data", "readwrite");
    let store = tx.objectStore("data");
    store.delete(id);
    console.log("delet");

    alert("Data has been deleted ");
    location.reload();
    read();
  };
}

let updateKey;
function update(id) {
  submit.style.display = "none";
  updates.style.display = "block";
  updateKey = id;
}
updates.addEventListener("click", () => {
  let idb = indexedDB.open("crud", 1);
  idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction("data", "readwrite");
    let store = tx.objectStore("data");
    store.put(
      {
        name: form[0].value,

        email: form[1].value,
        number: form[2].value,
        address: form[3].value,
      },
      updateKey
    );
    alert("data has been update");
    location.reload();
  };
});

read();
