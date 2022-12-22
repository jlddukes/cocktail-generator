
// var myButton = document.querySelector('#select')
// var dropDown = document.querySelector('.dropdown')
// var menue = document.querySelector('.appear')
// myButton.addEventListener('click', function(){
//     console.log(dropDown.value)
//     var anchorEl = document.createElement('a')
//     anchorEl.textContent = dropDown.value
//     menue.appendChild(anchorEl)
// })


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





// var inputText = document.querySelector('#txt');
// var myButton = document.querySelector('.btn-list');
// var list = document.querySelector('.container ul');
// myButton.addEventListener('click', (e)=>{
//     if(inputText.value != ""){
//         e.preventDefault();
//         //create li
//         var myLi = document.createElement('li');
//         myLi.innerHTML = inputText.value;
//         list.appendChild(myLi);
//         //create span
//         var mySpan = document.createElement('span');
//         mySpan.innerHTML = 'x';
//         myLi.appendChild(mySpan);
//     }
//     var close = document.querySelectorAll('span');
//     for(let i=0; i<close.length; i++){
//         close[i].addEventListener('click', ()=>{
//             close[i].parentElement.style.opacity = 0;
//             setTimeout(()=>{
//                 close[i].parentElement.style.display = "none";
//             }, 500)  
//         })
//     }
//     inputText.value = "";
// });
