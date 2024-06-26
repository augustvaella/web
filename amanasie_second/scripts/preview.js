$(function(){
    const convert_entity_letters = function(raw_text){
        let markdown_text = raw_text;
        markdown_text = markdown_text.replace(/&lt;/g, "<");
        markdown_text = markdown_text.replace(/&gt;/g, ">");
        markdown_text = markdown_text.replace(/&amp;/g, "&");
    
        return markdown_text;    
    }

    const convert_link_thumbnail = function(index, element){
        let d = $(element).data();
        //console.log(d);
        let c = `width: ${d.width}; height: ${d.height};`;
        let h = `<a href='${d.image}'><img src='${d.image}' alt='${d.image}' style='${c}' /></a>`;        
        $(element).html(h);
        return true;
    }

    const load = function(url){
        let markdown_text = "";

        $.ajax({
            type: "get",
            url: url,
            dataType:"text",
        }).done(function(text){
            markdown_text = text;
            //markdown_text = convert_entity_letters(text);
            $("div[id='main']").html(marked.parse(markdown_text));
            $("span[data-name='thumbnail link']").each(convert_link_thumbnail);

        }).fail(function(jqXHR, textStatus, errorThrown){
            text = "Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message;
            $("div[id='main']").text(text);
        });
    };

    $(document).ready(function(){
        const raw_url = window.location.href;
        const url_object = new URL(raw_url);
        let url = URL_MARKDOWN_INDEX;

        if(url_object.searchParams.has("name")){
            url = `${URL_MARKDOWN_FOLDER}/${url_object.searchParams.get("name")}.md`;
        }
        
        console.log(url);
        console.log(raw_url);
        $("div[id='main']").empty();
        load(url);    
    });
});
