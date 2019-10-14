import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import history from '../Utils/history';

import * as ACTIONS from '../store/actions/actions';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { setTimeout } from 'timers';




class ShowPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            comment: '',
            cid: ''
        }
    }

   RenderComments = (props) => (
        <div>
            <h3>{props.comment.comment}</h3>
            <small>{props.comment.date_created}</small>
           <p>By : {props.comment.author}</p>
           {props.cur_user_id == props.comment.user_id ?
                <Button onClick={() => this.handleClickOpen(props.comment.cid, props.comment.comment)} > Edit</Button>
                : null
            }
        </div>
    )


    componentDidMount() {
        axios.get('/api/get/allpostcomments', {
            params: { post_id: this.props.location.state.post.post.pid }
        })
            .then(res => this.props.set_comments(res.data))
            .catch(err => console.log(err))
    }
    handleClickOpen = (cid, comment) => {
        this.setState({ open: true, cid: cid, comment: comment });
    }

    handleClose = () => {
        this.setState({ open: false, cid: '', comment: '' });
    }

    handleCommentChange = (event) => {
        this.setState({ comment: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user_id = this.props.db_profile[0].uid;
        const post_id = this.props.location.state.post.post.pid;
        const username = this.props.db_profile[0].username;
        const data = {
            comment: event.target.comment.value,
            post_id: post_id,
            user_id: user_id,
            username: username
        }
       // console.log(data);
        axios.post('/api/post/commenttodb', data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(setTimeout(() => history.replace('/posts'), 700))

    }

    handleUpdate = () => {
        const comment = this.state.comment;
        const cid = this.state.cid;
        const user_id = this.props.db_profile[0].uid;
        const post_id = this.props.location.state.post.post.pid;
        const username = this.props.db_profile[0].username;
        const data = {
            cid: cid,
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }
        console.log(data);
        axios.put('/api/put/commenttodb', data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(setTimeout(() => history.replace('/posts'), 700))
    }

    handleDeleteComment = () => {
        const cid = this.state.cid;
        console.log(cid);
        axios.delete('/api/delete/comment', { data: { cid: cid } })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(setTimeout(() => history.replace('/posts'), 700))
    }
    render() {
        return (
            <div>
                <div>
                    <h2>Post</h2>
                    <h4>{this.props.location.state.post.post.title}</h4>
                    <p>{this.props.location.state.post.post.body}</p>
                    <p>{this.props.location.state.post.post.author}</p>
                </div>
                <div>
                    <h2>Comments:</h2>
                    {this.props.comments ?
                        this.props.comments.map((comment) =>
                            <this.RenderComments comment={comment} cur_user_id={this.props.db_profile[0].uid} key={comment.cid} />)
                        : null}
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            id="comment"
                            label="Comment"
                            margin="normal" />
                        <br />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" >
                        <DialogTitle id="alert-dialog-title">Edit Comment </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <input type="text" value={this.state.comment} onChange={this.handleCommentChange} />
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={() => { this.handleUpdate(); this.setState({ open: false }) }}>
                                    Agree</Button>
                                <Button onClick={() => this.handleClose()}>Cancel</Button>
                                <Button onClick={() => this.handleDeleteComment()}>Delete</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        comments: state.posts_reducer.comments,
        db_profile: state.auth_reducer.db_profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_comments: (comments) => dispatch(ACTIONS.fetch_post_comments(comments))
    }
} 
                        
export default connect(mapStateToProps, mapDispatchToProps)(ShowPost);