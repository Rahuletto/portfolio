export function getRandomDelay() {
  const randomNum = Math.random() * 1.2 + 1.0;
  return Math.round(randomNum * 10) / 10;
}

export function getRandomRotation() {
  const randomNum = Math.random() * 60 - 30;
  return randomNum;
}
