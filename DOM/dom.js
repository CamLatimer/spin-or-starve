import {spaRouter} from '../routes/spaRouter';
import { AppAuth } from '../firebase/sosAuth';


function backToSpin(){
  let spinAgainBtn = document.getElementById('backToSpin');
  spinAgainBtn.addEventListener('click', function(e){
    e.preventDefault();
    spaRouter.changeRoute({title:'start', pageURL: '/start'});
    spaRouter.routes();
  })
}

function addSignOut(signedIn){
  let signOutBtn = document.getElementById('signOutSubmit');
  if(signedIn){
    signOutBtn.style.display = "block";
    signOutBtn.addEventListener('click',function(){
      // run firebase sign out
      AppAuth.handleSignOut();
    })
  } else {
    signOutBtn.style.display = "none";
  }
}

export { backToSpin, addSignOut };
