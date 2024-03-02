$(function(){
    const SEARCH_DELAY = 10;

    var initialize_data = function(){
        return {
            'dic': {},
            'query': initialize_query(),
            'count': 0,
        };
    };

    var initialize_query = function(){
        return {
            "words": [],
        };
    };

    //get a result element
    var get_item = function(dic_item, item_element){
        var header_element = $("<div class='header'>");

        header_element.append(
            $("<span class='word'>")
            .text(dic_item["word"])
            .css({
                "margin-left": "0.5em",
            })
        );

        header_element.append(
            $("<span class='part'>")
            .text(dic_item["part"])
            .css({
                "margin-left": "0.5em",
            })
        );

        item_element.append(header_element);

        item_element.append(
            $("<div class='translation'>")
            .text(dic_item["translation"])
            .css({
                "margin-left": "0.5em",
            })
        );

        item_element.append(
            $("<div class='composition'>")
            .text(dic_item["composition"])
            .css({
                "margin-left": "0.5em",
            })
        );

        item_element.append(
            $("<div class='etymology'>")
            .text(dic_item["etymology"])
            .css({
                "margin-left": "1.5em",
            })
        );

        var examples_div = $("<div class='examples'>");
        var examples_index = 0;
        dic_item["examples"].forEach(function(e){
            examples_div.append(
                $("<div class='" + examples_index + "'>")
                .text(`${e["sentence"]} ${e["translation"]}`)
                .css({
                    "margin-left": "0.5em",
                })
            );
            examples_index += 1;
        });
        item_element.append(examples_div);

        return item_element;
    };

    var get_query_array = function(query_string){
        return query_string.split(/[\s\n]+/).map((e) => e.trim());
    };

    //to avoid user's interrupting input
    var set_disabled_input = function(value){
        $("select[name='dictionary']").prop("disabled", value);
        $("input[name='query']").prop("disabled", value);
        $("button[name='search']").prop("disabled", value);
    };

    //--------

    var data = initialize_data();

    $(document).ready(function(){
        //append dictionaries
        $("select[name='dictionary']").append($("<option value=''>").text("Select Dictionary"));
        $("select[name='dictionary']").append($("<option value='" + URL_JSON_DICTIONARY_SEJRJP + "'>").text("sejrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_JSON_DICTIONARY_BARRJP + "'>").text("barrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_JSON_DICTIONARY_ROGANRJP + "'>").text("roganrjp"));

    });

    //change dictionary
    $("body").on("change", "select[name='dictionary']", function(){
        const url = $("select[name='dictionary']").val();
        if(!url){return;}

        data = initialize_data();

        $("div[id='information']").text("Loading...");

        //load dictionary
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            cache: false
        }).done(function(json){
            console.log("json loaded.")
            $("div[id='information']").text("Json Loaded.");
            data.dic = json;
        }).fail(function(jqXHR, textStatus, erroThrown){
                console.log("json loading failed.")
                $("div[id='information']").text("Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message);
        });
    });

    //search word(s) on the current dictionary
    $("body").on("click", "button[name='search']", function(){
        data.query = initialize_query();
        data.query.words = get_query_array($("input[name='query']").val());
        data.count = 0;

        $("div[id='result']").empty();
        $("div[id='information']").text("Searching...");
        set_disabled_input(true);

        var index = 0;
        var max = data.dic["content"].length;

        var def = new jQuery.Deferred();
        def.progress(function(){
            //end of the dic
            if(index >= max){
                def.resolve();
                return;
            }

            $("div[id='information']").text(`Searching(${index}/${max}) Found ${data.count} item(s)`);

            //AND matching
            var d = data.dic["content"][index];
            var found_word_count = 0;

            if(data.query.words.length > 0){
                data.query.words.forEach(function(w){
                    var r = new RegExp(w, 'g');
                    var found_word = false;
    
                    if(d["word"].match(r) || d["part"].match(r) || d["translation"].match(r) || d["composition"].match(r) || d["etymology"].match(r)){
                        found_word = true;
                    }
    
                    d["examples"].forEach(function(e){
                        if(e["sentence"].match(r) || e["translation"].match(r)){
                            found_word = true;
                        }                   
                    });
    
                    if(found_word){
                        found_word_count += 1;
                    }
                });    
            } else {
                //all words show if no query word
                found_word_count = data.query.words.length;
            }

            
            //not hit
            if(found_word_count < data.query.words.length){
                index += 1;
                return;
            }

            //hit
            $("div[id='result']").append(
                get_item(d, $("<div class='item' id='" + index + "'>"))
            );
            index += 1;
            data.count += 1;
        });

        //update
        var update = function(){
            def.notify();
            setTimeout(update, SEARCH_DELAY);
        };

        //finish
        def.promise().done(function(){
            $("div[id='information']").text("Found " + data.count + " item(s).");
            set_disabled_input(false);           
        });

        //start update
        setTimeout(update, SEARCH_DELAY);
    });
})
