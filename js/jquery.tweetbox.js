(function($){

	//browser detection from https://github.com/gabceb/jquery-browser-plugin
	!function(a,b){"use strict";var c,d;if(a.uaMatch=function(a){a=a.toLowerCase();var b=/(opr)[\/]([\w.]+)/.exec(a)||/(chrome)[ \/]([\w.]+)/.exec(a)||/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[],c=/(ipad)/.exec(a)||/(iphone)/.exec(a)||/(android)/.exec(a)||/(windows phone)/.exec(a)||/(win)/.exec(a)||/(mac)/.exec(a)||/(linux)/.exec(a)||/(cros)/i.exec(a)||[];return{browser:b[3]||b[1]||"",version:b[2]||"0",platform:c[0]||""}},c=a.uaMatch(b.navigator.userAgent),d={},c.browser&&(d[c.browser]=!0,d.version=c.version,d.versionNumber=parseInt(c.version)),c.platform&&(d[c.platform]=!0),(d.android||d.ipad||d.iphone||d["windows phone"])&&(d.mobile=!0),(d.cros||d.mac||d.linux||d.win)&&(d.desktop=!0),(d.chrome||d.opr||d.safari)&&(d.webkit=!0),d.rv){var e="msie";c.browser=e,d[e]=!0}if(d.opr){var f="opera";c.browser=f,d[f]=!0}if(d.safari&&d.android){var g="android";c.browser=g,d[g]=!0}d.name=c.browser,d.platform=c.platform,a.browser=d}(jQuery,window);

	function stripTags(string,allowed){
	  return string.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,function($0,$1){return ''});
	}

	function ltrim(str) {
	  return str.replace(/^[ \\s\u00A0 ]+/g,'');
	}

	function rawText(str,trim){
  	var text=str
  		.replace(/<br><div>/gi,'\n') //chrome not taking in account white-space:pre
  		.replace(/<div><br><\/div>/gi,'\n') //chrome newline
  		.replace(/<br>&nbsp;/gi,'\n\n') //mozilla newline
  		.replace(/<div>|<br>|<\/p>/gi,'\n'); //html tags
  	if($.browser.msie)
  		text=text.replace(/\n/g,' ').replace(/&nbsp;/g,' ').replace('  ',' ').replace('  ',' ');//ie shit
  	text=trim?$.trim(stripTags(text)):ltrim(stripTags(text));
  	console.log('----------',str,'--',text);
  	return text;
	}

	var count=0;
	$.fn.tweetbox=function(option){
		if(typeof(option)=='object'||typeof(option)=='undefined'){
      var args=(typeof(option)=='object'?[option]:[]);
			return this.each(function(){
			  return methods.init.apply(this,args);
			});
		}else if(typeof option=='string'&&typeof methods[option]=='function'){
      var args=Array.prototype.slice.call(arguments,1);
			return this.each(function(){
				return methods[option].apply(this,args);
				console.error('Element is not a tweet box plugin');
			});
		}else console.error('Requested tweet box method not found.',option);
	};

	var methods={
		init:function(settings){
	    var self=this;
	    this.settings=$.extend({
	    	cb:false,
	    	css:{'font-size':'inherit'},
	    	default:false,
	    	postfix:' #tweetrm',
	    	limit:140,
	    	highlight:[
					{match:/\B@\w+/g,class:'mention'},
					{match:/\B#\w+/g,class:'hashtag'},
					{match:/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,class:'url'}
				],
				action:'tweet',
				button:{
					tweet:'Tweet',
					reply:'Tweet Reply'
				}
  		},settings);
	    this.index=count++;
	    var sourceText=this.settings.default||stripTags($.trim($(this).html().replace(/<br>/g,'\n')));
			if($(this).css('position').toLowerCase()!='absolute')$(this).css('position','relative');
			var cover={position:'absolute',top:'0px',right:'0px',bottom:'0px',left:'0px'};
    	this.previousText=rawText(sourceText);
	    this.$editor=$('<div contenteditable="true" id="editor'+this.index+'" class="tweet-box-editable">').css(this.settings.css).css(cover).css({bottom:'40px',left:'0px','z-index':'99','overflow-x':'hidden','overflow-y':'auto','white-space':'pre'});
	    $(this).css({overflow:'hidden',padding:'0px'}).html(this.$editor);

	    this.$editor.bind('keyup',function(e){
	    	$(self).tweetbox('highlight',e.which);
	    });
	    this.$editor.bind('mouseup',function(e){
	    	$(self).tweetbox('highlight');
	    });

	    setTimeout(function(){
		    self.$editor.focus();
		    $(self).tweetbox('highlight');
		  },50);

		  this.$button=$('<button class="tweet-box-button">').css({position:'absolute',top:'5px',bottom:'5px',right:'1%',width:'25%',overflow:'hidden'}).html(this.settings.button[this.settings.action]).click(function(){
	    	var text=rawText(self.$editor.html(),true)+self.settings.postfix;
    		var avaiable=(self.settings.limit-text.length);
    		if(avaiable<0)$(self).tweetbox('info','<span style="color:red">Please shorten your tweet</span>');
    		else if(typeof self.settings.cb=='function') self.settings.cb(text);
		  });
		  this.$info=$('<div class="tweet-box-info">').css({position:'absolute',top:'5px',left:'1%',width:'72%',top:'50%','text-align':'right',display:'table-cell','vertical-align':'middle'}).html('X Characters Left');
		  this.$bottom=$('<div class="tweet-box-bottom">').css(cover).css({top:'auto',height:'40px','z-index':'100','overflow':'hidden'}).append(this.$button,this.$info);
		  $(this).append(this.$bottom)

		  var size=this.$info.css('font-size');
		  if(size.substr(-2)=='px')size=size.substr(0,size.length-2);
		  this.$info.css('margin-top','-'+Math.round(+size/2)+'px');
    	this.$editor.html(sourceText);
		},
		highlight:function(keyCode){
			var self=this;
			var editor=this.$editor.get()[0];
    	var rSel=rangy.getSelection().saveCharacterRanges(editor);
    	var start=rSel[0].characterRange.start;
    	var end=rSel[0].characterRange.end;
    	var text;

    	var formatted=false;
	  	//console.log('keyCode:',keyCode,'tl:',text.length,'pl:',this.previousText.length,'s:',rSel[0].characterRange.start,'e:',rSel[0].characterRange.end,text);
    	if(keyCode&&keyCode==13&&start==0){
    		text=this.previousText;
    	}else if(keyCode&&keyCode==13&&start==this.previousText.length+1){
    		text=ltrim(this.previousText)+'\n\n';
    	}else{
	    	text=rawText(this.$editor.html());
    	}
    	var avaiable=(this.settings.limit-this.settings.postfix.length-text.length);
    	if(keyCode&&keyCode==13&&$.browser.msie){
    		if(start){
	    		rSel[0].characterRange.start--;
	    		rSel[0].characterRange.end--;
	    	}
	    	$(this).tweetbox('info','<span style="color:white">Sorry, multiple lines not supported by IE.</span>');
	    }else
	    	$(this).tweetbox('info',avaiable<0?'<span style="color:red">'+avaiable+'</span>':avaiable);
  		formatted=text;
    	for(var i=0;i<this.settings.highlight.length;i++)
    		formatted=formatted.replace(this.settings.highlight[i].match,function(m){return '<span class="'+self.settings.highlight[i].class+'">'+m+'</span>'});
    	this.$editor.html(formatted||text);
    	this.previousText=text;
    	rangy.getSelection().restoreCharacterRanges(editor,rSel);
		},
		info:function(text){
	    this.$info.html(text);
	    return this;
		}
	};

}(jQuery));