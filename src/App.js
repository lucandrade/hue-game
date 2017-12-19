import React, { Component } from 'react';
import Chroma from 'chroma-js';

import Board from './components/Board';
import Modal from './components/Modal';
import Win from './components/Messages/Win';
import GetRandomColors from './functions/GetRandomColors';
import './styles/index.scss';

/**
 * A dificuldade pode ser aumentada alterando a opacidade das cores do background
 * Quanto menor a distancia de opacidade entre o inicio e o fim da cor, mais dificil 
 */

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            changes: null,
            rows: 6,
            columns: 12,
            disabled: true,
            message: false,
            debugMode: false
        };
    }

    componentDidMount() {
        this.handleCreateGame();
    }

    componentDidUpdate(prevProps, prevState) {
        const me = this;

        if (prevState.changes < this.state.changes) {
            this.validateGame();
        }

        if (prevState.changes !== this.state.changes && this.state.changes === 0) {
            setTimeout(() => {
                me.setState({
                    colors: me.sortColors(me.state.colors),
                    disabled: false
                });
            }, 3000);
        }
    }

    getRandomPositions(colors) {
        return [0, this.state.columns-1, colors.length-this.state.columns, colors.length-1];
    }

    setColorsFixed(colors, colorsFixedAmount = 4) {
        let fixedPositions = [];
        const randomPositions = this.getRandomPositions(colors);

        randomPositions.forEach(p => {
            colors[p].fixed = true;
            fixedPositions.push(p);
        });

        return colors;
    }

    sortColors(colors) {
        const fixedColors = [];

        colors.forEach((c, i) => {
            if (c.fixed === true) {
                fixedColors.push(colors.splice(i, 1)[0]);
            }
        });

        const sortedColors = Array.from(colors).sort(() => 0.5 - Math.random());

        fixedColors
            .forEach(c => {
                sortedColors.splice(c.rightPosition, 0, c);
            });

        return sortedColors;
    }

    prepareColors(colors) {
        return this.setColorsFixed(colors);
    }

    getColors(rows, columns) {
        window.Chroma = Chroma;
        const randomColors = GetRandomColors();
        const firstColumn = Chroma.scale([randomColors[0], randomColors[1]])
            .mode('rgb')
            .colors(rows, 'hex');
        const secondColumn = Chroma.scale([randomColors[2], randomColors[3]])
            .mode('rgb')
            .colors(rows, 'hex');
        let colors = [];
        
        for(let i in firstColumn) {
            colors = colors.concat(Chroma.scale([firstColumn[i], secondColumn[i]])
                .mode('rgb')
                .colors(columns, 'hex'))
        }

        return colors;
    }

    getBoardColors(rows, columns) {
        const colors = this.getColors(rows, columns).map((c, i) => {
            return {
                rightPosition: i,
                color: c
            };
        });

        return this.prepareColors(colors);
    }

    validateGame() {
        const { colors } = this.state;
        const valid = colors.reduce((a, b, i) => {
            if (i !== b.rightPosition) {
                a = false;
            }

            return a;
        }, true);

        if (valid) {
            this.winGame();
        }
    }

    winGame() {
        const me = this;

        setTimeout(() => {
            me.setState({message: 'win'});
        }, 1000);
    }

    handleReorderColors(colors) {
        this.setState({colors, changes: this.state.changes+1});
    }

    handleCreateGame() {
        this.setState({
            colors: this.getBoardColors(this.state.rows, this.state.columns),
            changes: 0
        });
    }

    handleCloseMessage() {
        this.setState({message: false});
        this.handleCreateGame();
    }

    handleToggleDebugMode() {
        this.setState({debugMode: !this.state.debugMode});
    }

    getMessage(message) {
        switch (message) {
            case 'win':
                return (
                    <Win
                        onRestartGame={this.handleCloseMessage.bind(this)}
                        onGoHomeScreen={this.handleCloseMessage.bind(this)} />
                );
            default:
                return null;
        }
    }

    renderMessage() {
        const { message } = this.state;

        return (
            <Modal
                onClose={this.handleCloseMessage.bind(this)}
                opened={message.length > 0}
                size='small'>
                <Win
                    onRestartGame={this.handleCloseMessage.bind(this)}
                    onGoHomeScreen={this.handleCloseMessage.bind(this)} />
            </Modal>
        );
    }

    render() {
        return (
            <div className="app">
                <Board
                    debugMode={this.state.debugMode}
                    disabled={this.state.disabled}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    colors={this.state.colors}
                    onChange={this.handleReorderColors.bind(this)}
                    onToggleDebugMode={this.handleToggleDebugMode.bind(this)}
                    onNew={this.handleCreateGame.bind(this)} />
                {this.renderMessage()}
            </div>
        );
    }
}

export default App;