const particlesCanvas = document.getElementById("particlesCanvas");
const context = particlesCanvas.getContext("2d");
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fillStyle = "rgb(242, 100, 25)";
        context.fill();
    }

    update() {
        if(this.x > particlesCanvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }

        if(this.y > particlesCanvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (particlesCanvas.height * particlesCanvas.width) / 8000;

    for(let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = "rgb(242, 100, 25)";

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);

    for(let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    connect();
}

function connect() {
    let opacity = 1;
    for(let i = 0; i < particlesArray.length; i++) {
        for(let j = i; j < particlesArray.length; j++) {
            let distance = (Math.pow((particlesArray[i].x - particlesArray[j].x), 2) + Math.pow((particlesArray[i].y - particlesArray[j].y), 2));
            if(distance < (particlesCanvas.width / 5) * (particlesCanvas.height / 5)) {
                opacity = 1 - (distance / 20000);
                context.strokeStyle = "rgba(242, 100, 25," + opacity + ")";

                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(particlesArray[i].x, particlesArray[i].y);
                context.lineTo(particlesArray[j].x, particlesArray[j].y);
                context.stroke();
            }
        }
    }
}

window.addEventListener("resize", function() {
    particlesCanvas.width = innerWidth;
    particlesCanvas.height = innerHeight;
    init();
});

init();
animate();

/* ---------------------------------------- Intersection Observer ---------------------------------------- */

const options = {
    root: null, // it is the viewport
    threshold: 0.5,
    rootMargin: "0px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting);
    })
}, options);

document.querySelectorAll(".container").forEach(container => {
    observer.observe(container);
});

/* ---------------------------------------- Toggle light and dark mode ---------------------------------------- */

const toggle = document.getElementById("toggleLight");
let primary = "rgb(33, 37, 41)";
let secondary = "rgb(242, 100, 25)";

toggle.addEventListener("click", function() {
    this.classList.toggle("fa-moon");

    if(this.classList.toggle("fa-sun")) {
        document.documentElement.style.setProperty('--primary', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--font-color', 'rgb(0, 0, 0)');
        document.documentElement.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');

        document.documentElement.style.setProperty('--card-bg-color', 'rgba(0, 0, 0, 0.015)');
        document.documentElement.style.setProperty('--card-border-color', 'rgba(0, 0, 0, 0.1)');
        document.documentElement.style.setProperty('--card-font-color', 'rgba(0, 0, 0, 0.5)');
    } else {
        document.documentElement.style.setProperty('--primary', 'rgb(33, 37, 41)');
        document.documentElement.style.setProperty('--font-color', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');

        document.documentElement.style.setProperty('--card-bg-color', 'rgba(255, 255, 255, 0.015)');
        document.documentElement.style.setProperty('--card-border-color', 'rgba(255, 255, 255, 0.1)');
        document.documentElement.style.setProperty('--card-font-color', 'rgba(255, 255, 255, 0.5)');
    }

    document.getElementById("logo").classList.toggle('black');
});

/* ---------------------------------------- Mobile navigation menu ---------------------------------------- */

const trigger = document.getElementById("wrapper");
const openTrigger = document.getElementById("menu-trigger");
const closeTrigger = document.getElementById("close-trigger");

let isAnimationFinish = true;

function animation() {
    for (let item of openTrigger.children) {
        item.classList.toggle("hide");
        item.classList.add("transition");
        
        setTimeout(function() {
            item.classList.remove("transition");
        }, 1000);
    }

    for (let item of closeTrigger.children) {
        item.classList.toggle("show");
        item.classList.add("transition");

        setTimeout(function() {
            item.classList.remove("transition");
        }, 1000);
    }
}

trigger.addEventListener("click", function() {
    if(isAnimationFinish) {
        isAnimationFinish = false;
        
        animation();
        
        document.getElementsByTagName("header")[0].classList.toggle("open");
        
        setTimeout(function() {
            isAnimationFinish = true;
        }, 1000);
    }
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function() {
        document.querySelector("header").classList.remove("open");

        animation();
    });
});