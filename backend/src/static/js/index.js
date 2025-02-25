const form = document.querySelector('form');
form.addEventListener('submit',e => {
    e.preventDefault();
    const submitter = document.querySelector('form button');
    const data = new FormData(form,submitter);
    document.cookie = "fromRoot=True";
    fetch('/upload',{
        method:'POST',
        body:data,
        headers:{
            "X-File-Path":data.get('path')
        }
    })
});