import React from 'react'

import '../styles/gamescreen.css'
import Renderer from '../utils/renderer'
import Loader from '../utils/loader';
import TabMenu from '../components/tabMenu';

export default class GameScreen extends React.Component{

    constructor(props){
        super(props);

        this.canvasRef = React.createRef();
        const activateCanvas = (ref) => {
            const ctx = ref.getContext('2d');
            this.renderer = new Renderer(ctx, 1280, 720);
        }

        // pixel-width and pixel-height must match the aspect ratio of the grid template in gamescreen.css
        this.canvasElement = (<canvas width={1280} height={720} ref={e => activateCanvas(e)}> </canvas>);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
    }
    
    componentDidMount(){
        // Load all images and resources
        Loader.loadImages(() => {
            // Initiate the render loop by requesting the first animation frame

            this.testAnimation = Loader.getAnimationObject('testAnimation');
            this.testAnimation.play();

            window.requestAnimationFrame(this.onAnimationFrame);
        })
    }

    render(){
        return(
            <div className="game-screen-container">
               {this.canvasElement}
               <div className="upper-right-menu"> <h1> This is a menu component </h1> </div>
               <div className="lower-right-menu">  <TabMenu tabs={[
                   ["Inventory", <div> Inventory </div>],
                   ["Skills", <div> Skills </div>],
                   ["Stats", <div> Stats </div>],
               ]}/> </div>
               <div className="left-menu"> <h1> This is the left menu component </h1></div>
               <div className="bottom-menu"> <h1> This is the bottom menu </h1></div>
               <div className="top-menu"> <h1> This is the top menu </h1></div>
            </div>
        )
    }

    onAnimationFrame(){
        // Request the next animation frame to create the render loop
        window.requestAnimationFrame(this.onAnimationFrame);
        this.renderer.clearCanvas();

        //Render Background image
        this.renderer.drawStretchedImage(Loader.getImage('roomLayout'), 0, 0, 1280, 720);

        //Render test animation
        this.renderer.drawAnimation(200, 200, this.testAnimation)
    }
}