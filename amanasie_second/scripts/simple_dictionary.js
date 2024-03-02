$(function(){
    var initialize_data = function(){
        return {
            'dic': {},
            'query': "",
            'count': 0,
        };
    };
    var data = initialize_data();

    $(document).ready(function(){
        //disable button
        //show Loading
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_SEJRJP + "'>").text("sejrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_SEJRJP + "'>").text("barrjp"));
        $("select[name='dictionary']").append($("<option value='" + URL_CSV_DICTIONARY_SEJRJP + "'>").text("roganrjp"));

    });

    $("body").on("click", "select[name='dictionary']", function(){
        const url = $("select[name='dictionary']").val();
        data = initialize_data();

        $("div[id='information']").text("Loading...");

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
