import React, { Component } from 'react';

export default class Win extends Component {
    render() {
        return (
            <div>
                <span className="heart" />
                <h2>
                    Congratulations
                    <br />
                    <small>
                        You Win!
                    </small>
                </h2>
                <div
                    className='button -blue center'
                    onClick={this.props.onRestartGame}>
                    Restart the game
                </div>
                <div
                    className='button -dark center'
                    onClick={this.props.onGoHomeScreen}>
                    Home Screen
                </div>
            </div>
        );
    }
}