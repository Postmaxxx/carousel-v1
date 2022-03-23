import {makeCarousel} from './carousel-max.js';







let carousel_1 = {
    destinationClass : 'carousel-max-container',
    carouselHeight : 300,
    carouselWidth: 900,
    imgWidth : 550,
    imgGap : 50,
    imagesPaths : ['./1.jpg','./2.jpg','./3.jpg','./4.jpg','./5.jpg','./6.jpg']
}

makeCarousel(carousel_1);



let carousel_2 = {
    destinationClass : 'carousel-max-container2',
    carouselHeight : 300,
    carouselWidth: 900,
    imgWidth : 550,
    imgGap : 50,
    imagesPaths : ['./11.jpg','./12.jpg','./13.jpg','./14.jpg','./15.jpg','./16.jpg']
}

makeCarousel(carousel_2);
