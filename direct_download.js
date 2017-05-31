$(document).ready(function () {
	/*url = 'http://ws.acgvideo.com/0/c7/8793069-1.flv?wsTime=1495397284&platform=pc&wsSecret2=4e6124dd05daef07e28213ae93bd3b81&oi=1136845986&rate=1280'
	var client = new XMLHttpRequest();
	client.open('GET',url,true)
	client.setRequestHeader("Referer","http://www.bilibili.com/")
	client.responseType="arraybuffer"
	client.send()

	client.onreadystatechange = function() {
	    if(this.readyState == 4 && this.status == 200) {
	        var data = new Blob([client.response],{type: "image/png"})
	        console.log(data)
	        var objectUrl = URL.createObjectURL(data);
	        $("#download_link").attr("href",objectUrl);
	        $("#download_link").attr("download","haha.flv");
	    }
	}*/
	$("#logs").show();
	console.log("start")
	var url = 'http://bangumi.bilibili.com/web_api/get_source';
	var opts = {
	  'method': 'POST',
	  'headers': new Headers({}),
	  'body': 'episode_id=103882',
	};
	log_i("start download")
	var connection = new SocketFetch(url, opts);
/*
	var res = null;
	connection.fetch()
	.then((response)=>{res=response})*/

	connection.fetch()
	.then((response) => {
	  if (response.ok) {
	    response.blob().then((result) => {
	    	log_i("finish download")
	    	filename = "js.mp4"
			var objectUrl = URL.createObjectURL(result);
	        $("#dl_links").show();
	        $("#dl_links").append("<a href='"+objectUrl+"' target=_blank download='"+filename+"'>"+filename+"</a>");
	    })
	    .catch((cause) => {
	      console.log('Error during fetch', cause);
	    });
	  }
	})
	.catch((cause) => {
	   console.log('Error during fetch', cause);
	});
	log_raise_prog_bar()
	var download_status = setInterval(function(){log_show_download_status()},200)
	function log_show_download_status(){
		//console.log(current_download,content_length);
		log_progbar(connection._current_download,connection._content_length);
		//console.log(connection._current_download,connection._content_length);
/*		if(current_download>=content_length){
			//console.log("done")
			clearInterval(download_status);
		}*/
	}
})