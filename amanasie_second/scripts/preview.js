const amanasie_preview = function(){
    const convert = function(raw_text){
        let markdown_text = raw_text;
        markdown_text = markdown_text.replace(/&lt;/g, "<");
        markdown_text = markdown_text.replace(/&gt;/g, ">");
        markdown_text = markdown_text.replace(/&amp;/g, "&");
    
        return markdown_text;    
    }

    const load = function(url){
        let markdown_text = "";

        $.ajax({
            type: "get",
            url: url,
            dataType:"text",
        }).done(function(text){
            markdown_text = convert(text);
            $("div[id='main']").html(marked.parse(markdown_text));
        }).fail(function(jqXHR, textStatus, errorThrown){
            text = "Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message;
            $("div[id='main']").text(text);
        });
    };

    $(document).ready(function(){
        const raw_url = window.location;
        const search_params = new URLSearchParams(raw_url);
        let url = URL_MARKDOWN_INDEX;

        if(search_params.has("name")){
            url = `${URL_MARKDOWN_FOLDER}/${search_params.get("name")}.md`;
        }
        
        console.log(url);
        console.log(raw_url);
        $("div[id='main']").empty();
        load(url);    
    });
};
