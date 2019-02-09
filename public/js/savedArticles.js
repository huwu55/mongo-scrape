$(function(){
    $("#clear").on("click", function(){
        $.ajax({
            url: "/clear",
            method: 'POST'
        })
        .then(response => {
            //console.log(response);
            $("#articles").empty();
            $("#articles").text("Uh Oh. Looks like we don't have any saved articles.");
        });
    });

    $("#articles").on("click", ".card .card-header .un-save", function(){
        var id = $(this).attr("data-article-id");
        var button = $(this);
        //console.log("id");
        $.ajax({
            url: `/unsaved/${id}`,
            method:'POST'
        })
        .then(response => {
            button.parent().parent().remove();
        });
    });

    $("#articles").on("click", ".card .card-header .articleComments", function(){
        var id = $(this).attr("data-article-id");
        //console.log(id);
        //$("#articleId").text(id);
        $("#articleId").attr("data-article-id", id);
        //console.log($("#articleId").attr("data-article-id"));
        $.ajax({
            url: `/showComments/${id}`,
            method:'POST'
        })
        .then(response => {
            console.log("showcomments:", response);
            var ul = $(".listComments");
            if(response.length != 0){
                ul.empty();
                // for(var i = 0; i < response.length; i++){
                //     var li = $("<li>");
                //         li.attr("class", "list-group-item note");
                //     var delButton = $("<button>");
                //         delButton.attr("class", "btn btn-danger btn-sm")
                //             .attr("type", "button")
                //             .text("X");
                //     li.append(response[i].body, delButton);
                //     ul.append(li);
                // }
            }
            else{
                ul.empty();
                ul.append('<li class="list-group-item">Be the first one to comment!</li>');
            }
        });
    });


    $(".saveComment").on("click", function(){
        var articleID = $("#articleID").attr("data-article-id");
        var comment = $("#newComment").val().trim();
        //console.log(comment);
        $.ajax({
            url: `/addComment/${articleID}`,
            method:'POST',
            data : {comment: comment}
        })
        .then(response => {
            $("#newComment").val("");
            //console.log("savecomment", response);
        });
    });

});