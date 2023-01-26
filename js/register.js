const form = document.getElementById('register-form');
const username = form.querySelector('#username');
const email = form.querySelector('#email');
const password = form.querySelector('#password');
const confirmPassword = form.querySelector('#confirmPassword');

const loader = document.querySelector('.loader');
const btn = form.querySelector('.btn')

const inputs = {username, email, password, confirmPassword}

const regexExp = {
    username: /^[a-z][a-z0-9]{3,13}[a-z]$/i,
    password: /.{8}/i,
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const errors = {
    username: 'Username must be between 5 and 15 characters ,can only contain letters and numbers and must start and end with a letter',
    password: 'Password must be at least 8 characters',
    email: 'Email must be a valid email address'
}

function collectData(){
    const data = {
        username: username.querySelector('input')?.value,
        email: email.querySelector('input')?.value,
        password: password.querySelector('input')?.value,
        password_confirmation: confirmPassword.querySelector('input')?.value
    }
    console.log(data)
    return data;
}

function showError(input, message){
    const errorEle = input.querySelector('.error');
    errorEle.textContent = message;
    errorEle.classList.remove('hidden');
    return false;
}

function validate(data){
    for (const key in inputs) {
        const errorEle = inputs[key].querySelector('.error');
        errorEle.classList.add('hidden');
    }

    let isValid = true;

    for (const key in data) {
        const regex = regexExp[key];
        if(regex && !regex.test(data[key])){
            isValid = showError(inputs[key], errors[key]);
        }
    }
    if(data.password_confirmation !== data.password){
        isValid = showError(inputs['confirmPassword'], 'Passwords do not match');
    }

    return isValid
}

/*
    Async api call to register user
*/

async function handleAsync(func, params = {}){
    try {
        const response = await func(params);
        return [response, null]
    } catch (error) {
        return [null, error];
    }
}

function handleApiError(errors){
    for(let key in errors){
        showError(inputs[key], errors[key].join(", "));
    }
}

async function callRegisterApi(data){
    const response = await fetch('https://goldblv.com/api/hiring/tasks/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}

function startLoading(){
    loader.classList.remove('hidden');
    btn.disabled = true
}

function stopLoading(){
    loader.classList.add('hidden');
    btn.disabled = false
}

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const data = collectData();
    const isValid = validate(data);

    if(!isValid) return;

    startLoading();
    const [response] = await handleAsync(callRegisterApi, data);
    stopLoading();

    if(response.errors){
        handleApiError(response.errors);
    } else {
        localStorage.setItem('email', data.email)
        location.href = 'finish.html';
    }
})

