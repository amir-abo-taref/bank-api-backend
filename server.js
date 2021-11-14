fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const usersController = require("./usersController");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  if (!fs.existsSync("./Users.json")) {
    fs.writeFileSync("./Users.json", "[]");
  }
  const buffer = JSON.parse(fs.readFileSync("./Users.json").toString());
  res.status(200).json(buffer);
});
// app.get('./Users.json', function (req, res) {
//     res.status(200).json(usersController.showAllUser().users)
// })

app.post("/", (req, res) => {
  const users = usersController.showAllUser().users;
  if (users.find((user) => user.id === req.body.id)) {
    return res.status(200).send("user is already exist");
  }

console.log(req.body)
  usersController.addNewUser(
    req.body.name,
    req.body.email,
    parseInt(req.body.password),
    parseInt(req.body.cash),
    parseInt(req.body.credit),
    parseInt(req.body.id),
    parseInt(req.body.acountId)
  );
  return res
    .status(201)
    .json({
      user: {
        id: parseInt(req.body.id),
        name: req.body.name,
        email: req.body.email,
        password: parseInt(req.body.password),
        cash: parseInt(req.body.cash),
        credit: parseInt(req.body.credit),
        acountId: parseInt(req.body.acountId),
      },
    });
});
app.put("/Transferring", (req, res) => {
  let buffer = JSON.parse(fs.readFileSync("./Users.json").toString());
  console.log(buffer)
  const users = buffer.users.find(
  (iteam) => iteam.acountId === req.body.fromacountId
  );
  console.log(users)
  const users2 = buffer.users.find((iteam) => iteam.acountId === req.body.toacountId);
  console.log(users2)
  if (users && users2) {
    if (users.cash - parseFloat(req.body.amount) >= users.credit) {
      users.cash -= parseFloat(req.body.amount);
      users2.cash += parseFloat(req.body.amount);
      buffer = {users:[...buffer.users]}
      fs.writeFileSync("./Users.json", JSON.stringify(buffer));
      res.status(200).send(users);
    }
    res.status(406).json("not enough credit");
  } else {
    res.status(406).json("one of the users does not exist");
  }
});



app.put("/Depositing", (req, res) => {
  let buffer = JSON.parse(fs.readFileSync("./Users.json").toString());
  const users = buffer.users.find(
  (iteam) => iteam.acountId === req.body.acountId
  );
  if (users) {
      users.cash += parseFloat(req.body.amount);
      buffer = {users:[...buffer.users]}
      fs.writeFileSync("./Users.json", JSON.stringify(buffer));
      res.status(200).send(users);
    
  } 
  else {
    res.status(406).json("the users is not exist");
  }
});


app.put("/Updatecredit", (req, res) => {
  let buffer = JSON.parse(fs.readFileSync("./Users.json").toString());
  const users = buffer.users.find(
  (iteam) => iteam.acountId === req.body.acountId
  );
  if (users) {
      users.credit += parseFloat(req.body.amount);
      buffer = {users:[...buffer.users]}
      fs.writeFileSync("./Users.json", JSON.stringify(buffer));
      res.status(200).send(users);
    
  } 
  else {
    res.status(406).json("the users is not exist");
  }
});

app.put("/Withdrawmoney", (req, res) => {
  let buffer = JSON.parse(fs.readFileSync("./Users.json").toString());
  const users = buffer.users.find(
  (iteam) => iteam.acountId === req.body.acountId
  );
  if (users) {
    if((users.cash-parseFloat(req.body.cash))>=0){
      users.cash -= parseFloat(req.body.cash);
      buffer = {users:[...buffer.users]}
      fs.writeFileSync("./Users.json", JSON.stringify(buffer));
      res.status(200).send(users);
    }
    res.status(406).json("up to the cash limit")
      
    
  } 
  else {
    res.status(406).json("the users is not exist");
  }
});









app.listen(8080);
