const yup = require('yup');

const signInSchema = yup.object().shape({
    email: yup.string().email('Invalid email'),
    password: yup.string().required('Password is required')
  });

  const signUpSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup
      .string()
      .email('Invalid email'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[!@#$%^&*])/,
        'Password must contain at least one special character'
      ),
  });
  

  module.exports = {signInSchema,signUpSchema};