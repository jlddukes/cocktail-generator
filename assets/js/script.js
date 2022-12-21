// // modal function
// document.addEventListener('DOMContentLoaded', () => {
//   // Functions to open and close a modal
//   function openModal($el) {
//     $el.classList.add('is-active');
//   }

//   function closeModal($el) {
//     $el.classList.remove('is-active');
//   }

//   function closeAllModals() {
//     (document.querySelectorAll('.modal') || []).forEach(($modal) => {
//       closeModal($modal);
//     });
//   }

//   // Add a click event on buttons to open a specific modal
//   (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
//     const modal = $trigger.dataset.target;
//     const $target = document.getElementById(modal);

//     $trigger.addEventListener('click', () => {
//       openModal($target);
//     });
//   });

//   // Add a click event on various child elements to close the parent modal
//   (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
//     const $target = $close.closest('.modal');

//     $close.addEventListener('click', () => {
//       closeModal($target);
//     });
//   });

//   // Add a keyboard event to close all modals
//   document.addEventListener('keydown', (event) => {
//     const e = event || window.event;

//     if (e.key === 27) { // Escape key
//       closeAllModals();
//     }
//   });
// });


// The following is the temp code for api call 

let searchBtnEl = $("#searchBtn");
let userInputTextEl = $("#userInputText");
let userSelectionEl = $("#listSelection");
let api_id = "05349be7";
let api_key = "302d463311eb7ca81f0fd2dcae2aa923";

function getUserSelection() {
  return userSelectionEl.val();
};

// function getIngredients(userInput) {
//   let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2";
//   let urlApi = `${urlApiEndpoint}?app_id=${api_id}&app_key=${api_key}&type=public&q=${userInput}`
//   fetch(urlApi)
//     .then((response) => {response.json();})
//     .then((data) => {
//       console.log(data);
//       // let ingredients = data.hits[0].recipe.label;
//       // return ingredients;
//     })
// }

function getData(userInput) {
  let urlApiEndpoint = "https://api.edamam.com/api/recipes/v2";
  let urlApi = `${urlApiEndpoint}?app_id=${api_id}&app_key=${api_key}&type=public&q=${userInput}`
  fetch(urlApi)
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);

      let firstData = data.hits[0];
      let tempData = firstData.recipe.calories;
      // LARGE, REGULAR, SMALL, THUMBNAIL
      let tempImage = firstData.recipe.images.SMALL.url;
      let tempTitle = firstData.recipe.label;
      let newTitle = tempTitle.slice(0, -6).trim();
      let ingredients = firstData.recipe.ingredients;


      // let appendCard =
      //   `
      //   <div class="card-image">
      //     <figure class="image">
      //       <img src="${tempImage}" alt="Placeholder image">
      //       <p class="title is-4">${tempTitle}</p>
      //     </figure>
      //   </div>
      //   `;


      let tempCard =
        `
        <div class="column is-3" data-id="${tempTitle}">
          <div class="card js-modal-trigger is-clickable" data-target="recipe-modal">
            <div class="card-image">
              <figure class="image">
                  <img src="${tempImage}" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                  <div class="media-content">
                      <p class="title is-4">${newTitle}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      `;

      $("#cardStorage").append(tempCard);


      let tempModal =
        `
      <div id="recipe-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
              <section class="box" id="ingredientSection">
                  <p class="is-size-4 has-text-weight-medium">Ingredients</p>
              </section>
              <section class="box" id="recipeSection">
                  <p class="is-size-4 has-text-weight-medium">Recipe</p>
                  <p>Pour all ingredients into a glass and stir.</p>
              </section>
              <div class="is-flex is-justify-content-space-between">
                  <button class="button is-danger">Back</button>
                  <button class="button is-link">Save</button>
              </div>
          </div>
        </div>
      </div>
      `;

      $("aside").append(tempModal);

      ingredients.forEach(element => {
        let listItem = `<li>${element.text}</li>`;
        console.log(listItem);
        $("#ingredientSection").append(listItem);
      });

      console.log("<=====start get data=====>");
      console.log(userInput);
      console.log(firstData);
      console.log(tempData);
      console.log(tempTitle);
      console.log(tempTitle.length - 8);
      console.log(newTitle);
      console.log(ingredients);
      console.log("<=====end get data=====>");
    })
}

searchBtnEl.on("click", function (evt) {
  evt.preventDefault();

  // let userinput = "Bourbon";
  let userinput = getUserSelection();
  getData(userinput);
  // getDataFromCocktailDb(userinput);

  console.log("<=====start search btn=====>");
  console.log(userinput);
  console.log("<=====end search btn=====>");
})

$("#cardStorage").on("click", ".is-3", function (evt) {
  evt.preventDefault();

  // let userinput = getUserSelection();
  // let res = getIngredients(userinput);

  $("#recipe-modal").addClass("is-active");

  console.log("<=====start click card=====>");
  // alert("You click");
  // console.log(res);
  // console.log($(this));
  // console.log($("#recipe-modal"));
  console.log("<=====end click card=====>");
})

$("aside").on("click", ".is-danger", function (evt) {
  evt.preventDefault();

  // $("#recipe-modal").removeClass("is-active");

  console.log("<=====start click card=====>");
  alert("click!!!!");
  console.log("<=====end click card=====>");
})

// function getDataFromCocktailDb(userInput) {
//   let urlApiEndpoint = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
//   let urlApi = `${urlApiEndpoint}?i=${userInput}`
//   fetch(urlApi)
//     .then((response) => {
//       console.log(response);
//       return response.json();
//     })
//     .then((data) => {

//       console.log("<=====start get CocktailDb=====>");
//       console.log(data);
//       console.log("<=====end get CocktailDb=====>");
//     })
// }
