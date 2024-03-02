$(function(){
    var data = {
        'dic': {},
        'query': "",
        'count': 0,
    };

    $(document).ready(function(){
        //disable button
        //show Loading
        $("div[id='information']").text("Loading...");

        $.ajax({
            url: URL_CSV_DICTIONARY_SEJRJP,
            type: 'get',
            dataType: 'text',
            cache: false
        }).done(function(csv){
            var def_init = new jQuery.Deferred();
            def_init.promise()
            .then(function(csv){
                console.log("csv loaded.")

                def_init.array = new jQuery.Deferred();
                def_init.array.promise()
                .then(function(dic){
                    console.log("converting csv to Array succeeded.");
                    $("div[id='information']").text("Loaded CSV Dictionary: " + dic.length);
                    data.dic = dic;
                    //finished loading csv    
                });

                var dic = $.csv.toArrays(csv);
                def_init.array.resolve(dic);
            });
    
            def_init.resolve(csv);

        }).fail(function(jqXHR, textStatus, erroThrown){
                console.log("csv loading failed.")
                $("div[id='information']").text("Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message);
        });
    });

    $("body").on("click", "button[name='search']", function(){
        data.query = $("input[name='query']").val();
        data.count = 0;
        $("div[id='result']").empty();
        $("div[id='information']").text("Searching...");

        var index = 0;
        var max = data.dic.length;

        var def = new jQuery.Deferred();
        def.progress(function(){
            if(index >= max){
                def.resolve();
                return;
            }
            
            $("div[id='result']").append(
                $("<div class='item' id='" + index + "'>").text("#" + index)
            );
            index += 1;
        });

        var interval_id = setInterval(function(){
            def.notify();
        });

        def.promise().done(function(){
            $("div[id='information']").text("Found " + data.count + " item(s).");
            clearInterval(interval_id);           
        });
    });

    //update = function()
    //search

    //$(button_search).on
    //deferred_search = $.deferred
    //.progress(searching)
    //.done()
    

    //update with setTimeout


})
