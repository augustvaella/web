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
        var index = 0;
        dic_item.forEach(function(e){
            item_element.append(
                $("<span class='" + index + "'>")
                .text(e)
                .css({
                    "margin-left": "0.5em",
                })
            );
            index += 1;
        });

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
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_SEJRJP + "'>").text("sejrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_BARRJP + "'>").text("barrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_ROGANRJP + "'>").text("roganrjp"));

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
            dataType: 'text',
            cache: false
        }).done(function(csv){
            var def = new jQuery.Deferred();
            def.promise()
            .then(function(csv){
                console.log("csv loaded.")

                def.array = new jQuery.Deferred();
                def.array.promise()
                .then(function(dic){
                    console.log("converting csv to Array succeeded.");
                    $("div[id='information']").text("Loaded CSV Dictionary: " + dic.length);
                    data.dic = dic;
                    //finished loading csv    
                });

                var dic = $.csv.toArrays(csv);
                def.array.resolve(dic);
            });
    
            def.resolve(csv);

        }).fail(function(jqXHR, textStatus, erroThrown){
                console.log("csv loading failed.")
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
        var max = data.dic.length;

        var def = new jQuery.Deferred();
        def.progress(function(){
            //end of the dic
            if(index >= max){
                def.resolve();
                return;
            }

            //AND matching
            var d = data.dic[index];
            var found_word_count = 0;

            data.query.words.forEach(function(w){
                var r = new RegExp(w, 'g');
                var found_word = false;

                d.forEach(function(e){
                    if(e.match(r)){
                        found_word = true;
                    }                   
                });

                if(found_word){
                    found_word_count += 1;
                }
            });
            
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
            $("div[id='information']").text("Searching..." + data.count + " item(s)");
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
