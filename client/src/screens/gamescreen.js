import React from 'react'

import '../styles/gamescreen.css'
import Renderer from '../utils/renderer'
import Loader from '../utils/loader';

export default class GameScreen extends React.Component{

    constructor(props){
        super(props);

        this.canvasRef = React.createRef();
        const activateCanvas = (ref) => {
            const ctx = ref.getContext('2d');
            this.renderer = new Renderer(ctx, 1200, 900);
        }

        // pixel-width and pixel-height must match the aspect ratio of the grid template in gamescreen.css
        this.canvasElement = (<canvas width={1200} height={900} ref={e => activateCanvas(e)}> </canvas>);

        this.onAnimationFrame = this.onAnimationFrame.bind(this);
    }
    
    componentDidMount(){
        // Load all images and resources
        Loader.loadImages(() => {
            
            this.testAnimation0 = Loader.getAnimationObject('testAnimation');
            this.testAnimation0.play();
            this.testAnimation1 = Loader.getAnimationObject('testAnimation');
            this.testAnimation1.play();
            this.testAnimation2 = Loader.getAnimationObject('testAnimation');
            this.testAnimation2.play();

            // Initiate the render loop by requesting the first animation frame
            window.requestAnimationFrame(this.onAnimationFrame);
        })
    }

    render(){
        return(
            <div className="game-screen-container">
               {this.canvasElement}
               <div className="upper-right-menu"> <h1> This is a menu component </h1> </div>
               <div className="lower-right-menu"> <h1> This is another menu component </h1></div>
               <div className="left-menu"> <h1> This is the left menu component </h1></div>
            </div>
        )
    }

    onAnimationFrame(){
        // Request the next animation frame to create the render loop
        window.requestAnimationFrame(this.onAnimationFrame)
        this.renderer.clearCanvas()

        //Render Background
        this.renderer.fillRect(0, 0, this.renderer.width, this.renderer.height, "#ff00ff");
        if(Loader.loaded){
            this.renderer.drawAnimation(0, 0, this.testAnimation0);
            this.renderer.drawAnimation(30, 0, this.testAnimation1);
            this.renderer.drawAnimation(60, 0, this.testAnimation2);
        }

        this.renderer.drawString("This is the drawing canvas", 100, 100);
    }
}