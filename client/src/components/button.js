import React from 'react'

export default class Button extends React.Component{

    constructor(props){
        super(props)

        this.text = props.text;
        this.onClick = props.onClick;
    }

    render(){
        return(
            <div className="button" onClick={this.onClick}>
                {this.text}
            </div>
        )
    }

}