$(function(){
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

                var def_init_array = new jQuery.Deferred();
                def_init_array.promise()
                .then(function(dic){
                    console.log("converting csv to Array succeeded.");
                    $("div[id='information']").text("Loaded CSV Dictionary: " + dic.length);
                    //finished loading csv    
                });

                var dic = $.csv.toArrays(csv);
                def_init.init_array.resolve(dic);
            });
    
            def_init.resolve(csv);

        }).fail(function(jqXHR, textStatus, erroThrown){
                console.log("csv loading failed.")
                $("div[id='information']").text("Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message);
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
