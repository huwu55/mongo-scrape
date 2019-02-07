$(function(){
    $("#scrape").on("click", function(){
        $.ajax({
            url: "/scrape",
            method: 'POST'
           // data: {}
        }).then((response)=>{
        /*    if(response.length != 0){
                $("#article").empty();
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
                            .attr("data-article-id", response[i].id)
                            .append("Save Article");

                    h3.append(headline).append(saveButton);
                    cardHeader.append(h3);

                    var cardBody = $("<div>");
                    cardBody.attr("class", "card-body")
                            .append(response[i].summary);

                    card.append(cardHeader).append(cardBody);
                    $("#article").append(card);
                }
            } */
            console.log(response);
        });
    });

    $("#clear").on("click", function(){

    });
});