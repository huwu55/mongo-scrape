$(function(){
    $("#scrape").on("click", function(){
        $.ajax({
            url: "/scrape",
            method: 'POST'
           // data: {}
        }).then((response)=>{
            //console.log(response.length);
            if(response.length != 0){
                $("#articles").empty();
                //$("#noArticle").remove();
                for(var i = 0; i < response.length; i++){
                    var card = $("<div>");
                    card.attr("class", "card");
                    
                    var cardHeader = $("<div>");
                    cardHeader = $("<div>");
                    cardHeader.attr("class", "card-header");

                    var h3 = $("<h3>");

                    var headline = $("<a>");
                    headline.attr("class", "article-link")
                            .attr("target", "_blank")
                            .attr("href", response[i].url)
                            .append(response[i].headline);

                    var saveButton = $("<button>");
                    saveButton.attr("type", "button")
                            .attr("class", "btn btn-success save")
                            .attr("data-article-id", response[i]._id)
                            .append("Save Article");

                    h3.append(headline, saveButton);
                    cardHeader.append(h3);

                    var cardBody = $("<div>");
                    cardBody.attr("class", "card-body")
                            .append(response[i].summary);

                    card.append(cardHeader, cardBody);
                    $("#articles").append(card);
                }
            }
            //console.log(response);
        });
    });

    $("#clear").on("click", function(){
        $.ajax({
            url: "/clear",
            method: 'POST'
        })
        .then(response => {
            //console.log(response);
            $("#articles").empty();
            $("#articles").text("Uh Oh. Looks like we don't have any new articles.");
        });
    });

    $("#articles").on("click", ".card .card-header h3 .save", function(){
        var id = $(this).attr("data-article-id");
        var button = $(this);
        //console.log(id);
        $.ajax({
            url: `/saved/${id}`,
            method:'POST'
        })
        .then(response => {
            button.parent().parent().parent().remove();
        });
    });
});