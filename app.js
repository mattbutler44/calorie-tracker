// Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return{
    storeItem: function(item){
      let items;
      
      // check if local storage is empty, if it is just add the item to it
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);

        // Save to local storage
        localStorage.setItem('items', JSON.stringify(items));
      // else (if local storage has something in it)
      } else { 
        // get what is already in local storage
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);

        // save to local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = this.getItemsFromStorage();

      // search array from local storage for the udpated item
      items.forEach(function(currItem, index){
        // if the id of the current item matches the updated item's id
        if(currItem.id === updatedItem.id){
          // from items array, splice out starting at the index 1 item and replace it with udpatedItem
          items.splice(index, 1, updatedItem);
        }
      });

      // save local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = this.getItemsFromStorage();

      items.forEach(function(currItem, index){
        if(id === currItem.id){
          // from items array, splice out starting at the index 1 item
          items.splice(index, 1);
        }
      });
      // save local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllFromLocalStorage: function(){
      localStorage.removeItem('items');
    },
  };
})();

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null, // The item to edit
    totalCalories: 0,
  };

  // Public methods
  return{
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let id;
      // Create ID
      if(data.items.length > 0){
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Parse calories as a number
      calories = parseInt(calories);

      // Create a new item with the above info
      const newItem = new Item(id, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      // Loop through the items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item from array
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });
      // Set the total calories to the data structure
      data.totalCalories = total;
      // Return total
      return data.totalCalories;
    },
    logData: function(){
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function(){
  // in case the ID of the item list we want to use changes,
  // make a variable here that can be referenced throughout to avoid searching all around
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCaloriesDisplay: '.total-calories',
  };

  // Public methods
  return{
    populateItemList: function(items){
      let html = '';

      // Get the items and set their HTML
      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`;
      });

      // Insert List items to the list
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // Create <li> element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;

      // Insert item to UI
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // convert the node list obtained above to an array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = 
            `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function(id){
      // convert the id passed in to the html form of the item id
      const itemID = `#item-${id}`;
      // use the converted itemID to select it from the DOM
      const item = document.querySelector(itemID);
      // remove selected item from the DOM
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '',
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCal){
      document.querySelector(UISelectors.totalCaloriesDisplay).textContent = totalCal;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function(ItemCtrl, StoreageCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(event){
      if(event.key === 13 || event.keyCode === 13){
        event.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', function(event){
      UICtrl.clearEditState();
      event.preventDefault();
    });

    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', function(event){
      clearAllItemsClick();
      event.preventDefault();
    });
  };

  // Update calories
  const updateCalories = function(){
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);
  };

  // Add item submit
  const itemAddSubmit = function(event){
    // get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Ensure input is not blank
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      updateCalories();

      // Clear fields
      UICtrl.clearInput();
    }

    event.preventDefault();
  };

  // Click edit item
  const itemEditClick = function(event){
    // Event delegation - this isn't there when DOM/page loads, so we put the event listener
    // on the ul that did exist, and then here we check if the click was on something that contains
    // a class name of edit-item, which is the pencil icon
    if(event.target.classList.contains('edit-item')){
      // get list item ID
      const listId = event.target.parentNode.parentNode.id;
      
      // Break into an array
      const listIdArr = listId.split('-');
      // get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item from the id parsed out above
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    event.preventDefault();
  };

  // Update item submit event
  const itemUpdateSubmit = function(event){
    // get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    updateCalories();

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
    event.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function(event){
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    updateCalories();

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    event.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function(){
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    updateCalories();            
    UICtrl.clearEditState();

    // Delete all items from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearAllFromLocalStorage();

    // Hide ul
    UICtrl.hideList();
  };

  // Public methods
  return{
    init: function(){
      // Set initial state / Clear edit state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items exist
      if(items.length === 0){
        UICtrl.hideList();
      } else {
      // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();