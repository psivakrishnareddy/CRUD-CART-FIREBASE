// Storage Controller

const StorageCtrl = (function() {
  console.log("local storage loaded");
  const itemS = function(id, name, price, desp, imgLink, quant) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.desp = desp;
    this.imgLink = imgLink;
    this.quant = quant;
  };
  var itemDATA = [];
  // Your web app's Firebase configuration
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

  // var database = firebase.database();
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
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("Items"));
      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          // removes item at index and replaces with updated item
          items.splice(index, 1, updatedItem);
          console.log("storage updated");
        }
      });

      // Firebase Storing
      firebase
        .database()
        .ref("items/" + updatedItem.id)
        .set(updatedItem);
      localStorage.setItem("Items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("Items"));
      items.forEach(function(item, index) {
        if (id === item.id) {
          items.splice(index, 1);
          console.log("storage item deleted");
          firebase
            .database()
            .ref("items/" + item.id)
            .remove();

          ItemCtrl.setItems();
        }
      });
      // Firebase Storing

      localStorage.setItem("Items", JSON.stringify(items));
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
    deleteItem: function(id) {
      // get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });
      // Get Index of item
      const index = ids.indexOf(id);
      // remove item
      data.items.splice(index, 1);
    },

    updateItem: function(name, desp, price, imgLink, quant) {
      // convert form input to real number
      price = parseInt(price);
      quant = parseInt(quant);

      let found = null;
      // Find the item in Current id
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.price = price;
          item.desp = desp;
          item.imgLink = imgLink;
          item.quant = quant;
          found = item;
        }
      });
      return found;
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
    editBtn: "#edititemBtn",
    itemQuant: "#product-quant"
  };
  var imageB64;

  return {
    setImgaeBase64: function(image) {
      imageB64 = image;
    },
    getSelectors: function() {
      return UISelectors;
    },
    populateItemList: function(items) {
      // let html = "";
      console.log("item==>>>>>>>>>>>>>>>>>", items);

      // items.forEach(item => {
      //   UICtrl.addListItem(item);
      // });
      // let im = Object.values(items);
      // console.log(typeof im);
      // im.map(value => {
      //   console.log("value...........", value);
      //   UICtrl.addListItem(value);
      // });
      if (items && items.length > 0)
        for (var i = 0; i < items.length; i++) {
          UICtrl.addListItem(items[i]);
        }

      // document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    deleteListItem: function(id) {
      // get id
      const itemID = `#item-${id}`;
      // get item from list
      const item = document.querySelector(itemID);
      //remove
      item.remove();
    },
    updateListitem: function(item) {
      let ListItem = document.querySelectorAll(UISelectors.ListItem);

      // node list converted to array
      ListItem = Array.from(ListItem);

      // loop
      ListItem.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          // item.imgLink = "data:image/png;base64," + item.imgLink;
          document.querySelector(`#${itemID}`).innerHTML = `<img
          src="${item.imgLink}"
          alt=""
          srcset=""
          style="width: 100px;height: 100px;padding-right: 10px; margin:10px"

        />
        <strong
          id="item-list-name"
          style="float: left;margin: 22px;"
          >${item.name}</strong
        >
        <em id="desp" style="float: left;">${item.desp}</em>
        <span class="badge badge-success badge-pill">Rs.${item.price}</span>
        <span class="badge badge-info badge-pill">Quantity:${item.quant}</span>
        <span
          class="badge badge-primary badge-pill"
          style="float: right; margin: 8%;"
        >
          <i class="edit-item fa fa-pencil-square-o" aria-hidden="true" style="font-size=30px"></i
        ></span>`;
        }
      });

      console.log(ListItem);
    },
    clearInput: function() {
      //Clear Input Fields
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemQuant).value = "";
      document.querySelector(UISelectors.itemDesp).value = "";
      document.querySelector(UISelectors.itemPrice).value = "";
      document.querySelector(UISelectors.itemImg).value = "";
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    readProductDetails: function() {
      return {
        productname: document.querySelector(UISelectors.itemName).value,
        productprice: document.querySelector(UISelectors.itemPrice).value,
        productDesp: document.querySelector(UISelectors.itemDesp).value,
        productImg: imageB64,
        productQant: document.querySelector(UISelectors.itemQuant).value
      };
    },
    getBase64Image: function() {},
    addItemToForm: function() {
      let currentItem = ItemCtrl.getCurrentItem();
      (document.querySelector(UISelectors.itemName).value = currentItem.name),
        (document.querySelector(UISelectors.itemPrice).value =
          currentItem.price),
        (document.querySelector(UISelectors.itemDesp).value = currentItem.desp),
        (document.querySelector(UISelectors.itemImg).src = currentItem.imgLink);
      document.querySelector(UISelectors.itemQuant).value = currentItem.quant;
      UICtrl.showEditState();
    },

    addListItem: function(item) {
      // Show list
      // document.querySelector(UISelectors.itemList).style.display = "block";
      // Create elemt li
      console.log("adding item ", item.id);
      const li = document.createElement("li");
      //add class
      li.className = "list-group-item";
      // Add id
      li.id = `item-${item.id}`;
      // item.imgLink = "data:image/png;base64," + item.imgLink;
      // add html
      li.innerHTML = `<img
                      src="${item.imgLink}"
                      alt=""
                      srcset=""
                      style="width: 100px;height: 100px;padding-right: 10px; margin:10px"
                    />
                    <strong
                      id="item-list-name"
                      style="float: left;margin: 22px;"
                      >${item.name}</strong
                    >
                    <em id="desp" style="float: left;margin:22px">${item.desp}</em>
                    <span class="badge badge-success badge-pill">Rs.${item.price}</span>
                    <span class="badge badge-info badge-pill">Quantity:${item.quant}</span>
                    <span
                      class="badge badge-primary badge-pill"
                      style="float: right; margin: 8%;"
                    >
                      <i class="edit-item fa fa-pencil-square-o" aria-hidden="true" style="font-size=30px"></i
                    ></span>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    }
  };
})();

// app main

const app = (function(ItemCtrl, UICtrl, StorageCtrl) {
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // add item Submint
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // edit item
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Back Button
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    // UPDATE FUnction
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    //image item event
    document
      .querySelector(UISelectors.itemImg)
      .addEventListener("change", readURL);

    console.log("Loading Events...");
  };

  // Generates thebase64
  function readURL() {
    console.log("Reader");
    let input = document.querySelector("#product-image");
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          var src = reader.result;
          UICtrl.setImgaeBase64(src);
          // console.log(UICtrl.imageB64);
        },
        false
      );

      reader.readAsDataURL(input.files[0]);
    }
  }

  // ADD ITEM SUBMIT
  const itemAddSubmit = function(e) {
    const input = UICtrl.readProductDetails();
    // validate and add
    if (
      input.productname !== "" &&
      input.productDesp !== "" &&
      input.productprice !== "" &&
      input.productImg !== "" &&
      input.productQant !== ""
    ) {
      console.log("added Successfully...");
      const newItem = ItemCtrl.addItem(
        input.productname,
        input.productDesp,
        input.productprice,
        input.productImg,
        input.productQant
      );
      //ADD ITEM TO UI LIST
      console.log("DDDDD", newItem);
      UICtrl.addListItem(newItem);

      // Store in Local Storage
      StorageCtrl.storeItem(newItem);

      // clear input fields
      UICtrl.clearInput();
    } else {
      alert("Please enter Items Details");
    }

    e.preventDefault();
  };

  // update Item
  const itemUpdateSubmit = function(e) {
    console.log("Updated Successfully..");
    //  Get the input From Ui
    const input = UICtrl.readProductDetails();
    // Update the Item
    const updatedItem = ItemCtrl.updateItem(
      input.productname,
      input.productDesp,
      input.productprice,
      input.productImg,
      input.productQant
    );
    //Update UI
    UICtrl.updateListitem(updatedItem);
    // Update to Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    // UICtrl.clearInput();
    console.log("updated");
    e.preventDefault();
  };

  // Edit event
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      console.log("edit state....!");

      // get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break id into array
      const listIdArr = listId.split("-");

      // Get Actual Id for Edit Item
      const id = parseInt(listIdArr[1]);
      console.log(id);

      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Curent Edit Item in UI
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to Form
      UICtrl.addItemToForm();
    }
  };

  // Delete item MEthod
  const itemDeleteSubmit = function(e) {
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete From DataStructure
    ItemCtrl.deleteItem(currentItem.id);

    // DELETE FROM UI
    UICtrl.deleteListItem(currentItem.id);

    // Delete item From Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    console.log("Deleted...");
    e.preventDefault();
  };

  return {
    init: async function() {
      loadEventListeners();

      // hide edit state
      UICtrl.clearEditState();
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
})(ItemCtrl, UICtrl, StorageCtrl);

app.init();
