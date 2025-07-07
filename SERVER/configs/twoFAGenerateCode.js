function generateTwoFACode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
}

module.exports = generateTwoFACode
