import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

class Square extends Component {
    constructor(props) {
        super(props);
        this.setContainerRef = (ref) => {
            this.container = ref;
            this.props.connectDropTarget(ref);
        }
    }

    render() {
        const {
            horizontal = {},
            vertical,
            connectDragSource,
            connectDropTarget,
            fixed = false
        } = this.props;
        const horizontalStyle  = `linear-gradient(to right, ${horizontal.start} 0%, ${horizontal.end} 100%)`;
        const verticalStyle  = `linear-gradient(to bottom, ${vertical.start} 0%, ${vertical.end} 100%)`;
        const style = {
            background: `${horizontalStyle}, ${verticalStyle}`
        };
        const classes = ['square'];

        if (fixed) {
            classes.push('fixed');
        }
        
        return connectDragSource(
            connectDropTarget(
                <div
                    ref={this.setContainerRef}
                    className={classes.join(' ')}
                    style={style}>
                    {this.props.rightPosition}
                </div>
            )
        );
    }
}

const instance = DropTarget(
    'Square',
    {
        drop(props, monitor, component) {
            if (monitor.didDrop()) {
                return;
            }

            const dragIndex = monitor.getItem().id;
            const hoverIndex = props.id;

            if (dragIndex === hoverIndex) {
                return;
            }

            props.moveColor(dragIndex, hoverIndex, monitor.getItem(), props);
        },
        canDrop(props, monitor) {
            return props.fixed !== true && props.disabled !== true;
        }
    },
    (connect, monitor) => {
        return {
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver()
        };
    }
)(Square);

export default DragSource(
    'Square',
    {
        beginDrag(props, monitor, component) {
            const element = findDOMNode(component);
            element.classList.add('dragging');
            return props;
        },
        endDrag(props, monitor, component) {
            const element = findDOMNode(component);
            element.classList.remove('dragging');

            if (!monitor.didDrop()) {
                return;
            }
        },
        canDrag(props) {
            return props.fixed !== true && props.disabled !== true;
        }
    },
    (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        }
    }
)(instance);