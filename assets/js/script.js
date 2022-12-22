
var panelBlock1El = document.querySelector(".panel-block1");

console.log(panelBlock1El)




// modal function
document.addEventListener('DOMContentLoaded', () => {
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
});


// The following is the temp code for api call 

let searchBtnEl = $("#searchBtn");
let userInputTextEl = $("#userInputText");
let api_id = "05349be7";
let api_key = "302d463311eb7ca81f0fd2dcae2aa923";

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
      // LARGE, REGULAR, SMALL, THUBNAIL
      let tempImage = firstData.recipe.images.LARGE.url;

      let appendCard =
        `
        <div class="card-image">
          <figure class="image">
            <img src="${tempImage}"
                alt="Placeholder image">
          </figure>
        </div>
        `;

    
      let tempCard = 
      `
      <div class="column is-3">
        <div class="card js-modal-trigger is-clickable" data-target="recipe-modal">
          <div class="card-image">
              <figure class="image">
                  <img src="${tempImage}
                      alt="Placeholder image">
              </figure>
          </div>
          <div class="card-content">
              <div class="media">
                  <div class="media-content">
                      <p class="title is-4">Old Fashioned</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
      `

      $("#cardStorage").append(tempCard);

      console.log("<=====start get data=====>");
      console.log(firstData);
      console.log(tempData);
      console.log("<=====end get data=====>");
    })
}

function getDataFromCocktailDb(userInput) {
  let urlApiEndpoint = "www.thecocktaildb.com/api/json/v1/1/search.php?";
  let urlApi = `${urlApiEndpoint}?i=${userInput}`
  fetch(urlApi)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);

      console.log("<=====start get CocktailDb=====>");
      console.log("<=====end get CocktailDb=====>");
    })
}

function getUserInput() {
  return userInputTextEl.val();
};

searchBtnEl.on("click", function (evt) {
  // let userinput = getUserInput();
  let userinput = "Lemon";
  getData(userinput);
  // getDataFromCocktailDb(userinput);
})






var myButton = document.querySelector('#select')
var dropDown = document.querySelector('.dropdown')
var menue = document.querySelector('.appear')
myButton.addEventListener('click', (e)=>{
    if(dropDown.value != ""){
        e.preventDefault();
        //create li
        var anchorEl = document.createElement('li')
        anchorEl.textContent = dropDown.value
        menue.appendChild(anchorEl);
        //create span
        var mySpan2 = document.createElement('span');
        mySpan2.innerHTML = 'x'
        mySpan2.classList.add (".disappear")
        anchorEl.appendChild(mySpan2);

    }
    var close = document.querySelectorAll('span')
    for (let i = 0; i < close.length; i++) {
        close[i].addEventListener('click', ()=>{
            close[i].parentElement.style.opacity = 0;
            setTimeout(()=>{
                close[i].parentElement.style.display = "none";
            }, 500)  
        })
        
    }
    dropDown.value = "";


})
