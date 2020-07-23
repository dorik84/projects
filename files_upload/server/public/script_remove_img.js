

$('.close').on("click", function (){
    let link = $(this).prev().attr('src');
    $.ajax({
        url: "/profile/delete",
        method: "POST",
        data: { image : link },
    })
        .done(arrayOfImages => {
            console.log(arrayOfImages);
            arrayOfImages.forEach(url=>{
               $('main').empty();
            });

            



    });
});

