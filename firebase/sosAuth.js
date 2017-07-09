import firebaseConfig from './firebaseConfig';
import * as firebase from 'firebase';
import { spaRouter } from '../routes/spaRouter';

const AppAuth = (function(){

  // initialize firebase and observer object
  firebase.initializeApp(firebaseConfig);

// route to spin page after signing in or signing up
  function handleSignUp(userEmail, userPass) {
      firebase.auth()
      .createUserWithEmailAndPassword(userEmail, userPass)
      .then(spaRouter.changeRoute({title:'spin', pageURL: '/start'}))
      .catch(function(error) {
          // Handle Errors here.
          alert(`oops... ${error.cod}, ${error.message}`);
      })
  }

  function handleSignIn(userEmail, userPass) {
      firebase.auth()
      .signInWithEmailAndPassword(userEmail, userPass)
      .then(spaRouter.changeRoute({title:'spin', pageURL: '/start'}))
      .catch(function(error) {
          // Handle Errors here.
          alert(`oops... ${error.cod}, ${error.message}`);
      });
  }

  function handleSignOut() {
      firebase.auth()
      .signOut()
      .then(function() {
          // Sign-out successful.
          console.log('thank you. come again.');
          spaRouter.changeRoute({title:'home', pageURL: '/'});
      }).catch(function(error) {
          // An error happened.
          console.log(error);
      });
  }

  return {
    handleSignUp: handleSignUp,
    handleSignIn: handleSignIn,
    handleSignOut: handleSignOut,
  }

})();
export { AppAuth }
