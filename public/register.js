const registerBtn = document.getElementsByClassName('reg-btn');
const registerFormBtn = document.getElementsByClassName('reg-btn-form');
const toastContainer = document.querySelector('.toast-container');
const submitBtn = document.querySelector('.sub-btn');
const removeToaster = document.getElementById('cut-btn');

registerBtn[0].addEventListener('click',()=>{
    registerBtn[0].classList.add('active-log-btn');
    registerBtn[1].classList.remove('active-log-btn');

    registerFormBtn[1].classList.remove('inactive-log-btn');
    registerFormBtn[0].classList.add('inactive-log-btn');
});

registerBtn[1].addEventListener('click',()=>{
    registerBtn[1].classList.add('active-log-btn');
    registerBtn[0].classList.remove('active-log-btn');

    registerFormBtn[0].classList.remove('inactive-log-btn');
    registerFormBtn[1].classList.add('inactive-log-btn');
});

let timeout;
window.addEventListener('load',()=>{
    toastContainer.style = 'transform: translateY(30px)';
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
        toastContainer.style = 'transform: translateY(-170px)';
    },2000);
});

removeToaster.addEventListener('click',()=>{
    toastContainer.style = 'transform: translateY(-170px)';
});