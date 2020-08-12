export default class Animation {

    /**
     * @param {Image} spriteSheet Image containing all the frames ordered horizontaly
     * @param {Number} frameWidth Width for each frame
     * @param {Number} frameHeight Height of each frame
     * @param {Number} msPerStep Number of milliseconds between each frame
     * @param {Function} onFinish Call back when animation finishes, calls multiple times if looping
     * @param {Boolean} loop If the animation should loop
     */
    constructor(spriteSheet, frameWidth, frameHeight, msPerStep, onFinish=undefined, loop=true){
        this.spriteSheet = spriteSheet
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.msPerStep = msPerStep;
        this.onFinish = onFinish; // Callback called when animation finishes a loop
        this.loop = loop;
        
        const imgWidth = this.spriteSheet.width;
        //const imgHeight = this.spriteSheet.height;
        
        this.currentFrame = 0;
        this.frames = Math.floor(imgWidth / frameWidth);
    }

    // Starts the animation
    play(){
        if(!this.interval){
            this.currentFrame = 0
            this.interval = setInterval(() => {
                // Increments the current frame, exit if not looping and call onFinish
                this.currentFrame = (this.currentFrame + 1) % this.frames;
                // On animation loop restart
                if(this.currentFrame === 0){
                    if(typeof(this.onFinish) == "function"){
                        this.onFinish();
                    }
                    if(!this.loop){
                        this.stop();
                    }
                } 
            }, this.msPerStep);
        }
    }

    // Stops and resets the animation
    stop(){
        clearInterval(this.interval);
        this.interval = undefined;
        this.currentFrame = 0
    }

}