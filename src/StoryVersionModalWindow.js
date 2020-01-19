import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Block from "./Block";
import StoryContentBlocks from "./StoryContentBlocks";
import {withStyles} from "@material-ui/core";
import Background from "./assets/img/white_pattern.png";

// TODO: add button for closing

const styles = theme => ({
    modal: {
    },
    paper: {
        position: 'absolute',
        top: 0,
        left: "50px",
        right: "50px",
        bottom: 0,
        overflow: "auto",
        backgroundImage: `url(${Background})`,
        // backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: 0,
    },
});

class StoryVersionModalWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
        };
        this.buttonTitle = typeof this.props.buttonTitle === "undefined" ?
            "Показать версию" :
            this.props.buttonTitle;
    }

    setOpened = (value) => {
        this.setState({
            isOpened: value,
        })
    };

    render() {
        const {classes} = this.props;

        return [
            <Button onClick={() => {
                this.setOpened(true);
            }}>
                {this.buttonTitle}
            </Button>,
            <Modal
                className={classes.modal}
                open={this.state.isOpened}
                onClose={() => {
                    this.setOpened(false);
                }}
            >
                <div className={classes.paper}>
                    <StoryContentBlocks data={this.props.data}/>
                </div>
            </Modal>
        ];
    }
}

export default withStyles(styles)(StoryVersionModalWindow);
