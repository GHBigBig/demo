function updateSize() {
    let nBytes = 0,
        oFiles = document.getElementById("uploadInput").files,
        nFiles = oFiles.length;
    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
        nBytes += oFiles[nFileId].size;
    }
    let sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    for (nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    // end of optional code
    document.getElementById("fileNum").innerHTML = nFiles;
    document.getElementById("fileSize").innerHTML = sOutput;
}


const fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem"),
    preview = document.getElementById('preview'),
    form = document.getElementById('form');
const url = 'http://127.0.0.1:8080';


fileElem.addEventListener('change', handleFiles);
form.addEventListener('submit', sendFiles);

function handleFiles(e) {
    let files = this.files; //这里不感觉很诡异吗，子对象会一级一级地向上寻找所有父对象的变量？？？？？？？
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /^image\//;

        if (!imageType.test(file.type)) {
            continue;
        }

        var div = document.createElement('div');
        div.classList.add('show-item');
        var img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        div.appendChild(img); // 假设"preview"就是用来显示内容的div
        var progress = document.createElement('meter');
        progress.setAttribute('min', 0);
        progress.setAttribute('max', 100);
        progress.setAttribute('step', 0.1);
        progress.setAttribute('value', 0);
        div.appendChild(progress);
        preview.appendChild(div);


        var reader = new FileReader();
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}

function sendFiles(e) {
    e.preventDefault();
    var imgs = document.querySelectorAll(".obj");

    for (var i = 0; i < imgs.length; i++) {
        new FileUpload(imgs[i], imgs[i].file);
    }
}

function FileUpload(img, file) {
    let reader = new FileReader();
    let prog = img.parentElement.children[1];
    let xhr = new XMLHttpRequest();

    var self = this;
    xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
            let percentage = e.loaded / e.total;
            prog.value = percentage;
            console.debug(`e.loaded: ${e.loaded}, e.total: ${e.total}`);
        }
    }, false);

    xhr.upload.addEventListener("load", function (e) {
        // self.prog.value = 100;
        prog.value = 100;
    }, false);
    xhr.open("POST", `${url}/upload`);
    // xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
    xhr.setRequestHeader('file-name', encodeURIComponent(file.name));
    reader.onload = function (evt) {
        debugger
        xhr.send(evt.target.result);
    };
    reader.readAsArrayBuffer(file);
}
