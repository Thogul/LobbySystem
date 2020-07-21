import React from "react"
import Button from '@material-ui/core/Button';

import Network from '../network'

export default class Lobby extends React.Component{
    
    state = {
        host: undefined,
        socket: undefined
    }

    /*constructor(){
        super();
    }*/

    render(){
        return(
            <div>
            <header>
                <h1>Welcome to lobby creator</h1>
            </header>

            <br/>
            <b>Lobby code</b>
            <input id="lobby-input" type="text"/>

            <br/>
            <b>Your name</b>
            <input id="name-input" type="text"/>

            <br/>
            <Button 
                variant="contained"
                color="primary" 
                onClick={() => Network.create_lobby("test_name")}>
                    Create New Lobby
            </Button>
            <br/>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => Network.join_lobby("test_name", "test_name2")}>
                    Join Lobby
            </Button>
    
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
            <script src="src/script.js"></script>
            </div>
        )
    }
}