/* Default statement to hide the form when HTML fully loads */
let addToy = false;

/* Jessie image url to let user practice creating a new toy */
/* https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist */

/* When the HTML fully loads, run the following functionality */
document.addEventListener("DOMContentLoaded", () => {
  /* Global variables */
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector("form.add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");
  const toysUrl = "http://localhost:3000/toys";

  /* Function that takes the event that called it as an argument */
  const addLikesToToys = (e) => {
    /* Assign the id of the event's target to a variable */
    const toyId = e.target.id
    /* Grab the textContent of the event's target's previous sibling, split the text into an array, grab the first index of the array, add 1 to it, assign the new amount of likes to a variable */
    const newNumberOfLikes = Number(e.target.previousSibling.textContent.split(" ")[0]) + 1;
    /* Call 'updateLikes' and pass a few arguments */
    updateLikes(toyId, newNumberOfLikes, e.target);
  }

  /* Function that takes an obj as an argument */
  const displayToy = (toyObj) => {
    /* Creates a 'card' for a toy to be displayed and populates all of the elements necessary to complete the card with info from the object */
    const div = document.createElement("div");
    div.classList.add("card");
    const h2 = document.createElement("h2");
    h2.textContent = toyObj.name
    const img = document.createElement("img");
    img.classList.add("toy-avatar");
    img.src = toyObj.image
    img.alt = `${toyObj.name} image`;
    const p = document.createElement("p");
    p.textContent = `${toyObj.likes} Likes`;
    const button = document.createElement("button");
    button.addEventListener("click", addLikesToToys);
    button.textContent = `Like ❤️`;
    button.id = toyObj.id;
    button.classList.add("like-btn");
    /* Appends all the info elements to the 'card' */
    div.append(h2, img, p, button);
    /* Appends the 'card' to the page */
    toyCollection.append(div);
  }

  /* Function that takes the event that called it as an argument */
  const createNewToy = (e) => {
    /* Prevents default behavior of a submit event */
    e.preventDefault();
    /* If both fields of the form have some text in them */
    if (toyForm.name.value.trim() !== "" && toyForm.image.value.trim() !== "") {
      const newToyObj =  {
        name: toyForm.name.value,
        image: toyForm.image.value,
        likes: 0
      }
      postNewToy(newToyObj);
    /* Else at least one of the fields is empty, so send user an alert */
    } else {
      alert("Please fill out the form completely")
    }
  }

  /* Function that will call a GET request to gather all toys in database */
  const getToys = () => {
    fetch(toysUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw (response.statusText);
      }
    })
    .then(data => {
      /* Iterate through 'data' and call 'displayToy' on each 'item' */
      data.forEach(item => {
        displayToy(item);
      });
    })
    /* Catch for all error no previously caught by previous 'response.ok' conditional */
    .catch(err => alert(err))
  }

  /* Function that will call a POST request to create a new toy in database */
  const postNewToy = (newToyObj) => {
    fetch(toysUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToyObj)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw (response.statusText);
      }
    })
    .then(data => {
      /* Call 'displayToy' on 'data' */
      displayToy(data);
      /* Reset the form */
      toyForm.reset();
      /* Alert to let user know the toy was added successfully */
      alert("New toy successfully added!")
    })
    /* Catch for all error no previously caught by previous 'response.ok' conditional */
    .catch(err => alert(err))
  }

  /* Function that takes a few arguments that will call a PATCH request to update the likes for a toy in the database */
  const updateLikes = (toyId, newNumberOfLikes, btn) => {
    fetch(`${toysUrl}/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, body: JSON.stringify({
        "likes": newNumberOfLikes
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw (response.statusText);
      }
    })
    .then(data => {
      /* Update the number of likes for the toy on the page */
      btn.previousSibling.textContent = `${data.likes} Likes`;
    })
    /* Catch for all error no previously caught by previous 'response.ok' conditional */
    .catch(err => alert(err))
  }

  /* Calls 'getToys' */
  getToys();


  /* Add event listeners */
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener("submit", createNewToy);

});
