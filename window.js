$(document).ready(function () {
objectUrl = "http://www.baidu.com"
cur_filename= "http://www.baidu.com"
    $("#logs").hide();
    $("#dl_links").hide();
    $("#status_bar").hide();
    $("#restart").hide();
    $("#restart").click(function(){
        chrome.runtime.reload();
    })
    $("#but_abort").click(function(){
        chrome.runtime.reload();
    })
    $("#input_url").focus(function(){
        if($("#input_url").val() == "Enter your URL here"){
            $("#input_url").val("")
            $("#input_url").css("color","#000000")
        }
    })
    $("#input_url").keydown(function(e){
        if(e.keyCode == 13){
            download_start()
        }
    })
    $("#download").click(function(e) {
        download_start()
    });
    function download_start(){
        $("#begin").slideUp();
        $("#logs").text("");
        $("#status_bar").slideDown();
        $("#dl_links").text("");
        $("#dl_links").show();
        current_download = 0;
        content_length = 1;
        id = null;
        id_key = null;
        input_url=$("#input_url").val();
        $("#logs").text("")
        $("#logs").slideDown();
        log_raise_prog_bar();
        var download_status = setInterval(function(){log_show_download_status()},200)
        function log_show_download_status(){
            log_progbar();
        }
        main(input_url);
    }
});