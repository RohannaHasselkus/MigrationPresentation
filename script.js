// ===============================
// Slide Navigation
// ===============================

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;


// ===============================
// Create Slide Counter
// ===============================

const counter = document.createElement("div");
counter.id = "slide-counter";

document.body.appendChild(counter);


// ===============================
// Create Progress Bar
// ===============================

const progressContainer = document.createElement("div");
progressContainer.id = "progress-container";

const progressBar = document.createElement("div");
progressBar.id = "progress-bar";

progressContainer.appendChild(progressBar);

document.body.appendChild(progressContainer);


// ===============================
// Go To Slide
// ===============================

function goToSlide(index){

    if(index < 0) return;
    if(index >= slides.length) return;

    currentSlide = index;

    slides[currentSlide].scrollIntoView({
        behavior: "smooth"
    });

    updateCounter();
    updateProgress();

}


// ===============================
// Next Slide
// ===============================

function nextSlide(){

    if(currentSlide < slides.length - 1){

        currentSlide++;

        goToSlide(currentSlide);

    }

}


// ===============================
// Previous Slide
// ===============================

function previousSlide(){

    if(currentSlide > 0){

        currentSlide--;

        goToSlide(currentSlide);

    }

}


// ===============================
// Update Counter
// ===============================

function updateCounter(){

    counter.innerHTML =
        (currentSlide + 1) + " / " + slides.length;

}


// ===============================
// Update Progress Bar
// ===============================

function updateProgress(){

    const percent =
        ((currentSlide + 1) / slides.length) * 100;

    progressBar.style.width = percent + "%";

}


// ===============================
// Keyboard Controls
// ===============================

document.addEventListener("keydown",(event)=>{

    switch(event.key){

        case "ArrowRight":
        case "PageDown":
        case " ":
            nextSlide();
            break;

        case "ArrowLeft":
        case "PageUp":
            previousSlide();
            break;

        case "Home":
            goToSlide(0);
            break;

        case "End":
            goToSlide(slides.length-1);
            break;

    }

});


// ===============================
// Mouse Wheel Navigation
// ===============================

let wheelTimeout;

window.addEventListener("wheel",(event)=>{

    clearTimeout(wheelTimeout);

    wheelTimeout = setTimeout(()=>{

        if(event.deltaY > 0){

            nextSlide();

        }

        else{

            previousSlide();

        }

    },100);

});


// ===============================
// Click Right Side → Next Slide
// Click Left Side → Previous Slide
// ===============================

document.addEventListener("click",(event)=>{

    if(event.clientX > window.innerWidth/2){

        nextSlide();

    }

    else{

        previousSlide();

    }

});


// ===============================
// Track Scroll Position
// ===============================

window.addEventListener("scroll",()=>{

    let bestIndex = 0;
    let bestDistance = Infinity;

    slides.forEach((slide,index)=>{

        const distance = Math.abs(
            slide.getBoundingClientRect().top
        );

        if(distance < bestDistance){

            bestDistance = distance;
            bestIndex = index;

        }

    });

    currentSlide = bestIndex;

    updateCounter();
    updateProgress();

});


// ===============================
// Fullscreen Toggle (f)
// ===============================

document.addEventListener("keydown",(event)=>{

    if(event.key === "f"){

        if(!document.fullscreenElement){

            document.documentElement.requestFullscreen();

        }

        else{

            document.exitFullscreen();

        }

    }

});


// ===============================
// Initial Setup
// ===============================

updateCounter();
updateProgress();

goToSlide(0);
