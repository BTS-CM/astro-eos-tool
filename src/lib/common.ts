/**
 * Copy the provided text to the user's clipboard
 */
function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}

export {
  copyToClipboard
};
