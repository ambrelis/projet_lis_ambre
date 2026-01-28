module.exports = app => {  
  require("./auth.routes")(app);
  require("./pollution.routes")(app);
  require("./users.routes")(app);
  require("./favorites.routes")(app);
}
