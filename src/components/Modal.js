import React, { Component } from 'react';
import ReactModal from 'react-modal';
import ModalCloseButton from './ModalCloseButton';

ReactModal.setAppElement('#root');

export default class Modal extends Component {
    render() {
        const { opened, onClose, size = '' } = this.props;
        return (
            <ReactModal
                isOpen={opened}
                closeTimeoutMS={200}
                contentLabel="Minimal Modal Example"
                className={`modal ${size}`}
                overlayClassName="overlay"
                shouldCloseOnOverlayClick={true}>
                <ModalCloseButton onClick={onClose} />
                {this.props.children}
            </ReactModal>
        );
    }
}