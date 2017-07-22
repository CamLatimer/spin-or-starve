import {spaRouter} from '../routes/spaRouter';
import { AppAuth } from '../firebase/sosAuth';

let firstSpin = true;

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

function wheelSpin(){
  let spinner = document.querySelector('.spin__wheel');
  let spinnerHolder = document.querySelector('.spin__wheelHolder');
  let result = document.querySelector('.spin__result');

  if (firstSpin === true){
    firstSpin = false;
    spinnerHolder.classList.toggle('firstOpacityChange');
    spinner.classList.toggle('rotator');
  } else {
    if(spinnerHolder.classList.contains('firstOpacityChange')){
      spinnerHolder.classList.remove('firstOpacityChange')
    }
    spinnerHolder.classList.toggle('opacityChange');
    spinner.classList.toggle('rotator');
    result.classList.remove('resultShow');
    result.classList.add('resultHide');
  }

}

export { backToSpin, addSignOut, wheelSpin };
