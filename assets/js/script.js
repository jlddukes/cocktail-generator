// modal code
function modalCommand() {
  createModal()
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
                    <button class="button is-link">Save</button>
                </div>
            </div>
        </div>
    </div >`
  $('main').append(modalCard)
}


// stand-in button and eventlistener that creates a new 'saved recipe'
$('#create-box-recipe').on('click', function createBoxRecipe() {
  let recipeBoxEl =
    `
  <div id="saved-recipe-card" class="panel-block is-flex is-justify-content-space-between is-align-content-center">
    <div class="js-modal-trigger is-clickable" data-target="recipe-modal">
      <p>Recipe</p>
    </div>
    <button class="button is-small" id="remove-saved-recipe">Remove</button>
  </div>
  `
  $('#recipe-box').append(recipeBoxEl);

})

// function that removes the clicked on recipe using the closest method
$('#recipe-box').on('click', function (event) {
  let userClick = event.target.nodeName;
  if (userClick === 'BUTTON') {
    event.target.closest('#saved-recipe-card').remove()
  }
  modalCommand()
}
)

// The following is the temp code for api call 
let searchBtnEl = $("#searchBtn");
let userInputTextEl = $("#userInputText");
let userSelectionEl = $("#listSelection");
let api_id = "05349be7";
let api_key = "302d463311eb7ca81f0fd2dcae2aa923";

// <------ Get User Dropdown Selection ------>
function getUserSelection() {
  return userSelectionEl.val();
};

// <------ Get Checkbox For API Optional Params ------>
function getOptionalParams() {
  let optionalArray = [];
  let diaryFreeEl = ($("#dairy-free").prop("checked") === true) ? "dairy-free" : "";
  let eggFreeEl = ($("#egg-free").prop("checked") === true) ? "egg-free" : "";
  let veganEl = ($("#vegan").prop("checked") === true) ? "vegan" : "";
  let lowCalorieEl = ($("#low-calorie").prop("checked") === true) ? "low-sugar" : "";

  optionalArray.push(diaryFreeEl);
  optionalArray.push(eggFreeEl);
  optionalArray.push(veganEl);
  optionalArray.push(lowCalorieEl);

  return optionalArray;
}

// <------ Fetch API & Create Card & Create Modal ------>
function getRecipeData(userInput, anArrayFromOptionalParams) {
  let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2";
  let urlApi = `${urlApiEndpoint}?app_id=${api_id}&app_key=${api_key}&type=public&q=${userInput}`

  anArrayFromOptionalParams.forEach(element => {
    if (element) {
      let optionalParams = `&health=${element}`
      urlApi += optionalParams;
    }
  });

  fetch(urlApi)
    .then((response) => { return response.json() })
    .then((data) => {
      console.log(data);

      let top8Data = data.hits.slice(0, 8);

      top8Data.forEach(element => {
        let calories = element.recipe.calories;
        let images = element.recipe.images.SMALL.url;
        let fullTitle = element.recipe.label;
        // let trimTitle = fullTitle.split(" ").join("");
        let uniqueId = element.recipe.uri.split("_")[1];
        let ingredients = element.recipe.ingredients;

        let appendedCard =
          `
          <div class="column is-3" id="${uniqueId}-card">
            <div class="card js-modal-trigger is-clickable" data-target="recipe-modal">
              <div class="card-image">
                <figure class="image">
                  <img src="${images}" alt="Placeholder image">
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                      <p class="title is-4">${fullTitle}</p>
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
                  <section class="box ingredientSection">
                      <p class="is-size-4 has-text-weight-medium">Ingredients</p>
                  </section>
                  <section class="box recipeSection">
                      <p class="is-size-4 has-text-weight-medium">Recipe</p>
                      <p>abcedfghijklmnop...</p>
                  </section>
                  <div class="is-flex is-justify-content-space-between">
                      <button class="button is-danger">Back</button>
                      <button class="button is-link">Save</button>
                  </div>
              </div>
            </div>
          </div>`;

        $("#cardsSection").append(appendedCard);
        $("#cardsSection").append(modalContent);

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
}

// <------ Event Listener For Search Btn ------>
searchBtnEl.on("click", function (evt) {
  evt.preventDefault();

  $("#cardsSection").text("");

  let userinput = getUserSelection();
  let anArray = getOptionalParams();
  getRecipeData(userinput, anArray);
})
