const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("images"));
app.use(fileUpload());

app.listen(5000, () => {
  console.log("running on port 5000");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "creativedb",
});

app.get("/", (req, res) => {
  res.send("hello world");
});

// Add Service API
app.post("/addService", (req, res) => {
  const file = req.files.file;
  const title = req.body.title;
  const description = req.body.description;
  const image = file.name;
  // storing the image
  file.mv(`${__dirname}/images/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Failed to upload" });
    }
    // return res.send({name:file.name, path: `/${file.name}`})
  });
  // storing the title and description to the database
  con.query(
    "insert into services (title, description,image) values (?,?,?)",
    [title, description, image],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result.insertId > 0);
      }
    }
  );
});

// Get Service Api
app.get("/getServices", (req, res) => {
  const sql = "select * from services";
  const query = con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

// Add Order Api
app.post("/addOrder", (req, res) => {
  const file = req.files.file;
  const title = req.body.title;
  const description = req.body.description;
  const email = req.body.email;
  const name = req.body.name;
  const price = req.body.price;
  const image = file.name;
  const orderStatus = req.body.orderStatus;

  // console.log(orderStatus);

  // storing the image
  file.mv(`${__dirname}/images/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Failed to upload" });
    }
    // return res.send({name:file.name, path: `/${file.name}`})
  });

  // storing the title and description to the database
  con.query(
    "insert into orders (title, description, email, name, price, image, status) values (?,?,?,?,?,?,?)",
    [title, description, email, name, price, image, orderStatus],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result.insertId > 0);
      }
    }
  );
});

// Get Order Api
app.get("/getOrders", (req, res) => {
  const sql = "select * from orders";
  const query = con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

// Add Feedback Api
app.post("/addReview", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const position = req.body.position;
  const review = req.body.review;
  const image = req.body.image;

  con.query(
    "insert into reviews (email, name, position, review, image) values (?,?,?,?,?)",
    [email, name, position, review, image],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result.insertId > 0);
      }
    }
  );
});

// Get Feedback Api
app.get("/getReview", (req, res) => {
  const sql = "select * from reviews";
  con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(results);
      res.send(results);
    }
  });
});

// Get Orders Api For Single User
app.get("/customerOrders", (req, res) => {
  const sql = `select * from orders where email=${req.query.email}`;
  con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(results);
      res.send(results);
    }
  });
});

// Add Admin Api
app.post("/addAdmin", (req, res) => {
  const email = req.body.admin;
  con.query("insert into admins (email) values (?)", [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result.insertId > 0);
    }
  });
});

// Admins Api
app.get("/admins", (req, res) => {
  con.query("select * from admins", (err, results) => {
    // console.log(results);
    res.send(results);
  });
});

// Delete Order api
app.delete("/deleteOrder/:id", (req, res) => {
  const id = req.params.id;
  con.query(`delete from orders where oid=${id}`, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

// Update Ordered Service Api
app.put("/updateOrder", (req, res) => {
  // const id = req.query.id;
  const { id, description, price } = req.body;
  const file = req.files.file;
  const image = file.name;

  // console.log("update api called ", id, description, price, image);

  // storing the image
  file.mv(`${__dirname}/images/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Failed to upload" });
    }
  });

  con.query(
    `UPDATE orders SET description='${description}',price='${price}',image='${image}' where oid=${id}`,
    (err, result) => {
      // console.log(result);
      res.send(result);
    }
  );
});

// update order status api
app.put("/updateStatus", (req, res) => {
  const { id, status } = req.body;
  con.query(
    `update orders set status='${status}' where oid=${id}`,
    (err, result) => {
      res.send(result);
    }
  );
  // console.log(id, status);
});
