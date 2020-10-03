// Storage Controller

const StorageCtrl = (function() {
  console.log("local storage loaded");

  var firebaseConfig = {
    apiKey: "AIzaSyDKLBJRmKvXWQi2wkig6qMspxFdMy_3fPY",
    authDomain: "crud-codingmart-training.firebaseapp.com",
    databaseURL: "https://crud-codingmart-training.firebaseio.com",
    projectId: "crud-codingmart-training",
    storageBucket: "crud-codingmart-training.appspot.com",
    messagingSenderId: "525826162762",
    appId: "1:525826162762:web:311ba0dbaa65f2d4d326b3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  return {
    storeItem: function(item) {
      let Items;
      if (localStorage.getItem("Items") === null) {
        Items = [];
        localStorage.setItem("Items", JSON.stringify(Items));
      } else {
        Items = JSON.parse(localStorage.getItem("Items"));
      }
      Items.push(item);
      localStorage.setItem("Items", JSON.stringify(Items));
      console.log("item added to localStorage");

      // Firebase Storing
      firebase
        .database()
        .ref("items/" + item.id)
        .set(item);
    },
    getItemsFromStorage: async function() {
      // let Items;
      // if (localStorage.getItem("Items") === null) {
      //   Items = [];
      // } else {
      //   Items = JSON.parse(localStorage.getItem("Items"));
      // }

      // Firebase Rretrival
      let promise = new Promise(async (resolve, reject) => {
        let values = await firebase
          .database()
          .ref("/items/")
          .once("value", async data => {
            array = data.val();
          })
          .then(() => {
            resolve(array);
          });
      });

      return promise.then(val => {
        return val;
      });
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Constructor Item
  const item = function(id, name, price, desp, imgLink, quant) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.desp = desp;
    this.imgLink = imgLink;
    this.quant = quant;
  };

  // Data Structure
  const data = {
    // items: [
    //   {
    //     id: 1,
    //     name: "ring",
    //     price: 20,
    //     desp: "A good Ring",
    //     imgLink: "./imgs/test.jpg"
    //   },
    //   {
    //     id: 2,
    //     name: "car",
    //     price: 200,
    //     desp: "lamborghini",
    //     imgLink: "./imgs/test.jpg"
    //   }
    // ]
    items: null,
    currentItem: null
  };

  console.log("items", data, Array.isArray(data.items));
  // PUBLIC methods
  return {
    setItems: async function(items) {
      if (items) data.items = items;
      else {
        items = await StorageCtrl.getItemsFromStorage();
        data.items = items ? items : [];
      }
    },
    getItems: function() {
      console.log("First", data);
      return data.items;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    addItem: function(name, desp, price, imgLink, quant) {
      //CREATE IDS
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create a NewItem from Item Contrustor
      // let newItem = new item(ID, name, price, desp, imgLink, quant);
      // add to Item Array
      let obj = {
        id: ID,
        name: name,
        price: price,
        desp: desp,
        imgLink: imgLink,
        quant: quant
      };
      // console.log("New Item ==========", newItem);
      data.items.push(obj);
      console.log("Data Added", data.items);
      return obj;
    },

    logdata: function() {
      console.log(`Logging items.... ${data.items}`);
      console.log(Array.isArray(data.items), "check3");
      return data.items;
    }
  };
})();
// UI controller

const UICtrl = (function() {
  const UISelectors = {
    itemName: "#product-name",
    itemPrice: "#product-cost",
    itemDesp: "#product-description",
    itemImg: "#product-image",
    addBtn: "#additembtn",
    updateBtn: "#updateitembtn",
    deleteBtn: "#deleteitembtn",
    backBtn: "#backbtn",
    itemList: ".list-group",
    ListItem: ".list-group li",
    editBtn: "#edititemBtn"
  };

  return {
    getSelectors: function() {
      return UISelectors;
    },
    populateItemList: function(items) {
      // let html = "";
      if (items && items.length > 0)
        for (var i = 0; i < items.length; i++) {
          UICtrl.addListItem(items[i]);
        }
      // document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    generateBill: function(item, qunt) {
      console.log("generating Bill..");
      let Totalprice = String(parseInt(item.price) * parseInt(qunt));
      console.log(Totalprice);
      billItem = {
        name: item.name,
        price: Totalprice,
        desp: item.desp,
        quantity: qunt,
        cost: item.price
      };

      sessionStorage.setItem("bill", JSON.stringify(billItem));
      // insert item
      // document.querySelector("#bill").appendChild(li);
    },
    addListItem: function(item) {
      // Show list
      // document.querySelector(UISelectors.itemList).style.display = "block";
      // Create elemt li
      const li = document.createElement("li");
      //add class
      li.className =
        "list-group-item d-flex justify-content-between align-items-center flex-fixed-width-item";
      // Add id
      li.id = `item-${item.id}`;
      // item.imgLink = "data:image/png;base64," + item.imgLink;
      // add html
      li.innerHTML = `<img
      style="height: 200px; width: 30%; display: block;"
      src="${item.imgLink}"
      alt="Card image"
    />

    <div class="card-body mt-4" style="width: 100px;">
      <h4 class="card-title">${item.name}</h4>
      <h6 class="card-subtitle mb-2 text-muted">Description</h6>
      <p class="card-text">
        ${item.desp}
      </p>
    </div>
    <div class="card-body mt-3">
      <span class="badge badge-pill badge-success">Rs.${item.price}</span>
    </div>

    <div class="card-body">
      <div class="form-group" style="width: 30%;">
        <label
          class="col-form-label"
          for="product-quant-cust"
          style="float: left;"
          >Item Quant</label
        >
        <input
          type="number"
          min="1"
          max="${item.quant}"
          class="form-control product-quant"
          placeholder="Quantity"
          id="product-quant-cust"
          value="1"
          required
        />
      </div>
    </div>
    <div class="card-footer text-muted mt-2">
      <button class="btn btn-primary buy-item">BUY</button>
    </div>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    }
  };
})();

// app main

const app = (function(ItemCtrl, UICtrl) {
  function loadEventListeners() {
    const UISelectors = UICtrl.getSelectors();
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", buyItem);
  }

  const buyItem = function(e) {
    // console.log(e.target);
    if (e.target.classList.contains("buy-item")) {
      console.log("Buying state....!");

      // get list item id
      const listId = e.target.parentNode.parentNode.id;
      const qunt = e.target.parentNode.parentNode.querySelector(
        ".product-quant"
      ).value;
      // console.log(qunt);
      // Break id into array
      const listIdArr = listId.split("-");

      // Get Actual Id for Edit Item
      const id = parseInt(listIdArr[1]);
      console.log(id);

      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      UICtrl.generateBill(itemToEdit, qunt);
      window.location.assign("./bill.html");
    }
  };
  return {
    init: async function() {
      loadEventListeners();

      // hide edit state

      await ItemCtrl.setItems();
      // fetch data from data Structure
      // const items = await ItemCtrl.getItems();
      // console.log("Hai ", ItemCtrl.getItems());
      UICtrl.populateItemList(ItemCtrl.getItems());
      // console.log(items, "items at app");
      // populate list with items

      console.log("App initialized...!");
    }
  };
})(ItemCtrl, UICtrl);

app.init();
