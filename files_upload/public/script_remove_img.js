
// import $ from "jquery";
// const $ = require( "jquery" );

$('.close').on("click", function (){
    let link = $(this).prev().attr('src');
    $.ajax({
        url: "/profile/delete",
        method: "POST",
        data: { image : link },
    })
        .done(obj => console.log(obj));
});