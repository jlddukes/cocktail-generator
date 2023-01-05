// [{===========================================================================================================================================================================================================================================================================================}]
// [{============== Important Note: The API that this project utilizes is limited to 10 API calls per hour with the free-version. When those calls have been used up, the page behaves unpredictably. In a real-life scenario this project would use a paid version of this API. ======================}]
// [{===========================================================================================================================================================================================================================================================================================}]

// {======= Variables and Functions Executed on Load =======}
let searchBtnEl = $("#searchBtn");
let infoBtnEl = $("#infoBtn");
let userInputTextEl = $("#userInputText");
let userSelectionEl = $("#listSelection");
let api_id = "05349be7";
let api_key = "302d463311eb7ca81f0fd2dcae2aa923";
let searchArray = []
buttonPrint()

// <------ Prints Buttons from Local Storage and Call Api Storing The Returned Data in Modal Element  ------>
function buttonPrint() {
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  // prints buttons
  for (let i = 0; i < savedRecipes.length; i++) {
    let uniqueId = savedRecipes[i].id;
    let name = savedRecipes[i].name;
    let recipeBoxEl =
      `
      <div id="${uniqueId}-box">
        <div class="panel-block is-flex is-justify-content-space-between is-align-content-center">
          <div class="js-modal-trigger is-clickable" data-target="recipe-modal">
            <p data-id="${uniqueId}" data-name="${name}">${name}</p>
          </div>
          <button class="button is-small" id="remove-saved-recipe">Remove</button>
        </div>
      </div>
      `
    // parameters for recipe box api call
    let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2/";
    let urlApi = `${urlApiEndpoint}${uniqueId}?type=public&app_id=${api_id}&app_key=${api_key}&field=ingredients&field=calories&field=label`

    // recipe box api call
    fetch(urlApi)
      .then((response) => { return response.json() })
      .then((data) => {
        let calories = Math.round(data.recipe.calories);
        let fullTitle = name;
        let ingredients = data.recipe.ingredients;
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
                  </div>
              </div>
            </div>
          </div>`;

        $('#recipe-box').append(recipeBoxEl);
        $('#recipe-box').append(modalContent);

        // for appending ingredients list items
        ingredients.forEach((el) => {
          let target = $(`#${uniqueId}-modal .ingredientSection`);
          let listItem = `<li>${el.text}</li>`;
          target.append(listItem);
        });

        // for opening modal
        $(`#${uniqueId}-box`).on("click", function (evt) {
          let userClick = evt.target.nodeName;
          if (userClick !== 'BUTTON') {
            evt.preventDefault();
            let target = $(this).next(".modal");
            target.addClass("is-active");
          }
        })

        // for closing modal
        $(`#${uniqueId}-modal`).on("click", ".is-danger", function (evt) {
          evt.preventDefault();

          let target = $(this).parents(".modal").first();
          target.removeClass("is-active");
        })

      }
      )
  }
}

// <-------- this function clears printed buttons from the recipe box ----------->
function clearRecipeBox() {
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  for (let i = 0; i < savedRecipes.length; i++) {
    $('DIV').remove()
  }
}

// <---------- this function is executed with the save button is clicked and saves items to local storage --------->
function saveRecipe(event) {
  clearRecipeBox()
  var savedRecipes = JSON.parse(localStorage.getItem("modalCard")) || []
  var recipeData = {
    name: event.target.dataset.name,
    id: event.target.dataset.id
  }
  savedRecipes.unshift(recipeData)
  localStorage.setItem("modalCard", JSON.stringify(savedRecipes))
  buttonPrint();
};

// <---------- this event listener removes the nearest ingredient card and removes the data from the ingredient card from the search-array using the replace and trim functions to trim the string and the indexOf and splice to remove the element from the array ------------->
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

// <------------- function that removes the clicked on recipe using the closest method ------------>
$('#recipe-box').on('click', function (event) {
  let userClick = event.target.nodeName;
  if (userClick === 'BUTTON') {
    let toBeRemoved = event.target.closest('DIV')
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
}
)

// <----------- function that adds ingredients to the panel ------------>
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

// <------ Get User Dropdown Selection ------>
function getUserSelection() {
  let keyword = userSelectionEl.val();
  // URL encoding normally replaces a space with a plus (+) sign or with %20
  let trimKeyword = keyword.split(" ").join("%20");

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

  // dsiable search button (prevent from double clicking & calling api multiple times)
  // will enable again at the end
  searchBtnEl.prop("disabled", true);

  fetch(urlApi)
    .then((response) => { return response.json() })
    .then((data) => {

      let top8Data = data.hits.slice(0, 8);

      top8Data.forEach(element => {
        let calories = Math.round(element.recipe.calories);
        let images = element.recipe.images.SMALL.url;
        let fullTitle = element.recipe.label;
        let trimTitle = (fullTitle.length >= 26) ? `${fullTitle.substring(0, 20)}...` : fullTitle;
        let uniqueId = element.recipe.uri.split("_")[1];
        let ingredients = element.recipe.ingredients;
        let thumbnail = element.recipe.images.THUMBNAIL.url;

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


        //To add new more information from saved recipes to lacal storage, add additional unique "data-.." code
        let modalContent =
          `
          <div class="modal" id="${uniqueId}-modal">
            <div class="modal-background"></div>
            <div class="modal-content">
              <div class="box">
                  <section class="box fullTitleSection" style="background-image:url(${thumbnail});background-repeat:no-repeat;background-position:right 10px top 0;">
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

        // for appending ingredients list items
        ingredients.forEach((el) => {
          let target = $(`#${uniqueId}-modal .ingredientSection`);
          let listItem = `<li>${el.text}</li>`;
          target.append(listItem);
        });

        // for opening modal
        $(`#${uniqueId}-card`).on("click", function (evt) {
          evt.preventDefault();
          let target = $(this).next(".modal");
          target.addClass("is-active");
        })

        // for closing modal
        $(`#${uniqueId}-modal`).on("click", ".is-danger", function (evt) {
          evt.preventDefault();

          let target = $(this).parents(".modal").first();
          target.removeClass("is-active");
        })

        // enable search button
        searchBtnEl.prop("disabled", false);
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

      // Some data cannot be found in TheCockTailDb Api, so the following is some code for error handling...
      let funFactTitle = (data.ingredients) ? data.ingredients[0].strIngredient : ("Canot found the ingredient.");
      if (data.ingredients) {
        var funFactDes = (data.ingredients[0].strDescription) ? data.ingredients[0].strDescription : ("No further info in TheCocktailDb Api");
      }

      let modalContent =
        `
      <div class="modal-background"></div>
      <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">${funFactTitle}</p>
              <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
              ${funFactDes}
          </section>
          <footer class="modal-card-foot">
              <a href="https://www.thecocktaildb.com/api.php" target="_blank">
              Fun Fact From TheCocktialDB
              </a> 
          </footer>
      </div>`;

      $("#funFactSection").append(modalContent);
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
