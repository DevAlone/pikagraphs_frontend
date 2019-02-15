import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {BrowserRouter, Link, Route} from "react-router-dom";
import Home from "./Home";
import Users from "./Users";
import User from "./User";
import {Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Background from './assets/img/white_pattern.png';
import SidebarBackground from './assets/img/blue_pattern.gif';
import Favicon from './assets/img/favicon.ico';
import Icon from "@material-ui/core/Icon";
import About from "./About";
import Donate from "./Donate";
import Communities from "./Communities";
import Community from "./Community";
import BoringGraphs from "./BoringGraphs";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
        backgroundImage: `url(${Background})`,
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundImage: `url(${SidebarBackground})`,
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320,
    },
    h5: {
        marginBottom: theme.spacing.unit * 2,
    },
    sidebarIcon: {
        height: "25px",
    },
});

const alertOptions = {
    position: "bottom right",
    timeout: 2500,
    offset: '30px',
    transition: 'scale',
};


class App extends React.Component {
    state = {
        open: true,
    };

    handleDrawerSwitch = () => {
        this.setState(prevState => {
            return {open: !prevState.open};
        });
    };

    render() {
        const {classes} = this.props;

        const mainMenuItems = (
            <div>
                <ListItem button component={Link} to={"/"}>
                    <ListItemIcon>
                        <Icon>
                            <img className={classes.sidebarIcon} src={Favicon} alt={""}/>
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Главная"/>
                </ListItem>

                <ListItem button component={Link} to={"/users"}>
                    <ListItemIcon>
                        <PeopleIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Пользователи"/>
                </ListItem>

                <ListItem button component={Link} to={"/communities"}>
                    <ListItemIcon>
                        <BarChartIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Сообщества"/>
                </ListItem>

                <ListItem button component={Link} to={"/about"}>
                    <ListItemIcon>
                        <Icon>
                            contact_support
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="О проекте"/>
                </ListItem>

                <ListItem button component={Link} to={"/donate"}>
                    <ListItemIcon>
                        <Icon>
                            euro_symbol
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Поддержать проект"/>
                </ListItem>

                <Divider/>

                <ListItem button component={Link} to={"/boring"}>
                    <ListItemIcon>
                        <Icon>
                            storage
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Скучные графики"/>
                </ListItem>
            </div>
        );

        return (
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <BrowserRouter>
                    <div className={classes.root}>
                        <CssBaseline/>

                        {/* sidebar */}
                        <Drawer
                            variant="permanent"
                            className={"sidebar"}
                            classes={{
                                paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                            }}
                            open={this.state.open}
                        >
                            <div className={classes.toolbarIcon}>
                                <IconButton onClick={this.handleDrawerSwitch}>
                                    {
                                        this.state.open ?
                                            <ChevronLeftIcon/>
                                            : <ChevronRightIcon/>
                                    }
                                </IconButton>
                            </div>
                            <Divider/>
                            <List>{mainMenuItems}</List>
                            <Divider/>
                        </Drawer>
                        <main id="appContent" className={classes.content}>
                            <Route exact path={"/"} component={Home}/>
                            <Route path={"/users"} component={Users}/>
                            <Route path={"/user/:id"} component={User}/>
                            <Route path={"/communities"} component={Communities}/>
                            <Route path={"/community/:id"} component={Community}/>
                            <Route path={"/about"} component={About}/>
                            <Route path={"/donate"} component={Donate}/>
                            <Route path={"/boring"} component={BoringGraphs}/>
                        </main>
                    </div>
                </BrowserRouter>
            </AlertProvider>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
