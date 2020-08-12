import React from 'react'

import '../styles/tabs.css'

export default class TabMenu extends React.Component {

    // To create a tab component use the prop tabs=[["tabname", <YourComponent/>], ["Another name", <AnotherComponent/>]]
    // There is currently no custom styling for this component
    constructor(props) {
        super(props);

        this.state = {
            selectedTabIndex: 0
        }
    }

    render() {
        return (
            <div className="tab-container">
                <div className="tabs-header">
                    {this.getTabButtons()}
                </div>
                <div>
                    {this.getDisplayedTab()}
                </div>
            </div>
        )
    }

    getDisplayedTab() {
        return this.props.tabs[this.state.selectedTabIndex][1];
    }

    getTabButtons() {
        const tabs = this.props.tabs
        const buttons = []

        for (let i = 0; i < tabs.length; i++) {
            const classname = this.state.selectedTabIndex === i ? "selected-tab-button" : "tab-button";
            const name = tabs[i][0];
            buttons[i] = <div className={classname} key={i} onClick={() => this.setState({ selectedTabIndex: i })}>{name}</div>;
        }

        return buttons;
    }
}