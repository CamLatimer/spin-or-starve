import $ from 'jquery';

const zomato = (function(){
  function yelpTest(){
    $.ajax()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    })
    // console.log(process.env.ZOMATO_KEY);
  }
  return {
    zomatoTest: zomatoTest
  }
})();

export { yelp };
