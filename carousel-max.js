export function makeCarousel(params) {

const {destinationClass, imagesPaths, carouselWidth, carouselHeight, imgWidth, imgGap} = params;
const carousel = document.querySelector('.'+destinationClass)
const totalImages = imagesPaths.length; 

let mouseEnterPoint, dxMouse = 0; //mouseX - start amoun X of mouse when button pressed, dxMouse - the difference between mouseX and current mouse X position 
let dxRibbon = -(imgWidth + imgGap)*2 + (carouselWidth-imgWidth -imgGap)/2 ; //offset of Ribbon
let move = false; //is gallery moving now
let picsArray = [1,2,3,4,5]; //the array length=5 for images to show
let basePic = totalImages - 2; //the order of the first picture in picsArray
const carouselCenter = -(imgWidth + imgGap)*2 + (carouselWidth-imgWidth -imgGap)/2;
const offsetMax = 120; //max offset of image (left or right)

let inertiaCurrentMouseX; //current mouse x coordinate
let inertiaPreviousMouseX; //last iteration mouse x coordinate
let inertiaSpeedX = 0; //speed of moving while inertia, decreasing by *inertiaStep
const inertiaSensivity = 20; //inetria turns on when moving speed is higher
const inertiaStep = 0.98;
let inertiaCounter; //setinterval for declining speed while inertia
let carouselInertionTimer; //setinterva for calculating mouse speed

//creation the carousel html and styles
carousel.style.width = carouselWidth + 'px';
carousel.style.height = carouselHeight + 'px';
carousel.style.position = 'relative';
carousel.style.overflow = 'hidden';
carousel.style.whiteSpace = 'nowrap';
carousel.style.userSelect = 'none';
carousel.style.boxSizing = 'border-box';



carousel.innerHTML = `
    <div class="${destinationClass}-images-container">
        ${picsArray.map((el) => {
            return (`
            <div class="${destinationClass}-img-container" style="width: ${imgWidth}px; height: ${carouselHeight}px; margin-left: ${imgGap/2}px; margin-right: ${imgGap/2 }px;">
                <div class="${destinationClass}-offset-container">
                    <img class='${destinationClass}-carousel-img'>
                </div>
            </div>
            `)
        }).join('')}
    </div>`

const ribbonImages = document.querySelector(`.${destinationClass}-images-container`); //The container for all 5 images
const imgContainerList = document.querySelectorAll(`.${destinationClass}-img-container`); //The list of all 5 containers
const offsetList = document.querySelectorAll(`.${destinationClass}-offset-container`); //list of all 5 offset containers
const imagesList = document.querySelectorAll(`.${destinationClass}-carousel-img`); //list of all 5 images to show


//styles injection
ribbonImages.style.cssText = `
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    width: auto;
    display: inline-block;
    pointer-events: none;
`

imgContainerList.forEach((el) => {
    el.style.cssText = `
        width: ${imgWidth}px;
        height: ${carouselHeight}px;
        margin-left: ${imgGap/2}px; 
        margin-right: ${imgGap/2 }px;
        padding: 0;
        box-sizing: border-box;
        display: inline-block;
        overflow: hidden;
        pointer-events: none;

    `
})

offsetList.forEach((el) => {
    el.style.cssText = `
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    `
})

imagesList.forEach((el) => {
    el.style.cssText = `
        position: relative;
        margin: 0;
        padding: 0;
        width: ${imgWidth}px;
        pointer-events: none;
    `
})



//height: ${imgWidth}px;

const changePicsOrder = (direction) => { //change pictures to show in picsArray and show them. Filled from imagesPaths
    if (direction === '+') { //pictures offset when moving left
        (basePic > totalImages -1) ? basePic = 1 : basePic++
    }
    if (direction === '-') {//pictures offset when moving right
        (basePic < 1) ? basePic = totalImages-1 : basePic--
    }
    
    for (var index = 0; index < 5; index++) {
        picsArray[index] = (basePic+index < totalImages) ? imagesPaths[index+basePic] : imagesPaths[basePic+index - totalImages] 
    }
    
    imagesList.forEach((el, index) => {  //change all 5 images to show in imagesList
        el.src = picsArray[index]
    })


}


const changeImgOffset = (currentPos) => { //changing offset for all pictures
    offsetList.forEach((el, index) => {
            let centerDx = currentPos - carouselCenter - (imgWidth + imgGap)*(2-index); //the offset between central position and current position
            let k = 2*offsetMax / (carouselWidth + imgWidth); //calculating the k to reach max offset on the carousel edge 
                el.style.left = `${-k*centerDx + imgGap / 2}px`
                //el.style.top = `${carouselHeight}px`

    })
}


const redrawCarousel = (dx) => { //changing the position of ribbonImages
    if (dx + dxRibbon > -(imgWidth + imgGap - (carouselWidth-imgWidth -imgGap)/2)) { //if the offset is more than 1 picture width
        dxRibbon = dxRibbon - imgWidth - imgGap; 
        changePicsOrder('-');

    }
    if (dx + dxRibbon < -(imgWidth + imgGap)*3 + (carouselWidth-imgWidth -imgGap)/2  ) { //if the offset is more than 1 picture width
        dxRibbon = dxRibbon + imgWidth + imgGap; 
        changePicsOrder('+');
    }
    
    ribbonImages.style.left = `${dx + dxRibbon}px`; //change ribbon position
    changeImgOffset(dx + dxRibbon); //change images offset
    
}




carousel.addEventListener('mousedown', e => {
    clearInterval(inertiaCounter); //stop the inertia
    move = true;
    mouseEnterPoint = e.offsetX;
    carousel.classList.add(`${destinationClass}-grabbed`);

})


carousel.addEventListener('mousemove', e => {
    if (move) {
        dxMouse = e.offsetX - mouseEnterPoint;
        redrawCarousel(dxMouse);
    }
})



function inertiaMovement(dx) {
    clearInterval(inertiaCounter); //fix bug when some timers start simultaniously

    inertiaCounter = setInterval((e) => {
        dx = dx * inertiaStep;
        if (Math.abs(dx) <= 2) {
            inertiaSpeedX = 0;
            clearInterval(inertiaCounter);
        } else {
            dxRibbon = dxRibbon - dx/25;
            redrawCarousel(0);
        }
    }, 1);
}


const stopMove = (e) => { //stop move the carousel
    move = false;
    dxRibbon = dxRibbon + dxMouse; //fixing the offset
    dxMouse = 0; 
 
    inertiaSpeedX = inertiaPreviousMouseX - inertiaCurrentMouseX ;
    if (Math.abs(inertiaSpeedX) > inertiaSensivity) { //has an inertion
        inertiaMovement(inertiaSpeedX);
    }
    carousel.classList.remove(`${destinationClass}-grabbed`)
}



carousel.addEventListener('mouseup', e => stopMove(e))
carousel.addEventListener('mouseout', e => stopMove(e))

carouselInertionTimer = setInterval((e) => { //check mouse speed every 100ms
    inertiaPreviousMouseX = inertiaCurrentMouseX;
    inertiaCurrentMouseX = dxMouse;
}, 100);


changePicsOrder(); //initial filling picsArray
redrawCarousel(0); //initial draw the carousel


window.onload = function() { //vertical positioning picture
    console.log('!    ', offsetList[1].offsetHeight)
    offsetList.forEach((el) => {
        el.style.top = `-${(el.offsetHeight- carouselHeight)/2}px`
    })

}


}


