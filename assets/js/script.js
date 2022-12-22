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
function getIngredients(userInput) {
  let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2";
  let urlApi = `${urlApiEndpoint}?app_id=${api_id}&app_key=${api_key}&type=public&q=${userInput}`
  fetch(urlApi)
    .then((response) => { response.json(); })
    .then((data) => {
      console.log(data);
      // let ingredients = data.hits[0].recipe.label;
      // return ingredients;
    })
}
* /