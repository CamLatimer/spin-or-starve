// note: can't use es6 import syntax with hbsfy
const spin = require('../views/spin.html');
const login = require('../views/login.html');
const about = require('../views/about.html');
import * as firebase from 'firebase';
import { AppAuth } from '../firebase/sosAuth';
import  { places } from '../api/places';
import { backToSpin, addSignOut } from '../DOM/dom';

let spaRouter = (function(){

function init(){
  // get window href and set an initial history state entry so app isn't started from '/' if users come back or refresh page while signed in
  let startingState = {pageStart: 'home', pageURL: location.pathname};
  history.replaceState(startingState, startingState.pageStart, startingState.pageURL);

  // on page load, check to see if user is logged in
  checkSignOut();
  // listen for back or forward button to be triggered and update page content
  window.onpopstate = function(event){
    changeRoute({title:'home', pageURL: '/'});
    checkSignOut();
  };
}

  // listeners for signing up and out
function addSignIn(){
    document.querySelector('.auth__form--signIn').addEventListener('submit', function(event){
      event.preventDefault();
      let email = document.getElementById('signInEmail').value;
      let passw = document.getElementById('signInPass').value;
      // run firebase auth sign in w/ email and password
      AppAuth.handleSignIn(email, passw);
    })
  }
function addSignUp(){
  document.querySelector('.auth__form--signUp').addEventListener('submit', function(event){
    event.preventDefault();
    let email = document.getElementById('signUpEmail').value;
    let passw = document.getElementById('signUpPass').value;
    // run firebase auth sign up w/ email and password
    AppAuth.handleSignUp(email, passw);
  })
}

  // place the page's main content
  function swapContent(view, data){
    document.getElementById('target').innerHTML = view(data);
    // make sure listeners are attached to buttons when rendering view
    if(view === about){
      backToSpin();
    }
    if(view === login){
      addSignIn();
      addSignUp();
    }
  }

  // run swapContent() according to history state URL
  function routes(){
    // if(signedIn){
      switch(history.state.pageURL){
        case '/':
          swapContent(spin);
          places.init();
          break;
        // case '/start':
        //   swapContent(spin);
        //   places.init();
        //   break;
        case '/spin':
          places.init();
          let searchResult = places.showUserSearchResult();
          swapContent(spin, searchResult);
          break;
        case '/about':
          swapContent(about);
        break;
      }
  }

  // listen for user's status(signed in or out)
let checkSignOut = function(){
    return firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('signed in');
              routes();
              addSignOut(true);
          } else if(!user) {
            addSignOut(false);
            console.log('signed out');
            if(history.state.pageURL === '/about'){
              swapContent(about);
            } else {
                swapContent(login);
            }
          }
      });
}

function changeRoute(data){
    let pageData = data;
    history.pushState(data, data.title, data.pageURL);
}

return {
  init: init,
  routes: routes,
  changeRoute: changeRoute,
  swapContent: swapContent
}

})();

export { spaRouter }
