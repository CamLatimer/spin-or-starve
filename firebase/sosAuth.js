import firebaseConfig from './firebaseConfig';
import * as firebase from 'firebase';

const AppAuth = (function(){

  // initialize firebase and observer object
  firebase.initializeApp(firebaseConfig);

// route to spin page after signing in or signing up
  function changeRoute(data){
      let pageData = data;
      history.pushState(data, data.title, data.pageURL)
  }

  function handleSignUp(userEmail, userPass) {
      firebase.auth()
      .createUserWithEmailAndPassword(userEmail, userPass)
      .then(changeRoute({title:'spin', pageURL: '/spin'}))
      .catch(function(error) {
          // Handle Errors here.
          alert(`oops... ${error.cod}, ${error.message}`);
      })
  }

  function handleSignIn(userEmail, userPass) {
      firebase.auth()
      .signInWithEmailAndPassword(userEmail, userPass)
      .then(changeRoute({title:'spin', pageURL: '/spin'}))
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
          changeRoute({title:'home', pageURL: '/'});
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
