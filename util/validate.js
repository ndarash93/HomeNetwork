function validateUsername(username){
  const minLength = 3;
  const maxLength = 20;
  const allowedChars = /^[a-zA-Z0-9_-]+$/;

  return (
    username.length > minLength && 
    username.length < maxLength &&
    allowedChars.test(username)
  );
}

function validatePassword(password){
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/.test(password);


  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigits &&
    hasSpecialChars
  );
}


module.exports = ({ 
  validateUsername,
  validatePassword
})
