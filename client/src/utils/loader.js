import Network from './network';
import Animation from './animation'

export default class Loader {

    static prefix = Network.hostURL;
    static loaded = false;

    // A url to fetch the image, and a key to get the image once loaded
    static imageURLs = [
        ["testImage", "/src/assets/img/test.png"],
    ];
    // Map to Image objects from the keys in the imageURLs list
    static images = new Map();

    // Maps an animation key to an animation template (imageKey, frameWidth, frameHeight, msPerStep, onFinish=undefined, loop=true)
    static animationTemplates = new Map([
        ['testAnimation', {imageKey: 'testImage', frameWidth: 25, frameHeight: 25, msPerStep: 60, onFinish: undefined, loop: true}]
    ]);

    /**
    * @param {String} key 
    */
    static getImage(key){
        if(!this.loaded) console.error("Images not loaded");
        if(!this.images.get(key)) console.error("The image " + key + " is not loaded");
        return this.images.get(key);
    }

    static async loadImages(callback = null) {
        if (this.loaded) return;

        let promises = [];
        for (let i = 0; i < this.imageURLs.length; i++) {
            let key = this.imageURLs[i][0];
            let url = this.prefix + this.imageURLs[i][1];
            promises.push(this.loadImage(key, url));
        }
        await Promise.all(promises);
        this.loaded = true;
        if(typeof(callback) === "function") callback();
    }

    /**
     * @param {String} key 
     * @param {String} url 
     */
    static loadImage(key, url) {
        return new Promise(resolve => {
            const image = new Image();

            const onLoaded = (event) => {
                console.log("Loaded: " + url);
                this.images.set(key, image);
                image.removeEventListener("load", onLoaded);
                image.removeEventListener("error", onError);
                resolve(true);
            }

            const onError = (event) => {
                console.error("Failed to load: " + url)
                image.removeEventListener("load", onLoaded);
                image.removeEventListener("error", onError);
                resolve(false);
            }

            image.addEventListener("load", onLoaded);
            image.addEventListener("error", onError);
            image.src = url;
        })
    }

    /**
     * @param {String} key 
     */
    static getAnimationObject(key){
        const template = this.animationTemplates.get(key);
        if(!template){
            console.error("Animation-template \"" + key + "\" does not exist");
            return;
        }
        const img = this.getImage(template.imageKey)
        return new Animation(img, template.frameWidth, template.frameHeight, template.msPerStep, template.onFinish, template.loop)
    }

}