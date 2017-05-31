var id = null;
var id_key = null;
var current_downloader = null;
var current_url_index = 0;
var count_urls = 1;
var cur_server_count = 0;

function main(url){
	log_i("Yogurt contact at <a style='color:yellow' href='mailto:yogurtNetDL@gmail.com' target='_blank'>yogurtNetDL@gmail.com</a>")
	log_i("Homepage <a style='color:yellow' href='http://yogurtNetDL.github.io' target='_blank'>http://yogurtNetDL.github.io</a>")
	log_i("Start to decrypt the url. (This may take a few seconds.)");
	headers = {
		"referer": "yogurt",
		"request": "setup",
		'version': "0.1",
		"url": url,
		"content_length": 0
	}
	console.log("Send to server with headers",headers)
    toServer(headers,"").fetch().then((response) => {
    	if (response.ok) {
    		id = response.headers.get('id');
    		if((id != null)&(id != -1)){
    			id = response.headers.get('id');
    			id_key = response.headers.get('key');
    			cmd = response.headers.get('cmd');
    			next_url = response.headers.get('cmd_url');
    			method = response.headers.get('cmd_method')
    			next_headers = {}

    			console.log("Receive from server with headers")
    			temp = {}
    			for(var key of response.headers.keys())
    				{temp[key] = response.headers.get(key)}
    			console.log(temp)

    			for(var key of response.headers.keys()){
    				if(key.search("transfer_")>=0){
    					next_headers[key.replace("transfer_","")]=response.headers.get(key);
    				}
    			}
    			response.blob().then((result) =>{
    				go_next(cmd,method,next_url,next_headers,result);
    			}).catch((cause) => {
    				log_e("[Server error] During data blobing")
    			})
    		}else{
    			log_e("[Server error] Cannot assign an client ID")
		  		response.text().then((result) => {
			    	log_e(result)
			    })
    		}
   		}else{
   			log_e("[Server error]"+response.status)
	  		response.text().then((result) => {
		    	log_e(result)
		    })
		}
	}).catch((cause) =>{
			log_e("[Server error] Server maintenance.")
		}
	)
}

function go_next(cmd,method,url,headers,data_arrayBuffer){
if(cmd == 'grab'){
	if(method =="HEAD"){
		var opts = {
		  'method': "HEAD",
		  'headers': new Headers(headers),
		}
	}else{
		console.log("method,",method)
		var opts = {
		  'method': method,
		  'headers': new Headers(headers),
		  'body': data_arrayBuffer
		}
		console.log(data_arrayBuffer)
	}
	console.log("Send to video server with headers",headers,"method",method)
	var connection = new SocketFetch(url, opts);
	connection.fetch().then((response) => {
    	if (response.ok) {
    		next_headers = {"referer": "yogurt","request":"followup"}
			console.log("Received from video server with headers")
			temp = {}
			for(var key of response.headers.keys())
				{temp[key] = response.headers.get(key)}
			console.log(temp)

    		for(var key of response.headers.keys()){
    			next_headers["transfer_"+key.toLowerCase()] = response.headers.get(key);
    		}
    		next_headers['id'] = id
    		next_headers['key'] = id_key
    		next_headers['post_url'] = connection._request.url
    		
    		response.blob().then((result) =>{
    			console.log("Hearing from the server. ")
				console.log("Send to server with headers",next_headers)
	    		toServer(next_headers,result).fetch().then((response) => {
	    			console.log("MSG from server heard. Status "+response.status)
	    			if(response.ok){
	    				cmd = response.headers.get('cmd');
		    			next_next_url = response.headers.get('cmd_url');
		    			next_next_method = response.headers.get('cmd_method');
		    			next_next_headers = {}

						console.log("Received from server with headers")
						temp = {}
						for(var key of response.headers.keys())
							{temp[key] = response.headers.get(key)}
						console.log(temp)

		    			for(var key of response.headers.keys()){
		    				if(key.search("transfer_")>=0){
		    					next_next_headers[key.replace("transfer_","")]=response.headers.get(key);
		    				}
		    			}
		    			response.blob().then((result) =>{
		    				go_next(cmd,next_next_method,next_next_url,next_next_headers,result);
		    			}).catch((cause) => {
		    				log_e("[Server error] During fetching")
		    				log_e(cause)
		    			})
	    			}else{
				  		response.text().then((result) => {
					    	log_e("[Server error]"+response.status)
					    	log_e(result)
					    })
					}
	    		}).catch((cause) =>{
	    				log_e("[Server error] Server maintenance.")
	    			}
	    		)
    		}).catch((cause) =>{
    			log_e("[Video server error] During data blobing")
    			log_e(cause)
    		})
   		}else{
   			log_e("[Video server error]"+response.status)
	  		response.text().then((result) => {
		    	log_e(result)
		    })
		}
	}).catch((cause) => {
		log_e('[Video server error] During fetching')
		log_e(cause)
	})
}else if(cmd == 'download'){
	var reader = new FileReader();
	reader.onload = function() {
	    filename = reader.result;
	    filename = filename.replace(".\\","");
	    filename = filename.replace("./","");
	    urls = url.split("{{{SEP}}}")
	    count_urls = urls.length;
	    log_i("Decrypt finished. "+urls.length.toString()+" file(s) to download.")
		download_links(urls,headers,filename,0)
	}
	reader.readAsText(data_arrayBuffer);
}
else if(cmd == 'error'){
	log_e("[Server error] Internal Error")
}
else if(cmd == 'servermessage'){
	log_s("[Server error] Server Message")
	var reader = new FileReader();
	reader.onload = function() {
		msg = reader.result;
		log_s(msg);
	}
	reader.readAsText(data_arrayBuffer);
}
else{
	log_e("Command not understand "+cmd)
}
}

function download_links(urls,headers,filename,index){
	current_download = 0;
	content_length = 1;
	current_url_index = index;
	if(index>=urls.length){
		log_i("Finish downloading all files.")
		$("#restart").slideDown()
		$("#progbar").slideUp()
		//$("#body").animate({"backgroundColor":"#2CF06D"},1000);
		return
	}else{
		url = urls[index]
		if(urls.length>1){
			cur_filename = filename.replace(/(\.[\w\d_-]+)$/i, "_part"+index.toString()+'$1');
		}else{
			cur_filename = filename
		}
		if(cur_filename.length > 20){
			short_filename = cur_filename.slice(0,10)+"..."+cur_filename.slice(cur_filename.length-10,cur_filename.length)
		}
		else{
			short_filename = cur_filename
		}
		log_i("Downloading "+short_filename);
		console.log("filename",filename)
		var opts = {
		  'method': 'GET',
		  'headers': new Headers(headers),
		  'redirect': 'follow'
		};
		console.log("Download",cur_filename)
		console.log("url at ", url)
		console.log("headers",headers)
		var connection = new SocketFetch(url, opts);
		current_downloader = connection;
		connection.fetch()
		.then((response) => {
		  if (response.ok) {
		    response.blob().then((result) => {
		    	log_i("Finished downloading"+short_filename);
		        var objectUrl = URL.createObjectURL(result);
		        $("#dl_links").append("<a class=dl_hyberlink href='"+objectUrl+"' target=_blank download='"+cur_filename+"'><img src='imgs/video_icon.png' height='32' width='32'>"+short_filename+"</a><br>");
		        console.log("download next")
		        download_links(urls,headers,filename,index+1);
		    })
		    .catch((cause) => {
		      log_e('[Video server error] During data blobing');
		      log_e(cause)
		    });
		  }else{
		  	log_e("[Video server error]"+response.status)
		  }
		}).catch((cause) => {
			log_e('[Video server error] During fetching')
			log_e(cause);
		})
	}
}
function toServer(headers,body){
	cur_server_count += 1;
	log_progbar()
	if(document.getElementById('decrypt_prog') == null){
		$("#logs").append("<p id=decrypt_prog class='log_text' style='color:white'>Working hard !</p>");
	}else{
		alphabet = "!@#$%^&*"
		randomchar = Array(1).join(alphabet[Math.floor(Math.random()*8)])
		$("#decrypt_prog").append(randomchar);
	}

	url="http://47.88.228.184:5000/"
	//url="http://127.0.0.1:5000/"
	var opts = {
	  'method': 'POST',
	  'headers': new Headers(headers),
	  'body': body
	};
	var connection = new SocketFetch(url, opts);
	return connection
}

window.addEventListener('message', function(event) {
  console.log("main.js",event)
});
