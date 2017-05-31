function log_i(message){
	if(message.length <= 1000){
	    $("#logs").append("<p class='log_text' style='color:white'>"+message+"</p>");
	    $("#status_head").html("<p class='status_text' style='color:white'><b>[Yogurt]</b> "+message+"</p>");
	}
}
function log_e(message){
	if(message.length <= 1000){
	    $("#logs").append("<p class='log_text' style='color:red;font-weight:bold'>"+message+"</p>");
	    $("#status_head").html("<p class='status_text' style='color:white;font-weight:bold'><b>[Yogurt]</b> "+message+"</p>");
	    $("#body").animate({"backgroundColor":"#DB2C2C"},1000);
	    $("#restart").slideDown()
	}
}
function log_s(message){
	if(message.length <= 1000){
	    $("#logs").append("<p class='log_text' style='color:yellow;font-weight:bold'>"+message+"</p>");
	    $("#status_head").html("<p class='status_text' style='color:white;font-weight:bold'><b>[Yogurt]</b> "+message+"</p>");
	}
}
function log_raise_prog_bar(){
	$("#progbar").slideDown()
}
function log_progbar(){
	decrypt_perc = 30;
	decrypt_multi = 3;
	try{
		c = current_downloader._current_download;
		f = current_downloader._content_length;
		percentage = current_url_index/count_urls + 1/count_urls * c/f
		length_all = 55
		len_left = Math.floor(length_all * percentage)
		progschar = Array(len_left).join("&#9608;") + Array(length_all-len_left).join("-")
		$("#status_head").html("<p class='status_text' style='color:white'><b>[Yogurt]</b> Download in progress "+(current_url_index+1).toString()+"/"+count_urls.toString()+" "+(c/1024/1024).toFixed(2)+"/"+(f/1024/1024).toFixed(2)+"MB </p>");
	    $("#myBar").css({"width":(decrypt_perc+(100-decrypt_perc)*percentage).toString()+"%"});
	    $("#myBar").html("<font style='color:white;font-size:18px' align=center>"+Math.floor(decrypt_perc+(100-decrypt_perc)*percentage).toString()+"%</font>");
	}catch(e){
		console.log(cur_server_count)
	    $("#myBar").css({"width":(Math.min(decrypt_multi*cur_server_count,decrypt_perc)).toString()+"%"});
	    if(Math.min(decrypt_multi*cur_server_count,decrypt_perc)<6){
		    $("#myBar").html("<font style='color:black;font-size:18px' align=center>"+Math.min(decrypt_multi*cur_server_count,decrypt_perc).toString()+"%</font>");
		}else{
		    $("#myBar").html("<font style='color:white;font-size:18px' align=center>"+Math.min(decrypt_multi*cur_server_count,decrypt_perc).toString()+"%</font>");
		}
	}
}
