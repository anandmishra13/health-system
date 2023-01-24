const inputfile = document.getElementById("file");
let testcase = false;
let result = document.querySelector('#result')
let type = document.querySelector('#type')

function getImageHandler() {
    inputfile.click();
}

function fileInfo() {
    previewGivenImage()
    result.innerHTML = 'Result: ' + '--';
    type.innerHTML = '';
    document.getElementById('imgName').innerHTML = 'Sample Name: ' + inputfile.files[0].name;
    document.getElementById('imgSize').innerHTML = 'Sample Size: ' + (inputfile.files[0].size / 1024).toFixed(2) + 'KB';
    sendImage();
}

function previewGivenImage() {
const showImage = document.querySelector('#givenImage');
const scanImage = document.querySelector('#scanImage');

const file = inputfile.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', function() {
    const dataURL = reader.result;
    showImage.src = dataURL;
    scanImage.src = dataURL;
  });
  reader.readAsDataURL(file);
}

function sendImage() {
  const API = "http://127.0.0.1:5000/detect_pink";
  const formData = new FormData();
  const image = document.querySelector('input[type="file"]').files[0];
  formData.append("image", image);

  fetch(API, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.blob())
    .then((data) => {
        testcase = true;
        const selectImageText = document.querySelector('#selectImageText');
        selectImageText.classList.add('d-none');
        const objectURL = URL.createObjectURL(data);
        const img = document.querySelector("#resImage");
        img.src = objectURL;
        scanImage()
    })
    .catch((error) => {
        testcase = false;
        scanImage()
        console.log(error);
    });
}

function scanImage() {
    const imageScanning = document.querySelector('#imageScanning');
    const scanimage = document.querySelector('#scanImage');
    const resImage = document.querySelector('#resImage');
    const rightConetntText = document.querySelector('#rightConetntText');

    imageScanning.classList.add('scanning');
    scanimage.classList.remove('d-none');
    resImage.classList.add('d-none');
    rightConetntText.innerHTML = 'Scanning...';

    setTimeout(() => {
        imageScanning.classList.remove('scanning');
        scanimage.classList.add('d-none');
        resImage.classList.remove('d-none');
        rightConetntText.innerHTML = 'Completed';
        showResult()
        if (!testcase) {
            scanimage.classList.remove('d-none');
            resImage.classList.add('d-none');
        }
    }, 4000);
}

function showResult() {
    
    if (testcase) {
        result.innerHTML = 'Result: ' + 'Malaria Detected';
        type.innerHTML = 'Type: ' + 'Parasitized cell detected';
     } else {
        result.innerHTML = 'Result: ' + 'Uninfected Cell Detected';
        type.innerHTML = '';
     }
}
