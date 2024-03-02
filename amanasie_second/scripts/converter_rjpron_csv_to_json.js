$(function(){
    var url = URL_CSV_DICTIONARY_SEJRJP;

    $("body").on("click", "button[name='convert']", function(){
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'text',
            cache: false
        }).done(function(csv){
            console.log("csv loaded.")
            var dic = $.csv.toArrays(csv);
            
            var def = new jQuery.Deferred();

            var json = {
                'content': [],
            };

            def.index = 0;
            def.progress(function(){
                if(def.index >= dic.length){
                    def.resolve(json);
                    return;
                }

                var e = dic[def.index];
                json.content.push({
                    'word': e[0],
                    'part': e[1],
                    'translation': e[2],
                    'composition': e[3],
                    'etymology': e[4],
                    'examples': e.slice(5).filter((w)=>w),
                });
                def.index += 1;
                $("div[id='information']").text("Converting... " + def.index + " / " + dic.length);
            });

            def.promise()
            .then(function(json){
                console.log("converting csv to Array succeeded.");
                $("div[id='information']").text("Loaded CSV Dictionary: " + dic.length);
                var j = JSON.stringify(json);
                var blob = new Blob([j],{'type':"text/plain"});
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.target = '_blank';
                a.download = 'dic.json';
                a.click();
            });

            var update = function(){
                def.notify();
                setTimeout(update, 10);
            };

            setTimeout(update, 10);
        }).fail(function(jqXHR, textStatus, erroThrown){
                console.log("csv loading failed.")
                $("div[id='information']").text("Failed: XMLHttpRequest:" + jqXHR.status + " Status: " + textStatus + " ErrorThrown:" + errorThrown.message);
        });
    });
});
