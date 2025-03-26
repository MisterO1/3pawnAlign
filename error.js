// let colorA = sessionStorage.getItem("colorA")
// let colorB = sessionStorage.getItem("colorB")

// const newParty = document.querySelector(".new-party button")
// const _msgError = document.querySelector(".msg-error")

const width = _msgError.getBoundingClientRect().width
const duration = 1000; // 1 seconds
let distance = 100;  // 100vw pour cacher le message d'erreur
_msgError.style.transform = `translateX(${distance}vw)`;
let start = null;

// Ease-in-out function
function easeInOut(t) {
    return t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Animation functions
function forward(time) {
    if (!start) start = time; // Initialize start time on first call

    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
    const easedProgress = easeInOut(progress);

    _msgError.style.transform = `translateX(${(1-easedProgress) * distance}vw)`

    if (progress < 1) {
        requestAnimationFrame(forward);
    } else {
        start = null; // Reset start time for future animations
    }
}

function backward(time) {
    if (!start) start = time; // Initialize start time on first call

    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
    const easedProgress = easeInOut(progress);

    _msgError.style.transform = `translateX(${(easedProgress) * distance}vw)`
    
    if (progress < 1) {
        requestAnimationFrame(backward);
    } else {
        start = null; // Reset start time for future animations
    }
}
// Start animation
function startMsgError(){
    if (!start) {
        requestAnimationFrame(forward);
    }
}
function EndMsgError(){
    if (!start) {
        requestAnimationFrame(backward);
    }
}

newParty.addEventListener("touchstart",()=>{
    if ((colorA===colorB)){  // set error message if we get the same color for both
        startMsgError()
        newParty.disabled = true
        setTimeout(() => {
            EndMsgError();
            setTimeout(()=>{
                newParty.disabled = false;  // Réactive le bouton après l'exécution complète de l'animation qui dure "duration"
            },duration)
        },2000);
    }
})