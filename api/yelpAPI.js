import $ from 'jquery';

const yelp = (function(){
  function yelpTest(){
    $.ajax()
    .then((result) => {
      // do stuff with the response
    })
    .catch((error) => {
      console.log(error);
    })
    // do stuff with the error
  }
  return {
    yelpTest: yelpTest
  }
})();

export { yelp };
