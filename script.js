const board = document.querySelector(".board")
const boardResult = document.querySelector(".board-result")

class entry {
    constructor(name,coordinates,elt) {
        this.name = name ;
        this.coordinates = coordinates ;
        this.elt = elt ;
        this.initialX = center(this.elt)[0];
        this.initialY = center(this.elt)[1];
        this.filled = false ;
        this.filledPawn = null;
        this.legalEntries = null
    }
}
const x1 = new entry("x1",[-1,1],document.getElementById("x1"))
const x2 = new entry("x2",[0,1],document.getElementById("x2"))
const x3 = new entry("x3",[1,1],document.getElementById("x3"))
const y1 = new entry("y1",[-1,0],document.getElementById("y1"))
const y2 = new entry("y2",[0,0],document.getElementById("y2"))
const y3 = new entry("y3",[1,0],document.getElementById("y3"))
const z1 = new entry("z1",[-1,-1],document.getElementById("z1"))
const z2 = new entry("z2",[0,-1],document.getElementById("z2"))
const z3 = new entry("z3",[1,-1],document.getElementById("z3"))
let listEntry = [x1,x2,x3,y1,y2,y3,z1,z2,z3]

//definition of legalEntries
x1.legalEntries = [y2,x2,y1]
x2.legalEntries = [y2,x3,x1]
x3.legalEntries = [y2,x2,y3]
y1.legalEntries = [y2,x1,z1]
y2.legalEntries = [x1,x2,x3,y1,y3,z1,z2,z3]
y3.legalEntries = [y2,x3,z3]
z1.legalEntries = [y2,y1,z2]
z2.legalEntries = [y2,z1,z3]
z3.legalEntries = [y2,z2,y3]

// generique container to permit the move all over the board at starting
containerGEN = {
    legalEntries: listEntry
}

class pawn {
    constructor(name,elt) {
        this.name = name ;
        this.elt = elt ;
        this.id = this.elt.id ;
        this.initialX = center(this.elt)[0];
        this.initialY = center(this.elt)[1];
        this.container = containerGEN; // just to permit to move the pawn all over the board
        this.status = "outside"; // outside the board
    }
}

const a1 = new pawn("a1",document.getElementById("a1"))
const a2 = new pawn("a2",document.getElementById("a2"))
const a3 = new pawn("a3",document.getElementById("a3"))
const b1 = new pawn("b1",document.getElementById("b1"))
const b2 = new pawn("b2",document.getElementById("b2"))
const b3 = new pawn("b3",document.getElementById("b3"))

let Winner ;
let listPawns = [a1,a2,a3,b1,b2,b3]
let currentX;
let currentY;
let active = false
let activeMove = ""
let currentpawn = a1 ;//initialiser
let oldpawn = Object.create(currentpawn) ;//initialiser
let turn = 1 // only blue pawn can be played when turn = 1. same for player2 when turn = 2
let mode = "preNormal" // only outside pawn can be played

listPawns.forEach((p)=>{
    if (mode != "Ended"){
        // MOUSING
        p.elt.addEventListener("mousedown", function(){
            if (((mode == "preNormal")&&(p.status == "outside")) || ((mode == "normal")&&(p.status == "inside"))){
                if(((turn%2 != 0) && (p.id[0]=="a")) || ((turn%2 == 0) && (p.id[0]=="b"))){
                    // indique le debut du mouvement
                    active = true
                    activeMove = "mousing"
                    
                    oldpawn = Object.create(currentpawn)
                    oldpawn.elt.classList.remove("selected")
                    currentpawn = p
                    currentpawn.elt.classList.add("selected")
                }
            }
        })
        // SELECTING
        p.elt.addEventListener("click", function(){
            if (((mode == "preNormal")&&(p.status == "outside")) || ((mode == "normal")&&(p.status == "inside"))){
                if(((turn%2 != 0) && (p.id[0]=="a")) || ((turn%2 == 0) && (p.id[0]=="b"))){
                    // indique le debut du mouvement
                    active = true
                    activeMove = "selecting"

                    oldpawn.elt.classList.remove("selected")
                    currentpawn = p // facultative because already done in mousing part
                    currentpawn.elt.classList.add("selected")
                }
            }
        })
    }
})

document.addEventListener("mousemove", function(e){
    if (!active){return }
    if (activeMove != "mousing"){return }
    e.preventDefault()
    
    currentX = e.clientX - currentpawn.initialX
    currentY = e.clientY - currentpawn.initialY

    currentpawn.elt.style.transform = `translate3d(${currentX}px,${currentY}px, 0)`

})

function isInside(area, x, y){
    let areaRect = area.getBoundingClientRect()
    return (
        areaRect.left <= x &&
        x <= areaRect.right &&
        areaRect.top <= y &&
        y <= areaRect.bottom
    )
}

function center(element){
    let bounds = element.getBoundingClientRect()
    return (
        [(bounds.left+bounds.right)/2,
         (bounds.top+bounds.bottom)/2  ]
    )
}
//check the alignement
function isAlign(pawn1,pawn2,pawn3){
    // horizontale alignement 
    if((pawn1.container.coordinates[0]==pawn2.container.coordinates[0])&&
    (pawn2.container.coordinates[0]==pawn3.container.coordinates[0]))
    {return true}

    // verticale alignement 
    else if((pawn1.container.coordinates[1]==pawn2.container.coordinates[1])&&
    (pawn2.container.coordinates[1]==pawn3.container.coordinates[1]))
    {return true}

    // diagonale alignement => 2 possibilities (y=x or y=-x)
    if (((pawn1.container.coordinates[0]==pawn1.container.coordinates[1])&&
    (pawn2.container.coordinates[0]==pawn2.container.coordinates[1])&&
    (pawn3.container.coordinates[0]==pawn3.container.coordinates[1]))
    ||
    ((pawn1.container.coordinates[0]==-pawn1.container.coordinates[1])&&
    (pawn2.container.coordinates[0]==-pawn2.container.coordinates[1])&&
    (pawn3.container.coordinates[0]==-pawn3.container.coordinates[1])))
    {return true}

    return false
}
//MOUSING - place the pawn
document.addEventListener("mouseup", function(e){
    if (!active){return }
    if (activeMove != "mousing"){return }

    currentpawn.elt.style.transform = `translate3d(${0}px,${0}px, 0)`
    for (ent of currentpawn.container.legalEntries){
        if (isInside(ent.elt, e.clientX, e.clientY)){
            if (!ent.filled){
                ent.elt.appendChild(currentpawn.elt)
                ent.filled = true
                ent.filledPawn = currentpawn
                currentpawn.container.filled = false
                currentpawn.container = ent
                currentpawn.status = "inside"
                // Alignement verification
                if (turn>=5){
                    if (turn%2!=0){
                        if (isAlign(a1,a2,a3)){
                            mode = "Ended"
                            Winner = "PLAYER 1"
                            console.log(Winner+"Win")
                            document.querySelector(".result span").innerHTML = Winner
                            boardResult.style.display = "grid"
                        }
                    }else if (isAlign(b1,b2,b3)){
                        mode = "Ended"
                        Winner = "PLAYER 2"
                        console.log(Winner+"Win")
                        document.querySelector(".result span").innerHTML = Winner
                        boardResult.style.display = "grid"
                    }
                }
                turn++
                break
            }
            
            
        }
    }
    listPawns.forEach((p)=>{
        p.initialX = center(p.elt)[0];
        p.initialY = center(p.elt)[1];
    })
    active = false
    activeMove = ""
    // currentpawn = null

    if ((turn >= 7)&&(mode=="preNormal")){ 
        mode = "normal" // all pawn are inside the board.
    }
})
//SELECTING - place the pawn
listEntry.forEach((ent)=>{
    ent.elt.addEventListener("click",()=>{
        if ((activeMove == "selecting")&&(active == true)){
            if (currentpawn.container.legalEntries.indexOf(ent)!==-1){
                if (!ent.filled){
                    ent.elt.appendChild(currentpawn.elt)
                    ent.filled = true
                    ent.filledPawn = currentpawn
                    currentpawn.container.filled = false
                    currentpawn.container = ent
                    currentpawn.status = "inside"

                    active = false
                    activeMove = ""
                    currentpawn.elt.classList.remove("selected")
                    // Alignement verification
                    if (turn>=5){
                        if (turn%2!=0){
                            if (isAlign(a1,a2,a3)){
                                mode = "Ended"
                                Winner = "PLAYER 1"
                                console.log(Winner+"Win")
                                document.querySelector(".result span").innerHTML = Winner
                                boardResult.style.display = "grid"
                            }
                        }else if (isAlign(b1,b2,b3)){
                            mode = "Ended"
                            Winner = "PLAYER 2"
                            console.log(Winner+"Win")
                            document.querySelector(".result span").innerHTML = Winner
                            boardResult.style.display = "grid"
                        }
                    }
                    turn++
                    if ((turn >= 7)&&(mode=="preNormal")){ 
                        mode = "normal" // all pawn are inside the board.
                    }
                }
            }
        }
    })
})

let newParty = document.querySelector(".new-party")
let p1 = document.querySelector(".front-pawns-player1")
let p2 = document.querySelector(".front-pawns-player2")
newParty.addEventListener("click", ()=>{
    p1.appendChild(a1.elt)
    p1.appendChild(a2.elt)
    p1.appendChild(a3.elt)
    p2.appendChild(b1.elt)
    p2.appendChild(b2.elt)
    p2.appendChild(b3.elt)

    boardResult.style.display = "none"
    // board.style.display = "flex"

    listPawns.forEach((p)=> {
        p.initialX = center(p.elt)[0]
        p.initialY = center(p.elt)[1]
        p.status = "outside"
        p.container = containerGEN
    })
    listEntry.forEach((ent)=> {
        ent.filled = false ;
        ent.filledPawn = null;
    })
    mode = "preNormal"
    turn = 1
})