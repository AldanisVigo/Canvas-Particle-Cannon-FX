//Get the canvas
const canvas = document.getElementById('canv')

//Get the drawing context of the canvas
const ctx = canvas.getContext('2d')

class Particle {
    constructor(y){
        this.x = 20
        this.y = y
        // console.log(`Created particle at (${this.x},${this.y})`)
        this.width = 1;
        this.height = 1;
    }

    update(t){
        // this.y = Math.sin(t/2) 
        this.y = this.y + 2 * Math.cos(t/5)
        if(this.x < canvas.width){
            this.x += 5
        }else{
            // this.x = 0
        }
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


    //loop state
    let loopPaused = false


    let t = 0
    //FX update loop
    function effectsLoop(){
        // console.log("Loop is running")

        //Clear the canvas
        ctx.clearRect(0,0,canvas.width, canvas.height)
        

        //Draw particles
        particles.forEach(particle=>{ //Iterate through all particles
            ctx.fillStyle = '#00F' //Set the fill color to blue
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
            ctx.fillStyle = '#0F0' //Set the fill color to a green
            ctx.fillRect(tracer.x,tracer.y,tracer.width, tracer.height) //Fill in the tracer 
            if(tracer.width <= 0 || tracer.height <= 0){ //If the tracer has become too small
                tracers.splice(tracers.indexOf(tracer),1) //Get rid of it
            }else{ //Otherwise
                //Update it
                tracer.update()
            }
        })

        //Draw the particle "gun"
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.moveTo(0,currentY - 10)
        ctx.lineTo(20,currentY)
        ctx.lineTo(0,currentY + 10)
        ctx.closePath()
        ctx.fill()
        // ctx.fillRect(0,currentY - 10,20,20)

        //Update our clock
        if(t <= 360){
            t++
        }else{
            t = 0
            // console.table(particles)
            // console.table(tracers)
        }
        
        

        if(!loopPaused){
            requestAnimationFrame(effectsLoop)
        }else{
            console.log("Loop is paused")
        }
    }

    let currentY = canvas.height / 2

    //Listen for keyboard input
    window.onkeydown = (e) => {
        // console.log(e)
        switch(e.key){
            case 'Escape':
                gamePaused = true
                break
            case 'Enter':
                gamePaused = false
                effectsLoop()
                break
            case ' ':
                particles.push(new Particle(currentY))
                break
            case 'q':
                particles = []
                tracers = []
                break
            case 'ArrowUp':
                if(currentY > 10){
                    currentY -= 2
                }
                break
            case 'ArrowDown':
                if(currentY < canvas.height - 10){
                    currentY += 2
                }
                break
            default:
                break
        }
    }

    //Start the effects loop
    effectsLoop()
})();