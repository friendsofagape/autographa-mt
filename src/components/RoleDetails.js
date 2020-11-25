import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import { Grid, Paper } from "@material-ui/core";


export default function RoleDetails() {
   

    function AvtarChange(){
        const userDetails = useSelector((state) => state.auth);
        const data = userDetails.current_user.role;
        if (data=="ad"){
            return (<Avatar alt="G" src="../images/admin.jpg" />)
        }else if(data=="m"){
            return <Avatar alt="G" src="../images/translator.png" />
        }else{
            return <Avatar alt="G" src="../images/superadmin.jpg" />
        }
       
    }


    function RoleId(){
        const userDetails = useSelector((state) => state.auth);
        const id = userDetails.current_user.role;
        if (id=="ad"){
            return (<Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"0%"}}>Admin</Grid>)
        }else if(id=="m"){
            return <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"0%"}}>Translator</Grid>
        }else{
            return <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"0%"}}>Super Admin</Grid>
        }
    }


    function RoleDetails(){
        const userDetails = useSelector((state) => state.auth);
        const id = userDetails.current_user.role;
        if (id=="ad"){
            return (<Typography variant="caption" style={{color:"#001e96"}}>
                        An admin can create project, assign books to translator etc.. sample content here. Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.
                    </Typography>)
        }else if(id=="m"){
            return <Typography variant="caption" style={{color:"#001e96"}}>
                        If there is no projects assigned to you wait for the admin or super admin assign a project.. sample content here. Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.
                   </Typography>
        }else{
            return <Typography variant="caption" style={{color:"#001e96"}}>
                    Have access to all the features of agmtv2. sample content here. Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.
                   </Typography>
        }
    }



    const userDetails = useSelector((state) => state.auth);
    const userName = userDetails.current_user.firstName + " " + userDetails.current_user.lastName;
    const emailId = userDetails.current_user.email;

  
    return (
    <div>
      <Paper elevation="4" style={{ marginRight: "15%", marginLeft: "15%", marginTop: "5%" }}>
        <Grid container>
                    <Grid item sm={12}> 
                        <Typography component="h4" variant="h5" style={{ textAlign: "center", padding:'3%'}}>
                            User Details
                        </Typography>
                    </Grid>
                    <Grid item sm={12} style={{ marginLeft:"45%"}}>
                        <AvtarChange />
                    </Grid>
            
                <Grid container style={{paddingTop:"4%"}}>
                    <Grid item sm={4} style={{ paddingLeft:"5%", paddingBottom:"0%", textAlign:"right"}}>
                        <Typography component="h4" variant="h7">
                           Name
                        </Typography>
                    </Grid>
                    <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"0%"}}>{userName}</Grid>

                    <Grid item sm={4} style={{ paddingLeft:"5%", paddingBottom:"2%", textAlign:"right"}}></Grid>
                    <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"3%"}}>
                        <Typography variant="caption" style={{color:"#b5b0a3"}}>
                            Help people discover your account by using the name you're known by your full name.
                        </Typography>
                    </Grid>



                    <Grid item sm={4} style={{ paddingLeft:"5%",paddingBottom:"0%", textAlign:"right"}}>
                        <Typography component="h4" variant="h7">
                           Email Id
                        </Typography>
                    </Grid>
                    <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"0%"}}>{emailId}</Grid>

                    <Grid item sm={4} style={{ paddingLeft:"5%", paddingBottom:"2%", textAlign:"right"}}></Grid>
                    <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"3%"}}>
                        <Typography variant="caption" style={{color:"#b5b0a3"}}>
                            Help to assign projects by Admin/superAdmin
                        </Typography>
                    </Grid>



                    <Grid item sm={4} style={{ paddingLeft:"5%",paddingBottom:"0%", textAlign:"right"}}>
                        <Typography component="h4" variant="h7">
                           Role
                        </Typography>
                    </Grid>
                    <RoleId />
                    <Grid item sm={4} style={{ paddingLeft:"5%", paddingBottom:"2%", textAlign:"right"}}></Grid>
                    <Grid item sm={8} style={{ paddingLeft:"5%", paddingBottom:"3%"}}>
                        <Typography variant="caption" style={{color:"#b5b0a3"}}>
                            
                        </Typography>
                    </Grid>

                <Grid container style={{paddingBottom:"5%", paddingTop:"3%", paddingLeft:"7%", paddingRight:"5%"}}>
                    <Grid item sm={12}>
                        <RoleDetails />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>


      </Paper>
    </div>
  );
}
