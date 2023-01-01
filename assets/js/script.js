let searchArray = []
buttonPrint()

// modal code
function modalCommand() {
  // createModal()
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });

  // back button closes modal
  $('#back-button').on('click', (event) => {
    closeAllModals();
  });
}
modalCommand()

// creates modal dom
function createModal() {
  let modalCard = `
    <div id = "recipe-modal" class= "modal">
      <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div class="box">
                    <p class="is-size-4 has-text-weight-medium">Ingredients</p>
                    <li>1.5 oz Bourbon</li>
                    <li>.5 oz Bourbon</li>
                    <li>5 Dashes Bitters</li>
                </div>
                <div class="box">
                    <p class="is-size-4 has-text-weight-medium">Recipe</p>
                    <p>Pour all ingredients into a glass and stir.</p>
                </div>
                <div class="is-flex is-justify-content-space-between">
                    <button class="button is-danger" id="back-button">Back</button>
                    <button class="button is-link" id="save-button">Save</button>
                </div>
            </div>
        </div>
    </div >`
  $('main').append(modalCard)
}

// this function prints the items from local storage as clickable buttons
function buttonPrint() {
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  for (let i = 0; i < savedRecipes.length; i++) {
    let recipeBoxEl =
      `
  <div id="saved-recipe-card" class="panel-block is-flex is-justify-content-space-between is-align-content-center">
    <div class="js-modal-trigger is-clickable" data-target="recipe-modal">
      <p>` + savedRecipes[i].name + `</p>
    </div>
    <button class="button is-small" id="remove-saved-recipe">Remove</button>
  </div>
  `
    $('#recipe-box').append(recipeBoxEl);
  }
}

// this function clears printed buttons from the recipe box
function clearRecipeBox() {
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  for (let i = 0; i < savedRecipes.length; i++) {
    $('#saved-recipe-card').remove()
  }
}

// this function is executed with the saveme button is clicked and saves items to local storage
function saveRecipe(event) {
  clearRecipeBox()
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  console.log(event.target.dataset.ingredients)
  var recipeData = {
    name: event.target.dataset.name,
    id: event.target.dataset.id
  }
  savedRecipes.unshift(recipeData)

  //This line of code adds selected recipe information to local storage
  localStorage.setItem("modalCard", JSON.stringify(savedRecipes))
  buttonPrint();
};

// this event listener removes the nearest ingredient card and removes the data from the ingredient card from the search-array using the replace and trim functions to trim the string and the indexOf and splice to remove the element from the array
$('#appear').on('click', function (event) {
  let userClick = event.target.nodeName;
  if (userClick === 'BUTTON') {
    let toBeRemoved = event.target.closest('#ingredient-card');
    let text = toBeRemoved.textContent.trim().replace('Remove', '').trim()
    toBeRemoved.remove();
    if (searchArray.includes(text)) {
      let indexNumber = searchArray.indexOf(text);
      searchArray.splice(indexNumber, 1);
    } else {
      return
    }
  }
}
)

// function that removes the clicked on recipe using the closest method
$('#recipe-box').on('click', function (event) {
  let userClick = event.target.nodeName;
  if (userClick === 'BUTTON') {
    let toBeRemoved = event.target.closest('#saved-recipe-card')
    let text = toBeRemoved.textContent.trim().replace('Remove', '').trim()
    toBeRemoved.remove();
    var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
    for (let i = 0; i < savedRecipes.length; i++) {
      if (savedRecipes[i].name == text) {
        savedRecipes.splice(i, 1)
      }
    }
    localStorage.setItem("modalCard", JSON.stringify(savedRecipes))
  }
  modalCommand()
}
)

// function that adds ingredients to the panel
$('#listSelection').on('change', function (event) {
  event.preventDefault();
  let singleSelection = $('#listSelection').val();
  let ingredientEl =
    `
<div id="ingredient-card" class="panel-block is-flex is-justify-content-space-between is-align-content-center">
  <div class="js-modal-trigger is-clickable" data-target="recipe-modal">
    <p id="ingredient-value">` + singleSelection + `</p>
  </div>
  <button class="button is-small" id="remove-ingredient-item">Remove</button>
</div>
`
  if (singleSelection !== '' && singleSelection !== 'Select Ingredient') {

    if (searchArray.includes(singleSelection)) {
      return
    } else {
      $('#appear').append(ingredientEl);
      searchArray.push(singleSelection);
    }
  }
}
)

// {======= Modal / Card / Fun Fact =======}
let searchBtnEl = $("#searchBtn");
let infoBtnEl = $("#infoBtn");
let userInputTextEl = $("#userInputText");
let userSelectionEl = $("#listSelection");
let api_id = "05349be7";
let api_key = "302d463311eb7ca81f0fd2dcae2aa923";

// <------ Get User Dropdown Selection ------>
function getUserSelection() {
  let keyword = userSelectionEl.val();
  let trimKeyword = keyword.split(" ").join("");

  return trimKeyword;
};

// <------ Get Checkbox For API Optional Params ------>
function getOptionalParams() {
  let optionalArray = [];
  let diaryFreeEl = ($("#dairy-free").prop("checked") === true) ? "dairy-free" : "";
  let eggFreeEl = ($("#egg-free").prop("checked") === true) ? "egg-free" : "";
  let veganEl = ($("#vegan").prop("checked") === true) ? "vegan" : "";
  let lowCalorieEl = ($("#low-calorie").prop("checked") === true) ? "&calories=100-200" : "";

  optionalArray.push(diaryFreeEl);
  optionalArray.push(eggFreeEl);
  optionalArray.push(veganEl);
  optionalArray.push(lowCalorieEl);

  return optionalArray;
};

// <------ Fetch API & Create Card & Create Modal ------>
function getRecipeData(userInput, anArrayFromOptionalParams) {
  let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2";
  let urlApi = `${urlApiEndpoint}?app_id=${api_id}&app_key=${api_key}&type=public&q=${userInput}%cocktail`

  let slicedArrayEl = anArrayFromOptionalParams.slice(0, 3);
  let lastArrayEl = anArrayFromOptionalParams[3];
  slicedArrayEl.forEach(element => {
    if (element) {
      let optionalParams = `&health=${element}`
      urlApi += optionalParams;
    }
  });
  if (lastArrayEl) {
    urlApi += lastArrayEl;
  };

  fetch(urlApi)
    .then((response) => { return response.json() })
    .then((data) => {
      // console.log(data);
      // console.log(urlApi);

      let top8Data = data.hits.slice(0, 8);

      top8Data.forEach(element => {
        let calories = element.recipe.calories;
        let images = element.recipe.images.SMALL.url;
        let fullTitle = element.recipe.label;
        let trimTitle = (fullTitle.length >= 26) ? `${fullTitle.substring(0, 20)}...` : fullTitle;
        let uniqueId = element.recipe.uri.split("_")[1];
        let ingredients = element.recipe.ingredients;
        console.log(ingredients)

        let appendedCard =
          `
          <div class="column is-3" id="${uniqueId}-card">
            <div class="card js-modal-trigger is-clickable" data-target="recipe-modal">
              <div class="card-image">
                <figure class="image">
                  <img src="${images}" alt="Placeholder image">
                </figure>
              </div>
              <div class="card-content has-background-info-light">
                <div class="media">
                  <div class="media-content">
                      <p class="title is-4">${trimTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

        let modalContent =
          `
          <div class="modal" id="${uniqueId}-modal">
            <div class="modal-background"></div>
            <div class="modal-content">
              <div class="box">
                  <section class="box fullTitleSection">
                  <p class="is-size-4 has-text-weight-medium">Title</p>
                  <p>${fullTitle}</p>
                  </section>
                  <section class="box ingredientSection">
                      <p class="is-size-4 has-text-weight-medium">Ingredients</p>
                  </section>
                  <section class="box recipeSection">
                      <p class="is-size-4 has-text-weight-medium">Calories</p>
                      <p>${calories}</p>
                  </section>
                  <div class="is-flex is-justify-content-space-between">
                      <button class="button is-danger">Back</button>
                      <button onclick="saveRecipe(event)" data-id= "${uniqueId}" data-name="${fullTitle}" class="button is-link">Save</button>
                  </div>
              </div>
            </div>
          </div>`;

        $("#cardsSection").append(appendedCard);
        $("#cardsSection").append(modalContent);


        //To add new more information from saved recipes to lacal storage, add additional unique "data-.." code


        // for appending ingredients list items
        ingredients.forEach((el) => {
          let target = $(`#${uniqueId}-modal .ingredientSection`);
          let listItem = `<li>${el.text}</li>`;
          target.append(listItem);
        });


        // for opening modal
        $(`#${uniqueId}-card`).on("click", function (evt) {
          evt.preventDefault();

          let target = $(this).next(".modal")
          target.addClass("is-active");
        })

        // for closing modal
        $(`#${uniqueId}-modal`).on("click", ".is-danger", function (evt) {
          evt.preventDefault();

          let target = $(this).parents(".modal").first();
          target.removeClass("is-active");
        })

      });
    })
};

// <------ Fetch API & Create Fun Facts By Ingredients Name ------>
function getCocktialDbData(userInput) {
  let urlApiEndpoint = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
  let urlApi = `${urlApiEndpoint}${userInput}`;

  fetch(urlApi)
    .then(res => { return res.json() })
    .then(data => {
      console.log(data);

      let funFact = data.ingredients[0].strDescription;
      let modalContent =
        `
      <div class="modal-background"></div>
      <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">${userInput}</p>
              <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
              ${funFact}
          </section>
          <footer class="modal-card-foot">
              Fun Fact From CocktialDB
          </footer>
      </div>`;

      $("#funFactSection").append(modalContent);

      // console.log(funFact);
    }
    )
}

// <------ Event Listener For Search Btn ------>
searchBtnEl.on("click", function (evt) {
  evt.preventDefault();

  $("#cardsSection").text("");

  let userinput = getUserSelection();
  let anArray = getOptionalParams();
  getRecipeData(userinput, anArray);
});

// <------ Event Listener For Fun Fact Btn ------>
infoBtnEl.on("click", function (evt) {
  evt.preventDefault();

  let userinput = getUserSelection();
  getCocktialDbData(userinput);
  $("#funFactSection").addClass("is-active");
})

// <------ Event Listener For Closing Fun Fact ------>
$("#funFactSection").on("click", "button", function (evt) {
  evt.preventDefault();

  $("#funFactSection").removeClass("is-active");
  $("#funFactSection").text("");
})
