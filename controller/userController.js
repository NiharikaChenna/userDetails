const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const yup = require("yup");
const {
  signInSchema,
  signUpSchema,
} = require("../validation/schemaValidation");
const { jwtSecret } = require("../config/config");
const pool = require("../config/database");
const saltRounds = 10;

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the request body using signInSchema
    await signInSchema.validate(req.body);

    // Query the database to find the user by email
    const sql = "SELECT * FROM userDetails WHERE email = ?";
    pool.query(sql, [email], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error signing in");
      }

      const user = result[0];

      // Compare the provided password with the hashed password from the database
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).send("Invalid credentials");
      }

      // Generate a JWT token for authentication
      const token = jwt.sign({ email: user.email }, jwtSecret, {
        expiresIn: "2d",
      });
      res.json({ user, token });
    });
  } catch (error) {
    console.error(error);
    let validationErrors = [];
    if (error.inner) {
      // Collect and format validation errors from Yup schema validation
      validationErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
    } else {
      validationErrors.push({
        field: "general",
        message: error.message,
      });
    }
    return res.status(400).json({ errors: validationErrors });
  }
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await signUpSchema.validate(req.body, { abortEarly: false });

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the email is already in use
    const checkEmailSql = "SELECT * FROM userDetails WHERE email = ?";
    pool.query(checkEmailSql, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error signing up");
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Email is already in use" });
      }

       // Create a new user in the database
      const createUserSql =
        "INSERT INTO userDetails (username, email, password) VALUES (?, ?, ?)";
      pool.query(
        createUserSql,
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error signing up");
          }

          const token = jwt.sign({ email }, jwtSecret, { expiresIn: '2d' });
          res.json({ message: "Signed up successfully", token });

        }
      );
    });
  } catch (error) {
    console.error(error);
    if (error.inner) {
      const validationErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }
    return res.status(500).send("Error signing up");
  }
};

const tokenVerification = (req,res)=>{
  res.send({
    message: "Authorized!",
    user: req.user
  });
}

module.exports = { signIn, signUp, tokenVerification };
