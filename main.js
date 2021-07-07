// select elements in DOM
const form = document.querySelector('#itemForm');
const inputItem = document.querySelector('#itemInput');
const itemsList = document.querySelector('#itemList');
const filters = document.querySelectorAll(".nav-item");

// create an empty items lists
let todoItems = [];

//set in local storage
const setLocalStorage = function(todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener('DOMContentLoaded', () =>{
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if(itemName.length === 0){
            alert("Please enter task.");
        }
        else {
            const itemObj = {
                name: itemName,
                isDone: false,
                addedAt:new Date().getTime(),
            };
            todoItems.push(itemObj);
            setLocalStorage(todoItems);
        } 
    })
})