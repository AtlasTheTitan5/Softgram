import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null)
      }
    }) 
    
    return () =>{
      unsubscribe();
    }

  }, [user, username]);

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
     setPosts(snapshot.docs.map(doc => ({
       id: doc.id,
       post: doc.data()
     }))); 
    })
  }, [])
  
  const signUp = (Event) => {
    Event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then ((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false);

  }

  const signIn = (Event) =>{
    Event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
  <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className = "app__signup"> 
          <center>
            <img 
              className = "app__signUpHeaderImage"
              src = "softgram.png"
              alt = ""
              width ="140"
              height = "50"
            />
            </center>
            
            <Input
              placeholder = "username"
              type = "text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)} 
            />

            <Input
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)} 
            />

            <Input
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />

            <Button onClick = {signUp}>sign Up</Button>

        </form>
          
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className = "app__signin"> 
          <center>
            <img 
              className = "app__signInHeaderImage"
              src = "softgram.png"
              alt = ""
              width ="140"
              height = "50"
            />
            </center>

            <Input
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)} 
            />

            <Input
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />

            <Button onClick = {signIn}>sign In</Button>
        </form>
          
          
        </div>
      </Modal>

      <div className = "app__header">
        <img 
          className = "app__headerImage"
          src = "softgram.png"
          alt = ""
          width ="140"
          height = "50"
        />
        <div className = "app__headerButton">
        {user ? (
        <Button onClick = {()=> auth.signOut()}>Log Out</Button>
          ):(
          <div className = "app__loginContainer">
            <Button onClick = {()=> setOpenSignIn(true)}>Sign In</Button>
            <Button onClick = {()=> setOpen(true)}>Sign Up</Button>
          </div>
        )}
        </div>
        

      </div>

      <div className= "app__posts">
        {
        posts.map(({id, post}) => (
          <Post key = {id} postId = {id} user = {user} username ={post.username} caption = {post.caption} imageUrl = {post.imageUrl}/>
        ))
        }
      </div>
    
        <div className = "app__uploader"> 
          {user?.displayName ? (
            <ImageUpload username = {user.displayName}/>
          ):(
            <center><h4>Login to post an image or comment...</h4></center>
          )
          }
        </div>
    
  </div>
  );
}

export default App;
