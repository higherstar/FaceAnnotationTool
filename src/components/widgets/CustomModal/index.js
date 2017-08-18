import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class CustomModal extends Component {  
   
    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.toggleModal}>
              <Modal.Header closeButton>
                <Modal.Title>{this.props.modalTextTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="userIngredients">{this.props.modalContent}</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                    bsStyle="danger"
                    onClick={this.props.toggleModal}>Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default CustomModal;