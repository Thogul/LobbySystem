import React from "react"

import Network from '../network'
import './styles/lobby.css'

export default class Lobby extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            name: '',
            lobby_code: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // Handles change event in the form, it is only made to handle type=text
    handleChange(event){
        const target = event.target
        const name = target.name
        const value = target.value
        
        this.setState({[name]: value})
    }

    // Handles what happens when form is submited
    handleSubmit(event){
        const target = event.target
        const name = target.name

        if(name === "create_new_lobby"){
            if(this.validate_name()){
                Network.create_lobby(this.state.name)
                console.log(this.state.name)
            }
        }
        else if (name === "join_lobby"){
            if(this.validate_name() && this.validate_lobby_code()){
                Network.join_lobby(this.state.name, this.state.lobby_code)
                console.log(this.state.name)
            }
        }
        // Stops form from beeing submitted as default
        event.preventDefault()
    }

    validate_name(){
        return true
    }

    validate_lobby_code(){
        return true
    }

    render(){
        return(
            <div className="login-form">
                <form onSubmit={this.handleSubmit}>
                    <label> <b>Name:</b>
                        <input 
                            type="text" 
                            name="name" 
                            value={this.state.name} 
                            onChange={this.handleChange} 
                            placeholder="TumbleweedMaster..." 
                            autoFocus
                        />
                    </label>
                    <br/>
                    <label> <b>Lobby Code:</b>
                        <input 
                            type="text" 
                            name="lobby_code" 
                            value={this.state.lobby_code} 
                            onChange={this.handleChange} 
                            maxLength="5" 
                            placeholder="DJLQP"
                        />
                    </label>

                    <input type="submit" name="create_new_lobby" value="Create New Lobby"/>
                    <input type="submit" name="join_lobby" value="Join Lobby"/>
                </form>

            <br/>
            {/*<Button 
                variant="contained"
                color="primary" 
                onClick={() => Network.create_lobby("test_name")}>
                    Create New Lobby
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => Network.join_lobby("test_name", "test_name2")}>
                    Join Lobby
            </Button>*/}
            </div>
        )
    }
}