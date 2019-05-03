import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from "react-router-dom";

class PlayAgainModal extends React.Component {
  
  render() {
    return (
      <div>
        <Modal isOpen={this.props.playAgainModalIsOpen} toggle={()=>{this.props.toggleModal()}} className={this.props.className}>
          <ModalHeader  toggle={()=>{this.props.toggleModal()}}>Game Over</ModalHeader>
          <ModalBody>
            <p>Your score: {this.props.score}</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>{this.props.toggleModal();this.props.resetGame()}}>Play Again</Button>
            <Link color="secondary" to="/">Cancel</Link>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default PlayAgainModal;