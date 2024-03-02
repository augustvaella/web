const amanasie_preview = function(url){
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
        }).fail(function(jqXHR, textStatus, errorThrown){
            markdown_text = "Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message;
        });

        return markdown_text;
    };

    const t = load(url)
    console.log(t)
    $("div[id='main']").html(marked.parse(t));
};
