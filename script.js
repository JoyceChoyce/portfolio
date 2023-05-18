// Get reference to the SVG element in our html file
const svg = document.getElementById("base-svg");

// Particle class definition
class Particle {
    constructor(xPos, yPos, radius, box) {
        this.x = xPos; // Initial x-position of the circle
        this.y = yPos; // Initial y-position of the circle
        this.r = radius; // Size of the circle
        this.svgElement; // Circle SVG element
        this.animDuration = randomNum(3, 5); // Duration for circle animation
        this.targetX = randomNum(0, box.width); // Target x-position for the circle
        this.targetY = randomNum(0, box.height); // Target y-position for the circle
        this.box = box; // Reference to the SVG box
        this.svg = svg; // Reference to the SVG element
    }

    // Create and draw the particle on the SVG canvas
    drawParticle() {
        this.svgElement = makeCircle(this.x, this.y, this.r, randomRGB());
        svg.appendChild(this.svgElement);
        this.addAnimateX();
        this.addAnimateY();
    }

    // Add animation for the 'cx' attribute of the circle
    addAnimateX() {
        let animElement = createAnimateElement('cx', `${this.x}; ${this.targetX};`, this.animDuration);
        this.svgElement.appendChild(animElement);
    }

    // Add animation for the 'cy' attribute of the circle
    addAnimateY() {
        let animElement = createAnimateElement('cy', `${this.y}; ${this.box.height}`, this.animDuration, 'spline');
        this.svgElement.appendChild(animElement);
    }
}

// Create an array of Particle instances
function createParticlesArray(num, box) {
    let particleInstances = [];

    for (let i = 0; i < num; i++) {
        let particleX = box.width / 2;
        let particleY = box.height / 2;
        let particleSize = randomNum(box.width * 0.001, box.width * 0.005);
        particleInstances.push(new Particle(particleX, particleY, particleSize, box));
    }

    return particleInstances;
}

// Set the background color and viewbox of the SVG canvas
svg.setAttribute("style", "background-color: black");
const bbox = svg.getBoundingClientRect();
svg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);

// Create and draw particles on the canvas
let particles = createParticlesArray(50, bbox);
for (let particle of particles) {
    particle.drawParticle();
}

// Resize the SVG canvas and particles when the window is resized
window.addEventListener('resize', resizeSvg);

function resizeSvg() {
    const svg = document.getElementById('base-svg');
    const bbox = svg.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
    removeAllChildElements(svg);

    let particles = createParticlesArray(50, bbox);

    for (let particle of particles) {
        particle.drawParticle();
    }
}

// Generate a random number within a specified range
function randomNum(lower, upper) {
    return lower + Math.random() * (upper - lower);
}

// Generate a random RGB color value
function randomRGB() {
    return `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`;
}

// Create a circle SVG element
function makeCircle(x, y, radius, color) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", color);
    return circle;
}

// Create an animate element for SVG animation
function createAnimateElement(attributeName, values, duration, calcMode = 'linear') {
    let animElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animElement.setAttribute('attributeName', attributeName);
    animElement.setAttribute('values', values);
    animElement.setAttribute('dur', duration);
    animElement.setAttribute('repeatCount', 'indefinite');

    if (calcMode === 'spline') {
        animElement.setAttribute('keyTimes', '0; 1');
        animElement.setAttribute('keySplines', '0.25, 0.10, 0, 0');
        animElement.setAttribute('calcMode', 'spline');
    }

    return animElement;
}

// Remove all child elements from an SVG element except 'defs'
function removeAllChildElements(element) {
    let children = element.children;

    for (let i = children.length - 1; i >= 0; i--) {
        let el = children[i];

        if (el.tagName !== 'defs') {
            el.remove();
        }
    }
}
