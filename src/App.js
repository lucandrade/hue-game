import React, { Component } from 'react';
import Chroma from 'chroma-js';
import InvertColor from 'invert-color';

import Board from './components/Board';
import Modal from './components/Modal';
import Win from './components/Messages/Win';
import './styles/index.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            changes: null,
            rows: 4,
            columns: 4,
            disabled: true,
            message: 'win'
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

        if ((prevState.changes === null || prevState.change > this.state.changes) && this.state.changes === 0) {
            setTimeout(() => {
                me.setState({
                    colors: me.sortColors(me.state.colors),
                    disabled: false
                });
            }, 2000);
        }
    }

    getBlendedColor(firstColor, secondColor) {
        return Chroma.blend(firstColor, secondColor, 'multiply').rgb();
    }

    setColorsFixed(colors, colorsFixedAmount = 4) {
        let fixedPositions = [];
        let randomPosition;

        while (fixedPositions.length < colorsFixedAmount) {
            randomPosition = Math.floor(Math.random() * (colors.length-1 + 1));

            if (colors[randomPosition].fixed !== true) {
                colors[randomPosition].fixed = true;
                fixedPositions.push(randomPosition);
            }
        }

        return colors;
    }

    sortColors(colors) {
        const sortedColors = Array.from(colors).sort(() => 0.5 - Math.random());
        const fixedColors = sortedColors.filter((c, i) => {
            if (c.fixed === true) {
                c.currentPosition = i;
            }

            return c.fixed === true;
        });
        let fixedColor, tempColor;

        fixedColors.forEach(c => {
            tempColor = sortedColors[c.rightPosition];
            fixedColor = sortedColors[c.currentPosition];
            sortedColors.splice(c.currentPosition, 1, tempColor);
            sortedColors.splice(c.rightPosition, 1, fixedColor);
        });

        return sortedColors;
    }

    prepareColors(colors) {
        return this.setColorsFixed(colors);
    }

    getRandomColors() {
        const colors = [
            Chroma.random().hex(),
            Chroma.random().hex()
        ];

        const lastColor = InvertColor.asRgbArray(colors[0], true);
        // Inverte a ultima cor par ficar mais facil
        colors.push(lastColor);

        return colors;
    }

    getBoardColors(rows, columns) {
        const randomColors = this.getRandomColors();
        const rowsColors = Chroma.scale([randomColors[0], randomColors[1]])
            .mode('lab')
            .colors(rows+1, 'rgb');
        const columnsColors = Chroma.scale([randomColors[0], randomColors[2]])
            .mode('lab')
            .colors(columns+1, 'rgb');
        let end, data;
        const colors = [];

        for (let r = 0; r < rowsColors.length-1; r++) {
            for (let c = 0; c < columnsColors.length-1; c++) {
                end = this.getBlendedColor(columnsColors[c], rowsColors[r+1]);
                data = {
                    horizontal: {
                        start: `rgba(${columnsColors[c].join(", ")}, .5)`,
                        end: `rgba(${columnsColors[c+1].join(", ")}, .5)`
                    },
                    vertical: {
                        start: `rgba(${rowsColors[r].join(", ")}, .5)`,
                        end: `rgba(${end.join(", ")}, .5)`
                    },
                    rightPosition: colors.length
                };
                colors.push(data);
            }
        }

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
            const me = this;

            setTimeout(() => {
                me.setState({message: 'win'});
            }, 200);
        }
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
                    disabled={this.state.disabled}
                    rows={this.state.rows}
                    columns={this.state.columns}
                    colors={this.state.colors}
                    onChange={this.handleReorderColors.bind(this)}
                    onNew={this.handleCreateGame.bind(this)} />
                {this.renderMessage()}
            </div>
        );
    }
}

export default App;