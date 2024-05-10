//All these are for firebase datbase connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"Add your firebase URL(Realtime database)"
}

const app = initializeApp(appSettings)
const dataBase = getDatabase(app)
const inputDataInDB = ref(dataBase, "targetItems") //Creating a reference called targetItems in which the values rae to be stored

//To retrieve data from firebase database(Fetch data from firbase database)
//Snapshot are data updation that are sen to each user in the database
onValue(inputDataInDB, function(snapshot){
    //Use Object.values() to convert snapshot.val() from an Object to an Array

    //snapshot.exist is used to check whether data are present in the database or not.
    if(snapshot.exists()){
        let shoppingListArray = Object.entries(snapshot.val()) //To get the snapshot entries as a whole
        makeunorderedListEmpty()
        for(let count = 0; count < shoppingListArray.length;count++){
            let currentShoppingItem = shoppingListArray[count]  //This stores the entries ["key", "value"] pair
            addShoppingItems(currentShoppingItem)
        }
    } else{
        shoppingList.innerHTML = `Still no items entered...Try to enter things right now !!`
    }
})

//To receive the action from these specific id
const cartButton = document.getElementById("cart-button")
const inputText = document.getElementById("input-text")
const shoppingList = document.getElementById("shopping-list")

cartButton.addEventListener("click", function(){
    
    let inputData = inputText.value
    push(inputDataInDB, inputData)
    //console.log(inputData)
    makeInputFieldEmpty()
    //addShoppingItems(inputData)
})
function makeunorderedListEmpty(){
    //each time we make modification in our database, it appends the data from first
    //so we are using this function to erase the <ul> tag contents. 
    shoppingList.innerHTML = ""
}
function makeInputFieldEmpty(){
    inputText.value = " "
}

function addShoppingItems(ShoppingItem){
    //shoppingList.innerHTML += `<li id = "each-item">${inputData}</li>`
    //We need to create eventListener for deletion purpose which can't be achieved using innerHTML
    //Thus we are creating an Element
    let ShoppingItemID = ShoppingItem[0]  //0th index points to key(ID)
    let ShoppingItemvalue = ShoppingItem[1] //1st index points to value
    let shoppingListElement = document.createElement("li")  //We need to create a li tag
    shoppingListElement.textContent = ShoppingItemvalue //In which we need to add the text content
    shoppingList.append(shoppingListElement) //Finally we append it within the ul tag. 
    
    //We are adding eventListener with double click so that when it is double clicked it will be deleted
    shoppingListElement.addEventListener("dblclick" ,function(){
        //console.log(currentShoppingItemID)
        let shoppingListElementLocation = ref(dataBase, `targetItems/${ShoppingItemID}`)  
        //ref is used to refer to the expected location targetitems is the reference followed by /the required ID that needs to be deleted
        remove(shoppingListElementLocation)
    })
}
