const canvas = document.querySelector("canvas")

canvas.width = innerWidth
canvas.height = innerHeight

const app = canvas.getContext("2d")

const mouse = {
    x : undefined,
    y : undefined
}

addEventListener("resize",()=>{
    canvas.width = innerWidth
    canvas.height = innerHeight
})
addEventListener("mousemove",(event)=>{
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener("click",()=>{
    init();
})

function distanc(x2,y2,x1,y1){
    const xDistance = x2 -x1
    const yDistance = y2 - y1
    return Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2))
}
// angle rotated

function rotate(velocity,angle){
    const rotatedVelocities = {
        x:velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y:velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    }
    return rotatedVelocities
}

function resolveCollison(one,two){
    const Xvelocity = one.velocity.x - two.velocity.x;
    const Yvelocity = one.velocity.y - two.velocity.y;

    const xDistance = two.x - one.x;
    const YDistance = two.y - one.y;

    if(Xvelocity * xDistance + Yvelocity * YDistance >= 0){
        const angle = -Math.atan2(two.y - one.y,two.x - one.x);
        const m1 = one.mass
        const m2 = two.mass


        const u1 = rotate(one.velocity,angle)
        const u2 = rotate(two.velocity,angle)

        const v1 = {x:(u1.x * (m1-m2)/(m1+m2) )+ (u2.x * 2 *m2 /(m1+m2)),y:u1.y};
        const v2 = {x:(u2.x * (m1-m2)/(m1+m2) )+( u1.x * 2 *m2 /(m1+m2)),y:u2.y};

        const vFinal = rotate(v1,-angle)
        const vFinal2 = rotate(v2,-angle)

        one.velocity.x = vFinal.x;
        one.velocity.y = vFinal.y;

        two.velocity.x = vFinal2.x;
        two.velocity.y = vFinal2.y;

    }
}


function Ball(x,y,radius,color){
    this.x = x
    this.y = y
    this.velocity = {
        x:(Math.random() - 0.5) * 5 ,
        y:(Math.random() - 0.5) * 5
    }
    this.radius = radius
    this.color = color
    this.mass =1;

    this.draw = function(){
        app.beginPath();
        app.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        // app.strokeStyle = this.color
        app.save()
        // app.globalAlpha = 0.2
        
        app.restore();
        app.fill()
        app.fillStyle = this.color
        app.closePath();
    }

    this.anime = function(ballsArray){
        for(let i = 0 ; i <ballsArray.length; i++){
            if(this === ballsArray[i]) continue;
            if(distanc(this.x,this.y,ballsArray[i].x,ballsArray[i].y) - this.radius*2 < 0){
                resolveCollison(this,ballsArray[i])
            }
        }
        if(this.x + this.radius >= innerWidth || 
            this.x - this.radius <= 0){
            this.velocity.x = -this.velocity.x
        }
        if(this.y + this.radius >= innerHeight || 
            this.y - this.radius <= 0){
            this.velocity.y = - this.velocity.y
        }
        if(distanc(mouse.x,mouse.y,this.x,this.y) < 50){
            // app.globalAlpha = 0.2;
            // app.clearRect(mouse.x,mouse.y)
            app.fillStyle = "gold"

        }
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.draw()
    }
}

let ballsArray ;
const colors = [
    "red",
    "green",
    "grey",
    "blue",
    "pink",
    "black"
]
function init(){
    ballsArray = []
    for (let i =0; i<100;i++){
        const radius = 12
        let x = Math.random() * (innerWidth - radius * 2 )+ radius
        let y = Math.random() * (innerHeight  - radius * 2)  + radius      
        const color = colors[Math.floor(Math.random() * colors.length)]
        // `rgb(${Math.random()*255},${Math.random()*255}
        // ,${Math.random()*255})`
        if(i!==0){
            for(let j=0;j<ballsArray.length;j++){
                if(distanc(x,y,ballsArray[j].x,ballsArray[j].y) - radius *2 < 0){
                    x = Math.random() * (innerWidth - radius * 2) + radius
                    y = Math.random() * (innerHeight  - radius * 2)  + radius
                }
            }
        }
        ballsArray.push(new Ball(x,y,radius,color))
    }
}


// const ball = new Ball(innerWidth/2,innerHeight/2,70,"#ff00ff")
// const ball2 = new Ball(undefined,undefined,30,"#00ff00")

function animate(){
    app.clearRect(0,0,innerWidth,innerHeight)
    requestAnimationFrame(animate)
    // ball.anime()
    // ball2.x = mouse.x;
    // ball2.y = mouse.y;
    // ball2.anime()
    // if(distanc(ball.x,ball.y,ball2.x,ball2.y) < ball.radius + ball2.radius){
    //     ball.color = "#00ff00"
    // }else{
    //     ball.color = "#ff00ff"
    // }
    ballsArray.forEach(element => {
        element.anime(ballsArray)
    });
    app.fillStyle = "black"
    app.font = "20px roboto"
    app.fillText("Bairavaswamy",mouse.x,mouse.y)


}
init();
animate()