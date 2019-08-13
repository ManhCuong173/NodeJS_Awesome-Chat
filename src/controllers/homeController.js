let homeController = (req,res) => {
  res.render('main/home/home',{
    errors: req.flash('errors'),
    success: req.flash('success')
  });
};

module.exports = {
  homeController:homeController
};