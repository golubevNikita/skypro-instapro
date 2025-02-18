export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function correctInput(someEnteredText) {
  const trueInput = someEnteredText.value
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("/", "&#47;")
    .replaceAll("\\", "&#92;");
  return trueInput;
}
