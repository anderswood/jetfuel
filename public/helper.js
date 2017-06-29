const encode = (num) => {
  const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  const base = alphabet.length;
  let encoded = '';

  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createShortUrl = () => {
  let randomNum = getRandomInt(1, 100000000)
  let code = encode(randomNum)

  return `jet.fuel/${code}`
}
