export const types = {
  FILE_READER: "file-reader",
  BLOB: "blob",
};

function openFilePrompt(
  callback,
  type = types.FILE_READER,
  accept = ".json",
  multiple = false
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.style.opacity = "0";
  input.style.position = "absolute";
  input.style.bottom = "0";
  document.body.appendChild(input);
  input.click();
  input.addEventListener("change", () => {
    if (!input.files.length || (!multiple && input.files.length > 1)) return;
    switch (type) {
      case types.FILE_READER: {
        const fileReader = new window.FileReader();
        fileReader.readAsText(input.files[0]);
        fileReader.onload = callback;
        break;
      }
      case types.BLOB: {
        callback(
          Array.from(input.files).map(
            (file) => new Blob([file], { type: file.type })
          )
        );
        break;
      }
      default:
        break;
    }
  });
}
export default openFilePrompt;
