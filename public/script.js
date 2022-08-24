const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileinput");
const body = document.getElementById('body-cont');
const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progess');
const percentdiv = document.querySelector('#percent');
const sharingContainer = document.querySelector('.sharing-container');
const fileURL = document.querySelector('#fileURL');
const copyBtn = document.querySelector('#copy-btn');
const emailForm = document.querySelector('#email-form');
const toast = document.querySelector('.msg-bar');
const toastContainer = document.querySelector('.toast-container');
const maxAllowedSize = 100 * 1024 * 1024;
const uploadingBarTitle = document.querySelector('.uploading-bar-title');
const removeToaster = document.getElementById('cut-btn');

const baseURL = 'https://sharekaroapp.herokuapp.com';
// const baseURL = 'http://localhost:3000';
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;



dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("dragging");
    if (dropZone.classList.contains('dragged') == false) {
        dropZone.classList.add('dragged')
    }
});

fileInput.addEventListener('change', (e) => {
    fileInput.files = e.target.files;
    uploadFile();
})

dropZone.addEventListener('dragleave', (e) => {
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
    dropZone.classList.remove('dragged');
});

// uploading file to database using fetch API(doing after backend)..
const uploadFile = () => {
    // console.log(progressContainer);
    console.log('File added uplaoding started');
    if (fileInput.files.length > 1) {
        showToast('Only Upload single file at a time.');
        fileInput.value = "";
        return;
    }
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast("Can't upload more then 100MB..");
        fileInput.value = "";
    }


    //file uploading
    const xhr = new XMLHttpRequest();

    const formData = new FormData();
    formData.append("myfile", fileInput.files[0]);
    // show uploader section
    progressContainer.style.display = 'block';
    xhr.upload.onprogress = function (event) {
        uploadingBarTitle.innerText = 'Uploading...';
        let percent = Math.round((100 * event.loaded) / event.total);
        percentdiv.innerText = `${percent}%`;
        bgProgress.style.width = `${percent}%`;
        // updateProgress();
    }

    xhr.upload.onerror = function () {
        showToast(`Error in Upload: ${xhr.status}.`);
        fileInput.value = "";
    }
    // listen to response which will give the link... 
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onUploadFileSuccess(xhr.responseText);
        }
    };

    xhr.open('POST', uploadURL);
    xhr.send(formData);
    // console.log(fileInput.files);
};

emailForm[2].addEventListener('mouseover', () => {
    if (!emailForm[2].hasAttribute('disabled')) {
        emailForm[2].style = "background-color: rgb(34 163 209)";
    }
})


emailForm[2].addEventListener('mouseleave', () => {
    emailForm[2].style = "background-color:  #eff5fe;";
});

const onUploadFileSuccess = (res) => {
    fileInput.value = "";
    uploadingBarTitle.innerText = 'Uploaded...';
    showToast('File Uploaded Successfully');
    const { file: url } = JSON.parse(res);
    console.log(url);
    showLink(url);
    fileURL.value = url;
    sharingContainer.style.display = 'block';
}

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

const showLink = ({ file: url }) => {
    fileURL.value = url;
    fileInput.value = "";
    emailForm[2].style = "background-color:  #eff5fe;";
    sharingContainer.style.display = 'block';
    emailForm[2].removeAttribute("disabled");
};


copyBtn.addEventListener('click', () => {
    fileURL.select();
    document.execCommand('copy');
    showToast('copied succesfully...');
});

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        uuid: fileURL.value.split("/").splice(-1, 1)[0],
        emailTo: e.target.toEmail.value,
        emailFrom: e.target.fromEmail.value
    }
    console.log(formData);
    emailForm[2].setAttribute("disabled", true);
    // here sending email using fetch API.(doing after backend)
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then((res) => res.json()).then((data) => {
        showToast("Email Sent Succesfully");
        emailForm[0] = "";
        emailForm[1] = "";
        // sharingContainer.style.display = 'none';
    }).catch((err) => {
        showToast("Email Not Sent");
    })

});

let timeout;
const showToast = (msg) => {
    toastContainer.style = 'transform: translateY(-10px)';
    
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
        copyBtn.style = 'transform: rotate(0deg)';
        toastContainer.style = 'transform: translateY(70px)';
    },2000);
    toast.innerText = msg;
} 

removeToaster.addEventListener('click',()=>{
    toastContainer.style = 'transform: translateY(70px)';
});