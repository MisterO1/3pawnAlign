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
const x1 = new entry("x1",coord("e-1+1"),document.getElementById("e-1+1"))
const x2 = new entry("x2",coord("e0+1"),document.getElementById("e0+1"))
const x3 = new entry("x3",coord("e+1+1"),document.getElementById("e+1+1"))
const y1 = new entry("y1",coord("e-1+0"),document.getElementById("e-1+0"))
const y2 = new entry("y2",coord("e0+0"),document.getElementById("e0+0"))
const y3 = new entry("y3",coord("e+1+0"),document.getElementById("e+1+0"))
const z1 = new entry("z1",coord("e-1-1"),document.getElementById("e-1-1"))
const z2 = new entry("z2",coord("e0-1"),document.getElementById("e0-1"))
const z3 = new entry("z3",coord("e+1-1"),document.getElementById("e+1-1"))
//definition of legalEntries
x1.legalEntries = [y2,x2,y1]
x2.legalEntries = [y2,x3,x1]
x3.legalEntries = [y2,x2,y3]
y1.legalEntries = [y2,x1,z1]
y2.legalEntries = [x1,x2,x3,y1,y3,z1,z2,z3,y2]
y3.legalEntries = [y2,x3,z3]
z1.legalEntries = [y2,y1,z2]
z2.legalEntries = [y2,z1,z3]
z3.legalEntries = [y2,z2,y3]

class pawn {
    constructor(name,elt) {
        this.name = name ;
        this.elt = elt ;
        this.coordinates = null ;
        this.id = this.elt.id ;
        this.initialX = center(this.elt)[0];
        this.initialY = center(this.elt)[1];
        this.container = y2; // just to permit to move the pawn all over the board
        this.status = "outside"; // outside the board
    }
}

const a1 = new pawn("a1",document.getElementById("a1"))
const a2 = new pawn("a2",document.getElementById("a2"))
const a3 = new pawn("a3",document.getElementById("a3"))
const b1 = new pawn("b1",document.getElementById("b1"))
const b2 = new pawn("b2",document.getElementById("b2"))
const b3 = new pawn("b3",document.getElementById("b3"))

function coord (ch){
    switch (ch){
        case "e-1+1":
            return [-1,1]
        case "e0+1":
            return [0,1]
        case "e+1+1":
            return [1,1]
        case "e-1+0":
            return [-1,0]
        case "e0+0":
            return [0,0]
        case "e+1+0":
            return [1,0]
        case "e-1-1":
            return [-1,-1]
        case "e0-1":
            return [0,-1]
        case "e+1-1":
            return [1,-1]
    }
}

let Winner ;
let listPawns = [a1,a2,a3,b1,b2,b3]
let listEntry = [x1,x2,x3,y1,y2,y3,z1,z2,z3]
let currentX, currentY
let active = false
let currentpawn ;
let turn = 1 // only blue pawn can be played when turn = 1. same for player2 when turn = 2
let mode = "preNormal" // only outside pawn can be played


listPawns.forEach((p)=>{
    if (mode != "Ended"){
        p.elt.addEventListener("mousedown", function(){
            if (((mode == "preNormal")&&(p.status == "outside")) || ((mode == "normal")&&(p.status == "inside"))){
                if(((turn%2 != 0) && (p.id[0]=="a")) || ((turn%2 == 0) && (p.id[0]=="b"))){
                    // indique le debut du mouvement
                    active = true
                    currentpawn = p
                }
            }
            
        })
    }
    
})

document.addEventListener("mousemove", function(e){
    if (!active){return }
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

    // diagonale alignement => 2 possibilities (y=x ou y=-x)
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


document.addEventListener("mouseup", function(e){
    if (!active){return }
    currentpawn.elt.style.transform = `translate3d(${0}px,${0}px, 0)`
    for (anEntry of currentpawn.container.legalEntries){
        if (isInside(anEntry.elt, e.clientX, e.clientY)){
            if (!anEntry.filled){
                anEntry.elt.appendChild(currentpawn.elt)
                anEntry.filled = true
                anEntry.filledPawn = currentpawn
                currentpawn.container.filled = false
                currentpawn.container = anEntry
                currentpawn.status = "inside"
                
                if (turn>=5){
                    if (turn%2 != 0){
                        if (isAlign(a1,a2,a3)){
                            mode = "Ended"
                            Winner = "PLAYER 1"
                            console.log(Winner+"Win")
                        }
                    }else{
                        if (isAlign(b1,b2,b3)){
                            mode = "Ended"
                            Winner = "PLAYER 2"
                            console.log(Winner+"Win")
                        }
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
    currentpawn = null

    if (turn > 6){ 
        mode = "normal" // all pawn are inside the board.
    }

    
})