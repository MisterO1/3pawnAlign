const allColorPawn = document.querySelectorAll(".color-pawn")
const modelPawn1 = document.querySelector(".model-pawn#a")
const modelPawn2 = document.querySelector(".model-pawn#b")

const option1 = document.querySelector(".option1")
const option2 = document.querySelector(".option2")
const optionSpace1 = document.querySelector(".option-space1")
const optionSpace2 = document.querySelector(".option-space2")

let currentModelPawn;
let chosing = false;

// let colorA = "#0000ff"
// let colorB = "#ff0000"
let colorA = sessionStorage.getItem("colorA")
let colorB = sessionStorage.getItem("colorB")
modelPawn1.style.backgroundColor = colorA
modelPawn2.style.backgroundColor = colorB

let colors = ["#ff0000","#505022","#ffa500","#0000ff","#00ffff","#800080","#00ff00","#dea0ab","#a52a2a"]

modelPawn1.addEventListener("click",()=>{
    optionSpace2.style.display = "none"
    currentModelPawn = modelPawn1
    optionSpace1.style.display = "grid"
    place(1)
    chosing = true
})
modelPawn2.addEventListener("click",()=>{
    optionSpace1.style.display = "none"
    currentModelPawn = modelPawn2
    optionSpace2.style.display = "grid"
    place(2)
    chosing = true
})

allColorPawn.forEach((cp,ind)=>{
    cp.addEventListener("click",()=>{
        let color = colors[Number(cp.className[cp.className.length-1])-1]
        currentModelPawn.style.backgroundColor = color
        if (ind<9){
            colorA = color
        }else{
            colorB = color
        }
        optionSpace1.style.display = "none"
        optionSpace2.style.display = "none"
    })
})

function place(n){
    if (n==1){
        let x = optionSpace1.getBoundingClientRect().right - modelPawn1.getBoundingClientRect().right
        let y = optionSpace1.getBoundingClientRect().bottom - modelPawn1.getBoundingClientRect().bottom
        let h = modelPawn1.getBoundingClientRect().height
        option1.style.right = `${x}px`
        option1.style.bottom = `${y+h}px`
    }else if(n==2){
        let x = optionSpace2.getBoundingClientRect().right - modelPawn2.getBoundingClientRect().right
        let y = optionSpace2.getBoundingClientRect().bottom - modelPawn2.getBoundingClientRect().bottom
        let h = modelPawn2.getBoundingClientRect().height
        option2.style.right = `${x}px`
        option2.style.bottom = `${y+h}px`
    }
}

[optionSpace1,optionSpace2].forEach((os)=>{
    os.addEventListener("click",()=>{
        os.style.display = "none"
    })
})

const newParty = document.querySelector(".new-party button")
const _msgError = document.querySelector(".msg-error")

newParty.addEventListener("click",()=>{
    if(colorA==null){
        colorA = "#0000ff"
    }
    if(colorB==null){
        colorB = "#ff0000"
    }
    if (colorA===colorB){   // set error message if we get the same color for both
        startMsgError()
        setTimeout(EndMsgError,2000)
        // console.log('meme couleur')
    }else{
        sessionStorage.setItem("colorA",colorA)
        sessionStorage.setItem("colorB",colorB)
        window.location.href = "party.html"
        // console.log('non')
    }
})


// MESSAGE D'ERREUR
const width = _msgError.getBoundingClientRect().width
const duration = 1000; // 1 seconds
const distance = width+50; // 400px to the right
let start = null;

// Ease-in-out function
function easeInOut(t) {
    return t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Animation function
function forward(time) {
    if (!start) start = time; // Initialize start time on first call
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
    const easedProgress = easeInOut(progress);

    _msgError.style.transform = `translateX(${easedProgress * distance}px)`

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

    _msgError.style.transform = `translateX(${(1-easedProgress) * distance}px)`

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