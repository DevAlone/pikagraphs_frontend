import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import StoryContentBlock from "./StoryContentBlock";
import Button from "@material-ui/core/Button";
import StoryVersionModalWindow from "./StoryVersionModalWindow";

const styles = () => ({
    placeholder: {
        height: 20,
    },
    previewWrapper: {
        position: "relative",
        maxHeight: 350,
        overflow: "hidden",
        textAlign: "center",
        margin: "auto",
        width: "100%",
        zIndex: 0,

        "& *": {
            width: "auto",
            textAlign: "center",
            maxHeight: 350,
        },

        "& iframe": {
            width: "100%",
        },
    },
    readMore: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        maxHeight: 350,
        zIndex: 1,
        background: "linear-gradient(0deg, " +
            "rgba(255,255,255,1) 0%, " +
            "rgba(255,255,255,1) 15%, " +
            "rgba(255,255,255,0) 75%, " +
            "rgba(255,255,255,0) 100%)",
    },
    readMoreButton: {
        position: "absolute",
        height: "50%",
        bottom: 0,
        left: 0,
        width: "100%",
        "& button": {
            height: "100%",
            width: "100%",
        }
    },
    storyContentBlockWrapper: {
        marginBottom: 15,
    },
});

class StoryContentBlocks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        const isPreview = this.props.isPreview;

        if (isPreview) {
            return <div className={classes.previewWrapper}>
                {/*{this.renderItems(this.props.data.slice(0, 1))}*/}
                {this.renderItems(this.props.data)}
                <div className={classes.readMore}>
                    <div className={classes.readMoreButton}>
                        <StoryVersionModalWindow data={this.props.data} buttonTitle={"Читать дальше"}/>,
                    </div>
                </div>
            </div>;
        } else {
            return [
                this.renderItems(this.props.data),
                <div className={classes.placeholder}>

                </div>,
            ];
        }
    }

    renderItems(items) {
        const {classes} = this.props;
        return [items.map(block => {
            return (<div className={classes.storyContentBlockWrapper}>
                <StoryContentBlock type={block.type} data={block.data} isPreview={this.props.isPreview}/>
            </div>);
        })];
    }
}

export default withStyles(styles)(StoryContentBlocks);
