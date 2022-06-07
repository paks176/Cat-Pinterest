const content = document.querySelector('.content')
const catContent = document.querySelector('.content__cats');
const favourite = document.querySelector('.favourite')
const favouriteContent = document.querySelector('.content__favourite');
const emptyMessage = document.querySelector('.favourite__empty-message');
const allCatsButton = document.querySelector('#all_cats');
const favCatsButton = document.querySelector('#fav_cats');
const main = document.querySelector('main');
const addedMessage = '<div class="added__message">This image is already in favourite</div>'
let counter = 0;

let favList = {
    pull: [],
    clear() {
        pull = [];
        this.checkEmptiness();
    },
    delete(thisBlock) {
        let thisIndex = this.pull.indexOf(thisBlock.id)
        this.pull.splice(thisIndex, 1)
    },
    checkEmptiness() {
        if (favList.pull.length === 0) {
            emptyMessage.setAttribute('style', 'display:block');
        } else {
            emptyMessage.setAttribute('style', 'display:none');
        }
    }
};

let favPull = favList.pull;

class FavCat {
    constructor(ID, image) {
        this.ID = ID;
        this.image = image;
    }
}
    // Добавить в избранные
function addToFavourite(thisBlock) {
    for (let i = 0; i <= favPull.length; i++) {

        if (favPull.length === 0 || favPull[i] === undefined) {
            let newFavourite = new FavCat(thisBlock.id, thisBlock.style.backgroundImage);
            favPull.push(newFavourite);
            let thisFavourite = document.createElement('div');
            thisFavourite.classList.add('fav__block');
            thisFavourite.setAttribute('style', `background-image:${thisBlock.style.backgroundImage}`)
            favouriteContent.appendChild(thisFavourite);
            return
        }
        if (favPull[i].ID == thisBlock.id) {
            thisBlock.insertAdjacentHTML('afterbegin', addedMessage);
            let addAnimation = thisBlock.querySelector('.added__message')
            addAnimation.setAttribute('style',
            'animation-duration: 2s !important; animation-name: appear !important')
            setTimeout(function() {
                addAnimation.remove()
            } , 2000) 
            return
        }
    }
}

    
    // Сделать массив из элементов
function makeArray() {
    content.insertAdjacentHTML('beforeend', '<div class="loading">Loading</div>')
    counter += 1;
    let thisArray = document.createElement('div');
    thisArray.classList.add('content__cats--array');
    thisArray.setAttribute('id', `array_${counter}`);
    thisArray.setAttribute('style', 'display:none;');
    catContent.appendChild(thisArray);
    for (let i = 1; i <= 15; i++) {
        let thisID = counter + '_' + i;
        let thisBlock = document.createElement('div');
        thisBlock.classList.add('cat__block');
        thisBlock.setAttribute('id', `${thisID}`);
        thisBlock.innerHTML = '<div class="cat__block--button"></div>'
        makeFunctions(thisBlock);
        thisArray.appendChild(thisBlock);
    }
    setTimeout(function() {
        content.querySelector('.loading').remove();
        thisArray.setAttribute('style', 'display:flex;')
        window.onscroll = scrollChecker;
    }, 2000);
    
}

    // Операции с элементом массива картинок
function makeFunctions(thisBlock) {
        // Подтягиваем картинку
    fetch('https://api.thecatapi.com/v1/images/search')
    .then(response => response.json())
    .then((data) => {
        let ImageURL = data[0].url;
        thisBlock.setAttribute('style', `background-image: url(${ImageURL})`);
    }).catch((error) => {
        // Обработка ошибки
        console.log(`Error "${error}" in loading image for cat__block ${thisBlock.id}`);
        thisBlock.setAttribute('style', 'align-items:unset; justify-content:center;')
        thisBlock.innerHTML = '<div class="error-message"><div class="error-message__block">Ошибка загрузки котика</div></div>'
    });
        // Обработчик события на появление кнопки лайка
    let thisLike = thisBlock.querySelector('.cat__block--button');
    thisBlock.addEventListener('mouseover', () => {
        thisLike.setAttribute('style', 'display:block;')
    });
    thisBlock.addEventListener('mouseout', () => {
        thisLike.setAttribute('style', 'display:none;')
    });
        // Обработчик события на нажатие кнопки лайка
    thisLike.addEventListener('click', (event) => addToFavourite(thisBlock));
}
    // Переключение на избранных котов
favCatsButton.addEventListener('click', (event) => {
    content.setAttribute('style', 'display:none;');
    favourite.setAttribute('style', 'display:block;');
    favCatsButton.classList.add('active');
    allCatsButton.classList.remove('active');
    favList.checkEmptiness();
});
    // Переключение на всех котов
allCatsButton.addEventListener('click', (event) => {
    content.setAttribute('style', 'display:block;');
    favourite.setAttribute('style', 'display:none;');
    favCatsButton.classList.remove('active');
    allCatsButton.classList.add('active');
    
});

function scrollChecker() {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        window.onscroll = '';
        makeArray();
    }
}

makeArray();