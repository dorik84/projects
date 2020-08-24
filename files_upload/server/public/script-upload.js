

document.getElementsByTagName("form")[0].addEventListener("submit", (event)=>{
    event.preventDefault();
    let image = document.querySelectorAll("input")[0].files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    axios({
        url: "/upload/images",
        method: "post",
        data: formData
    }).then(res => {
        console.log(res);
        if (res.data.url)
            document.querySelectorAll("img")[0].src = res.data.url;
    }).catch(err=>console.log(err));

});


let inputFileNode = document.querySelectorAll('.custom-file-input')[0];
inputFileNode.addEventListener('change', ()=>{
    document.querySelectorAll('.custom-file-label')[0].innerHTML =  inputFileNode.value;
})