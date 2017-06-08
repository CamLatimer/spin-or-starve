// note: can't use es6 import syntax with hbsfy
const spin = require('../views/spin.html');
const result = require('../views/result.html');
const home = require('../views/home.html');
import * as firebase from 'firebase';
import { AppAuth } from '../firebase/sosAuth';

export default function spaRouter(){

// get window href and set an initial history state entry so app isn't started from '/' if users come back or refresh page while signed in
let startingState = {pageStart: 'start', pageURL: location.pathname};
history.replaceState(startingState, startingState.pageStart, startingState.pageURL);

  // listeners for signing up and out
function addSignIn(){
    document.getElementById('signInSubmit').addEventListener('click', function(){
      let email = document.getElementById('signInEmail').value;
      let passw = document.getElementById('signInPass').value;
      // run firebase auth sign in w/ email and password
      AppAuth.handleSignIn(email, passw);
    })
  }
function addSignUp(){
  document.getElementById('signUpSubmit').addEventListener('click', function(){
    let email = document.getElementById('signUpEmail').value;
    let passw = document.getElementById('signUpPass').value;
    // run firebase auth sign up w/ email and password
    console.log('wassup');
    AppAuth.handleSignUp(email, passw);
  })
}
  function addSignOut(){
    document.getElementById('signOutSubmit').addEventListener('click',function(){
      // run firebase sign out
      AppAuth.handleSignOut();
    })
  }

  // place the page's main content
  function swapContent(view){
    document.getElementById('target').innerHTML = view();
    // make sure listeners are attached to buttons when rendering view
    addSignOut();
    if(view === home){
      addSignIn();
      addSignUp();
    }
  }

  // run swapContent() according to history state URL
  function routes(){
    switch(history.state.pageURL){
      case '/':
        swapContent(home);
        break;
      case '/spin':
        swapContent(spin);
        break;
      case '/result':
        swapContent(result);
        break;
      default:
        swapContent(home);
    }
  }

  // listen for user's status(signed in or out)
let checkSignOut = function(){
  return firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('signed in');
            routes();
        } else if(!user) {
          console.log('signed out');
            swapContent(home);
        }
    });
}

// on page load, check to see if user is logged in
checkSignOut();


  // listen for back or forward button to be triggered and update page content
  window.onpopstate = function(event){
    checkSignOut();
  };

}
