// select elements in DOM
const form = document.querySelector('#itemForm');
const inputItem = document.querySelector('#itemInput');
const itemsList = document.querySelector('#itemsList');
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelectorAll("#message");

// create an empty items lists
let todoItems = [];

const alertMessage = function(message, className){
    alertDiv.innerHTML = message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove(className, "hide");
    setTimeout(()=>{
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    }, 2000);
    return;
}

// filter items
const getItemsFilter = function(type) {
    let filterItems = [];
    
    switch(type) {
        case "dropdown": 
            filterItems = todoItems.filter((items)=>!items.isDone);
            break;
        case "done":
            filterItems = todoItems.filter((items)=>items.isDone);
            break;
        default:
            filterItems = todoItems;
            break;
    }
    getList(filterItems);
};

// delete item
const removeItem = function(item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
};

// update items
const updateItem = function(currentItemIndex, value) {
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex, 1, newItem);
    setLocalStorage(todoItems);
};

// handle events or action buttons

const handleItem = function(itemData){
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if(item.querySelector('.title').getAttribute("data-time")==itemData.addedAt){
            // done
            item.querySelector('[data-done]').addEventListener('click', function(e){
                e.preventDefault();
                // alert("hi");
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];

                const currentClass = currentItem.isDone 
                ? "fa-check-circle-fill"
                : "fa-check-circle";
                // alert(currentItem.isDone);

                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem);
                setLocalStorage(todoItems);
                const iconClass = currentItem.isDone 
                ? "fa-check-circle-fill"
                : "fa-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterType = document.querySelector("#tabValue").value;
                getItemsFilter(filterType);
            });

            // edit
            item.querySelector("[data-edit]").addEventListener("click", function(e){
                e.preventDefault();
                // alert("hi");
                inputItem.value = itemData.name;
                document.querySelector("#objIndex").value = todoItems.indexOf(itemData);

            });

            // delete
            item.querySelector("[data-delete]").addEventListener("click", function(e){
                e.preventDefault();
                // alert("hi");
                if(confirm("Are you sure want to remove this item")) {
                    itemsList.removeChild(item);
                    removeItem(item);
                    setLocalStorage(todoItems);
                    alertMessage("Item has been deleted", "alert-success");
                    return todoItems.filter((item)=>item != itemData);
                }
            });
        }
    });
};

//get list of items

const getList = function(todoItems) {
    itemsList.innerHTML = "";
    if(todoItems.length > 0) {
        todoItems.forEach((item) => {
        const iconClass=item.isDone 
              ? "fa-check-circle-fill"
              : "fa-check-circle";
            itemsList.insertAdjacentHTML(
                "beforeend",
                `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="title" data-time="${item.addedAt}">${item.name}</span>
                <span>
                  <a href="#" data-done class="btn btn-sm btn-outline-success"><i class="fas ${iconClass}"> Done</i></a>
                  <a href="#" data-edit class="btn btn-sm btn-outline-warning"><i class="fas fa-edit"></i> Edit</a>
                  <a href="#" data-delete class="btn btn-sm btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete</a>
                </span>
            </li>`
        );
        handleItem(item)
        });
    }
    else {
        itemsList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span>No record found.</span>
           
        </li>`
    );
    }
};

// get localstorage from the page
const getLocalStorage = function() {
    const todoStorage = localStorage.getItem("todoItems");
    if(todoStorage === "undefined" || todoStorage === null){
        todoItems = [];
    }
    else {
        todoItems = JSON.parse(todoStorage);
    }
    console.log("items", todoItems);
    getList(todoItems);
};

//set in local storage
const setLocalStorage = function(todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
};



document.addEventListener('DOMContentLoaded', () =>{
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if(itemName.length === 0){
            alertMessage("Please Enter Name.", "alert-danger");
        }
        else {

            const currentItemIndex = document.querySelector("#objIndex").value;
            if(currentItemIndex) {
                //update
                updateItem(currentItemIndex,itemName);
                document.querySelector("#objIndex").value = "";
                alertMessage("Item has been updated.", "alert-success");
            }

            else{
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt:new Date().getTime(),
                };
                todoItems.push(itemObj);
                setLocalStorage(todoItems);
                alertMessage("New item has been added.", "alert-success");
            }  
            getList(todoItems);  
        } 
        inputItem.value = "";
    });

    //filter tabs
    filters.forEach((tab)=>{
        tab.addEventListener("click", function(e) {
          e.preventDefault();
          const tabType = this.getAttribute("data-type");
        //   alert(tabType);  
          document.querySelectorAll('.nav-link').forEach((nav) => {
            nav.classList.remove("active");
          });
          this.firstElementChild.classList.add("active");
          getItemsFilter(tabType);
          document.querySelector('#tabValue').value = tabType;
        });
    });

    // Load items
    getLocalStorage();
});