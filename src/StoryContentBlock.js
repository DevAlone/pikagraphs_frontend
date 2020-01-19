import React, {Component} from 'react';
import SanitizedHTML from 'react-sanitized-html';
import withStyles from "@material-ui/core/styles/withStyles";
import Block from "./Block";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";

const styles = () => ({
    videoWrapper: {
        position: "relative",
        paddingBottom: "56.25%",
        paddingTop: "25px",
        height: 0,
    },
    videoIframe: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
    },
    // previewWrapper: {
    //     position: "relative",
    //     maxHeight: 350,
    //     overflow: "hidden",
    //     textAlign: "center",
    //     margin: "auto",
    //     width: "100%",
    //     zIndex: 0,
    //
    //     "& *": {
    //         width: "auto",
    //         textAlign: "center",
    //         maxHeight: 350,
    //     },
    //
    //     "& iframe": {
    //         width: "100%",
    //     },
    // },
});

class StoryContentBlock extends Component {
    render() {
        const {classes} = this.props;

        return this.renderItem();
    }

    renderItem() {
        const {classes} = this.props;
        const type = this.props.type;
        const data = this.props.data;

        switch (type) {
            case "t":
                return [
                    <Block><SanitizedHTML html={data}/></Block>,
                    this.props.isPreview ? null : (<ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                        >
                            <Typography>Показать HTML</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {data}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>),
                ];
                break;
            case "i":
                return <img className={classes.image} src={data.large}/>;
                break;
            case "v":
                return (
                    <div className={classes.videoWrapper}>
                        <iframe
                            className={classes.videoIframe}
                            src={data.url}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                );
                break
            case "vf":
                return (
                    <video width={"100%"} controls>
                        <source src={data.mp4.url} type={"video/mp4"}/>
                        <source src={data.webm.url} type={"video/webm"}/>
                        Your browser does not support the video tag.
                    </video>
                );
                break
            default:
                return <pre>
                    Unknown type of block "{this.props.type}"
                    Content is:
                    {JSON.stringify(data, null, 2)}
                </pre>;
        }
    }
}

export default withStyles(styles)(StoryContentBlock);
