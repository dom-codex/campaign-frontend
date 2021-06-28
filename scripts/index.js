//get submit button
const submitBtn = document.getElementById("submit");
const nameInput = document.getElementById("name");
const fileInput = document.getElementById("file");
const generating = document.querySelector(".gene");
submitBtn.addEventListener("click", () => {
  //get name from form input
  const name = nameInput.value;
  if (!name.length > 0) {
    return alert("please enter your name");
  }
  //get file
  const file = fileInput.files[0];
  if (!file) {
    return alert("pplease select an image to upload");
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("file too large should not exceed 5mb");
  }
  if (file.type.toString() == "image/png") {
    return upload(file, name);
  } else if (file.type.toString() == "image/jpg") {
    return upload(file, name);
  } else if (file.type.toString() == "image/jpeg") {
    return upload(file, name);
  } else {
    alert("please select an image");
  }
});
const upload = (file, name) => {
  //show loading
  submitBtn.style.display = "none";
  generating.style.display = "inline";
  const formData = new FormData();
  formData.append("img", file);
  formData.append("name", name);
  fetch("https://sug-campaign.herokuapp.com/generate/flyer", {
    method: "post",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      submitBtn.style.display = "inline-block";
      generating.style.display = "none";
      if (res.code == 200) {
        const { name, ext } = res;
        var bytes = new Uint8Array(res.buf.data);
        var blob = new Blob([bytes.buffer]);
        //   var img = document.getElementById("mimg");
        var reader = new FileReader();
        reader.onload = (e) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${name}.${ext}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          alert("downloaded");
        };
        reader.readAsDataURL(blob);
      }
    })
    .catch((err) => {
      submitBtn.style.display = "inline-block";
      generating.style.display = "none";
      alert("an error occured seriously");
    });
};
