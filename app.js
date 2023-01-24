
const fileName = document.getElementById('file');

function getImageHandler() {
    fileName.click();
}

function fileInfo(){
    const fileName = fileName.files[0].name;
    const fileSize = fileName.files[0].size;
    const fileType = fileName.files[0].type;

}