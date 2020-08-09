export default class renderer{

    constructor(ctx, width, height){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    fillRect(x, y, w, h, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h, color);
    }

    drawImage(img, x, y){
        this.ctx.drawImage(img, x, y);
    }

    // Draws a sub image at (x, y) clipping from (clipx, clipy) with dimentions (clipw, cliph). The image is not scaled or stretched
    drawSubImage(img, x, y, clipx, clipy, clipw, cliph){
        this.ctx.drawImage(img, clipx, clipy, clipw, cliph, x, y, clipw, cliph);
    }

    // Draws the current frame of an animation at (x, y)
    drawAnimation(x, y, animation){
        const spriteSheet = animation.spriteSheet;
        const clipx = animation.currentFrame * animation.frameWidth;
        const clipy = 0;
        const clipw = animation.frameWidth;
        const cliph = animation.frameHeight;
        this.drawSubImage(spriteSheet, x, y, clipx, clipy, clipw, cliph);
    }

    // 
    drawString(str, x, y){
        this.ctx.fillStyle = "#ffffff"
        this.ctx.font = "30px Roboto";
        this.ctx.fillText(str, x, y);
    }
    
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}