const copyIcon = document.querySelectorAll('.copy-icon');
const linkSpace = document.querySelectorAll('.link-space');
const removeToaster = document.getElementById('cut-btn');
const toastContainer = document.querySelector('.toast-container');

for (let i = 0; i < copyIcon.length; i++) {
    let timer;
    copyIcon[i].addEventListener('click', () => {
        copyIcon[i].style.transform = 'rotate(30deg)';
        linkSpace[i].style = 'background-color: rgba(172, 172, 235, 0.977)';
        toastContainer.style = 'transform: translateY(-70px)';
        let textArea = document.createElement("textarea");
        textArea.value = linkSpace[i].textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        clearTimeout(timer);
        
        timer = setTimeout(() => {
            copyIcon[i].style.transform = 'rotate(0deg)';
            linkSpace[i].style = 'background-color: none';
            toastContainer.style = 'transform: translateY(70px)';
        },1000);
    });
}

removeToaster.addEventListener('click',()=>{
    toastContainer.style = 'transform: translateY(70px)';
});