//Get the canvas
const canvas = document.getElementById('canv')
const scoreElem = document.getElementById('score')

//Get the drawing context of the canvas
const ctx = canvas.getContext('2d')

//The model for a bullet particle
class Bullet {
    constructor(y){
        this.x = 20
        this.y = y
        // console.log(`Created particle at (${this.x},${this.y})`)
        this.width = 1;
        this.height = 1;
    }

    /*
        Function updates the position of the particle based on the t
        usin Math.cos


    */
    update(t){
        // this.y = Math.sin(t/2) 
        this.y = this.y + 2 * Math.cos(t / 2);
        if(this.x < canvas.width){
            this.x += 5
        }else{
            // this.x = 0
        }
    }
}

//Model for a star particle
class Star {
    constructor(x,y){
        this.x = x
        this.y = y
        this.speed = Math.random() * 2 + 0.03
        this.width = Math.random() * 0.5 + 0.5
        this.height = Math.random() * 0.5 + 0.5
    }

    update(){
        this.y = this.y
        this.x -= this.speed
    }
}


//Model for an enemy ship
class Enemy {
    constructor(x,y){
        this.x = x
        this.y = y
        this.speed = 1
        this.lastTime = null
    }

    update(t){
        console.log("Last t: " + this.lastTime)
        if(this.lastTime > (360/2)){
            this.x -= 0.1
        }
        
        this.lastTime = t

        this.y = ((canvas.height / 4) * Math.cos(t / 50))  + canvas.height / 2
    }
}


class Tracer {
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 1
        this.height = 1
    }

    update(){
        if(this.width > 0){
            this.width -= .003
        }
        if(this.height > 0){
            this.height -= .003
        }
    }
}


/*
    Let's create a self animating sine wave first
*/
//IIFE - Immediately Invoked Function Expression
(()=>{
    //Storage for particles
    let particles = []
    let tracers = []
    let stars = []
    let enemies = []
    let score = 0
    enemies.push(new Enemy(canvas.width,canvas.height / 2))

    //loop state
    let loopPaused = false


    let t = 0
    //FX update loop
    function effectsLoop(){
        // console.log("Loop is running")

        //Clear the canvas
        ctx.clearRect(0,0,canvas.width, canvas.height)
        
        //Draw enemies
        enemies.forEach(enemy=>{
            ctx.fillStyle = '#F7DD0A'
            ctx.beginPath()
            ctx.moveTo(enemy.x,enemy.y)
            ctx.lineTo(enemy.x,enemy.y + 5)
            ctx.lineTo(enemy.x - 10, enemy.y)
            ctx.lineTo(enemy.x, enemy.y - 5)
            ctx.closePath()
            ctx.fill()
            enemy.update(t)
        })

        //Draw starfield
        //Add a few more stars
        if(stars.length < 1000){ //If there are less than 1000 stars add some more
            for(let i = 0; i < Math.random() * 10; i++){
                let randomY = Math.random() * canvas.width
                let newStar = new Star(canvas.width,randomY) //Create a new star with a random x position and a 0 y position: ;
                stars.push(newStar)
            }
        }

        //Update existing stars
        stars.forEach(star=>{
            ctx.fillStyle = '#FFF'
            ctx.fillRect(star.x,star.y,star.width,star.height) //Draw the star with a random width and height: ;
            if(star.x <= 0){ //If the star goes beyond the bottom of the canvas
                stars.splice(stars.indexOf(star),1) //Remove it from the list
            }else{
                star.update() //Otherwise update it's postion
            }
        })


        //Draw particles
        particles.forEach(particle=>{ //Iterate through all particles
            ctx.fillStyle = '#F00' //Set the fill color to blue
            ctx.fillRect(particle.x,particle.y,particle.width, particle.height) //Fill in the particle
            if(particle.x < canvas.width){ //If the particle has not gone past the right side of the canvas
                //Add a tracer particle in it's current position
                tracers.push(new Tracer(particle.x,particle.y))
                //And update the particle's position based on the cos func
                particle.update(t)
            }else{ //Otherwise
                //Remove the particle from the particles array
                particles.splice(particles.indexOf(particle),1)
            }
        })

        //Draw tracers
        tracers.forEach(tracer=>{ //Iterate through all the tracer particles
            ctx.fillStyle = '#F00' //Set the fill color to a green
            ctx.fillRect(tracer.x,tracer.y,tracer.width, tracer.height) //Fill in the tracer 
            if(tracer.width <= 0 || tracer.height <= 0){ //If the tracer has become too small
                tracers.splice(tracers.indexOf(tracer),1) //Get rid of it
            }else{ //Otherwise
                //Update it
                tracer.update()
            }
        })

        //Draw the particle "gun"
        ctx.fillStyle = '#FFF'
        ctx.beginPath()
        ctx.moveTo(10,currentY - 10)
        ctx.lineTo(20,currentY)
        ctx.lineTo(10,currentY + 10)
        ctx.closePath()
        ctx.fill()
        // ctx.fillRect(0,currentY - 10,20,20)


        //Check for particle and enemy collisions
        enemies.forEach(enemy=>{
            for(let i = 0; i < particles.length; i++){
                let currentParticle = particles[i]
                if(Math.abs(enemy.x - currentParticle.x) < 3 && Math.abs(enemy.y - currentParticle.y) < 3){ //If the particle and the enemy are touching
                    //Destroy both
                    enemies.splice(enemies.indexOf(enemy),1)
                    particles.splice(particles.indexOf(currentParticle),1)
                    ++score;
                    scoreElem.innerText = `Score : ${score}`  //Update the score
                    enemies.push(new Enemy(canvas.width,canvas.height / 2)) //Create a new enemy
                }
            }
        })



        //Update our clock
        if(t < canvas.width){
            t++;
        }else{
            t = 0
            // console.table(particles)
            // console.table(tracers)
        }

        if(!loopPaused){ //As long as the loop is not paused
            requestAnimationFrame(effectsLoop) //request another frame
        }else{ //Otherwise
            console.log("Loop is paused") //Well, tick tok
        }
    }

    //Start the cannon half way down the canvas
    let currentY = canvas.height / 2

    //Listen for keyboard input
    window.onkeydown = (e) => {
        switch(e.key){
            case 'Escape': //If the user presses the escape key
                gamePaused = true //pause the loop
                break
            case 'Enter': //If the use presses enter
                gamePaused = false //unpause the loop
                effectsLoop() // off you go
                break
            case ' ': //If the user presses the spacebar
                particles.push(new Bullet(currentY)) //shoot another particle
                break
            case 'q': //If the user presses que q key
                particles = [] //Reset the particles
                tracers = [] //And the tracers
                break
            case 'ArrowLeft': //Arrow up moves the gun up
                if(currentY > 10){
                    currentY -= 2
                }
                break
            case 'ArrowRight': //Arrow down moves the gun down
                if(currentY < canvas.height - 10){
                    currentY += 2
                }
                break
            default: //Blahhhh
                break
        }
    }

    //Start the effects loop
    effectsLoop()
})();