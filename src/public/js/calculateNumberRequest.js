function increaseNumberRequest(className) {
  let currentValue = +$(`.${className}`).find('em').text();
  currentValue+=1;
  if(currentValue>0){
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
  else 
  {
    $(`.${className}`).html("");
  }
}

function decreaseNumberRequest(className) {
  let stringValue = $(`.${className}`).find('em').text();
  let currentValue = +$(`.${className}`).find('em').text();
  currentValue-=1;
  if(currentValue == 0){
    $(`.${className}`).html("");
  }
  else{
  $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}