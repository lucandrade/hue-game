import React, { Component } from 'react';

export default class ModalCloseButton extends Component {
    render() {
        return (
            <a className="close" onClick={this.props.onClick}>
                <svg width="40" height="40" data-reactid=".1.1.0.0.0">
                    <circle cx="20" cy="20" r="20" fill="black" data-reactid=".1.1.0.0.0.0" />
                    <g transform="rotate(45 20 20)" data-reactid=".1.1.0.0.0.1">
                        <rect x="8" y="19.25" width="24" height="1.5" fill="white" data-reactid=".1.1.0.0.0.1.0" />
                        <rect y="8" x="19.25" height="24" width="1.5" fill="white" data-reactid=".1.1.0.0.0.1.1"></rect>
                    </g>
                </svg>
            </a>
        );
    }
}