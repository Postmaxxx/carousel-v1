const carousel = document.querySelector('.carousel-container')
let imagesPaths = ['./1.jpg','./2.jpg','./3.jpg','./4.jpg','./5.jpg','./6.jpg'];
const totalImages = imagesPaths.length; 
const carouselWidth = 900;
const carouselHeight = 500;
const imgWidth = 550;
const imgGap = 50; //The gap between images
let mouseEnterPoint, dxMouse = 0; //mouseX - start amoun X of mouse when button pressed, dxMouse - the difference between mouseX and current mouse X position 
let dxRibbon = -(imgWidth + imgGap)*2 + (carouselWidth-imgWidth -imgGap)/2 ; //offset of Ribbon
let move = false; //is gallery moving now
let picsArray = [1,2,3,4,5]; //the array length=5 for images to show
let basePic = totalImages - 2; //the order of the first picture in picsArray
const carouselCenter = -(imgWidth + imgGap)*2 + (carouselWidth-imgWidth -imgGap)/2;
const offsetMax = 120; //max offset of image (left or right)


let inertiaCurrentMouseX;
let inertiaPreviousMouseX;
let inertiaSpeedX = 0;
const inertiaSensivity = 20;
const inertiaStep = 0.98;
let inertiaCounter;

//creation the carousel html and styles
carousel.style.width = carouselWidth + 'px';
carousel.style.Height = carouselHeight + 'px';
carousel.innerHTML = `
    <div class="images-container">
        ${picsArray.map((el) => {
            return (`
            <div class="img-container" style="width: ${imgWidth}px; height: ${carouselHeight}px; margin-left: ${imgGap/2}px; margin-right: ${imgGap/2 }px;">
                <div class="offset-container">
                    <img class='carousel-img'>
                </div>
            </div>
            `)
        }).join('')}
    </div>`
const ribbonImages = document.querySelector('.images-container'); //The container for all 5 images
const imagesList = document.querySelectorAll('.carousel-img'); //list of all 5 images to show
const offsetList = document.querySelectorAll('.offset-container'); //list of all 5 offset containers



const changePicsOrder = (direction) => { //change pictures to show in picsArray and show them. Filled from imagesPaths
    if (direction === '+') {
        (basePic > totalImages -1) ? basePic = 1 : basePic++
    }
    if (direction === '-') {
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
        //console.clear();
            let centerDx = currentPos - carouselCenter - (imgWidth + imgGap)*(2-index); //the offset between central position and current position
            //console.log('index ', index, 'centerDx ', centerDx);
            let k = 2*offsetMax / (carouselWidth + imgWidth); //calculating the k to reach max offset on the carousel edge 
            el.style.left = `${k*centerDx}px`
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
    clearInterval(inertiaCounter);
    move = true;
    mouseEnterPoint = e.offsetX;
    carousel.classList.add('carousel-container-grabed');
})


carousel.addEventListener('mousemove', e => {
    if (move) {
        dxMouse = e.offsetX - mouseEnterPoint;
        redrawCarousel(dxMouse);
    }
})



function inertiaMovement(dx) {
    clearInterval(inertiaCounter); //fix bug when some timers start simutaniously

    inertiaCounter = setInterval((e) => {
        dx = dx * inertiaStep;
        if (Math.abs(dx) <= 2) {
            inertiaSpeedX = 0;
            clearInterval(inertiaCounter);
            console.log('Killing');
        } else {
            dxRibbon = dxRibbon - dx/20;
            redrawCarousel(0);
        }
    }, 1);
}


const stopMove = (e) => { //stop move the carousel
    move = false;
    dxRibbon = dxRibbon + dxMouse; //fixing the offset
    dxMouse = 0; 
 
    inertiaSpeedX = inertiaPreviousMouseX - inertiaCurrentMouseX ;
    if (Math.abs(inertiaSpeedX) > inertiaSensivity) {
        inertiaMovement(inertiaSpeedX);
    }
    carousel.classList.remove('carousel-container-grabed')
}



carousel.addEventListener('mouseup', e => stopMove(e))
carousel.addEventListener('mouseout', e => stopMove(e))

carouselInertionTimer = setInterval((e) => { //check mouse speed every 100ms
    inertiaPreviousMouseX = inertiaCurrentMouseX;
    inertiaCurrentMouseX = dxMouse;
    //inertiaDxMouseX = inertiaCurrentMouseX - inertiaPreviousMouseX;
}, 100);


changePicsOrder(); //initial filling picsArray
redrawCarousel(0); //initial draw the carousel