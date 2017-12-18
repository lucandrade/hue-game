import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Square from './Square';

class Board extends Component {
    handleChange(from, to) {
        const result = Array.from(this.props.colors);
        result[to] = this.props.colors[from];
        result[from] = this.props.colors[to];
        this.props.onChange(result);
    }

    render() {
        const { colors, columns, disabled, debugMode } = this.props;


        const parts =Array(Math.ceil(colors.length/columns)).fill().map(function(_,i){
            return colors.slice(i*columns,i*columns+columns);
        });

        const lines = parts.map((colors, l) => {
            return (
                <div className="line" key={l} onDoubleClick={this.props.onToggleDebugMode}>
                    {colors.map((color, i) => {
                        return (
                            <Square
                                moveColor={this.handleChange.bind(this)}
                                key={i}
                                disabled={disabled}
                                debugMode={debugMode}
                                {...color}
                                id={i+(l*columns)} />
                        );
                    })}
                </div>
            );
        });

        return (
            <div className="board">
                {lines}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);