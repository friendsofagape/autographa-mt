import React, { Component } from 'react';
import {
    Grid,
    Typography,
    makeStyles,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import { withStyles } from '@material-ui/styles';

const styles = makeStyles(theme => ({
  homePage: {
      marginTop: '85px',
      width: '100%',
      margin:0
  },
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  subheader: {
    fontWeight: "bold",
  }
}));

class HomePage extends Component {
    state = {}
    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/dashboard' />
        }
        const { classes } = this.props
        return (
          <Grid container style={{"backgroundColor":"black"}}>
            <Header />
            
            <Grid container spacing={2} >
              
              <Grid item xs={12}className={classes.homePage} >
                <Card className={classes.card} style={{marginTop: '80px', "backgroundColor":"#ededed", marginLeft:'10px', marginRight:'10px'}}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Autographa Machine Translation Version 2.0
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                      AutographaMT is a web-based application that aims to support automatic translation of the Bible into languages that have no available digital text. Autographa MT supports machine translation of source text by reducing effort of human translators. 
                      </Typography>
                    </CardContent>
                </Card>
              </Grid>


              <Grid item xs={6}>
                <Card className={classes.card} style={{"backgroundColor":"#ededed", marginLeft:'10px'}}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Workflow
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        AgMT employs a simple strategy that is able to achieve reasonable success with little human translation effort. The process that is followed to achieve this is: 
                      </Typography>
                      <List component="nav" aria-label="main mailbox folders">
                        <ListItem>
                          <ListItemText>
                          <span style={{ fontWeight: 'bold'}} >Identification/Initialization:</span> A suitable source language (usually a gateway language) in which a Bible translation already exists and available is selected. Ideally, the selected source language would have similar syntactic structure with the target language. This is then uploaded into the system.
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            <span style={{ fontWeight: 'bold'}} >Extraction:</span> All the unique occurrences of tokens (and phrases) are extracted and listed. This includes inflected forms of words. 
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            <span style={{ fontWeight: 'bold'}} >Human Translation:</span> A qualified translation team then translates all the tokens extracted and uploads back into the system. 
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            <span style={{ fontWeight: 'bold'}} >Machine Generation:</span> The system then generates a draft translation (called draft 0) of the source text by way of simple replacements. 
                          </ListItemText>
                        </ListItem>
                      </List>
                      <Typography variant="body2" color="textSecondary" component="p">
                        All these steps are facilitated within AutographaMT.                        
                      </Typography>
                    </CardContent>
                </Card>
              </Grid>


              <Grid item xs={6}>
                <Card className={classes.card} style={{"backgroundColor":"#ededed", marginRight:'10px'}}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Features
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        User authentication and role management
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Unique token and phrase extraction logic
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Translation input interface
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Just-in-time resources: concordance, translationWords, translationNotes, Greek/Hebrew word information
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Basic translation progress status
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Ability to save multiple sense for the same token/phrase
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        One-click generation of draft translation in target language
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="li">
                        Free and open-source
                      </Typography>
                    </CardContent>
                </Card>
              </Grid>

              
              <Grid item xs={12}>
                <Card className={classes.card} style={{"backgroundColor":"#ededed", marginLeft:'10px', marginRight:'10px'}}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        FAQ
                      </Typography>
                      <Accordion style={{"backgroundColor":"#ededed"}}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className={classes.heading}>Who built AutographaMT? </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            AutographaMT is built by a team of developers in India and funded by <code>Friends of Agape</code>. The work started in 2017 and the original version was called <a href='https://github.com/friendsofagape/mt2414' >MT2414</a>. The application has since been re-written for improving usability and better maintainability and the client application lives in this repository. Currently there are 4 full-time developers and 1 part-time developer who works on this project focussing on different aspects of the system.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion style={{"backgroundColor":"#ededed"}}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography className={classes.heading}>What has been achieved using AutographaMT?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            The application was successfully used to generate the starting drafts for the onging translation of 12 Old Testament translation projects.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion style={{"backgroundColor":"#ededed"}}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel3a-content"
                          id="panel3a-header"
                        >
                          <Typography className={classes.heading}>Can I use AutographaMT? </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            Everyone is encouraged to use AutographaMT. In fact, the application is designed to handle multiple organizations and individuals to be able to work simultaneously. To start simply sign-up at autographamt.com. The (quick) initial step is to create and setup your organization on the website. If you have any questions, please do not hesitate to create an issue or mail us at <a href='mailto:autographa.support@bridgeconn.com' >autographa.support@bridgeconn.com</a>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                    </CardContent>
                </Card>
              </Grid>
              
            </Grid>
          </Grid>
        )
    }
}


export default withStyles(styles)(HomePage);