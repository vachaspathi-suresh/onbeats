import React from 'react';
import { Dialog,Button,DialogActions,DialogContent,DialogTitle,Grid, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {WhatsappShareButton,FacebookShareButton,TelegramShareButton,WhatsappIcon,FacebookIcon,TelegramIcon} from 'react-share';


const ShareDailog = ({open,handleClose,url})=>{

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <DialogTitle id="share-dialog-title">
          {"Share"}
        </DialogTitle>
        <DialogContent>

        <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={2}
        >
            <Grid item>
                <WhatsappShareButton url={url}>
                    <WhatsappIcon size={42} round/>
                </WhatsappShareButton>
            </Grid>
            <Grid item>
                <FacebookShareButton url={url}>
                    <FacebookIcon size={42} round/>
                </FacebookShareButton>
            </Grid>
            <Grid item>
                <TelegramShareButton url={url}>
                    <TelegramIcon size={42} round/>
                </TelegramShareButton>
            </Grid>
            <Grid item>
                <IconButton sx={{backgroundColor:"#C7C7C7"}} onClick={() => {navigator.clipboard.writeText(url)}}>
                    <ContentCopyIcon  />
                </IconButton>
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    )
}

export default ShareDailog;