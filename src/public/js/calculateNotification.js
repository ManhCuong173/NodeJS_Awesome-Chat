function increaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();
  currentValue+= number;
  if(currentValue>0){
    $(`.${className}`).css('display', 'block').html(currentValue);
  }
  else 
  {
    $(`.${className}`).css('display', 'none').html("");
  }
}

function decreaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();
  currentValue-= number;
  if(currentValue <= 0){
    $(`.${className}`).css('display', 'none').html("");
  }
  else{
    $(`.${className}`).css('display', 'block').html(currentValue);
  }
}