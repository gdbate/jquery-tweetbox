(function($){

	//browser detection from https://github.com/gabceb/jquery-browser-plugin
	!function(a,b){"use strict";var c,d;if(a.uaMatch=function(a){a=a.toLowerCase();var b=/(opr)[\/]([\w.]+)/.exec(a)||/(chrome)[ \/]([\w.]+)/.exec(a)||/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[],c=/(ipad)/.exec(a)||/(iphone)/.exec(a)||/(android)/.exec(a)||/(windows phone)/.exec(a)||/(win)/.exec(a)||/(mac)/.exec(a)||/(linux)/.exec(a)||/(cros)/i.exec(a)||[];return{browser:b[3]||b[1]||"",version:b[2]||"0",platform:c[0]||""}},c=a.uaMatch(b.navigator.userAgent),d={},c.browser&&(d[c.browser]=!0,d.version=c.version,d.versionNumber=parseInt(c.version)),c.platform&&(d[c.platform]=!0),(d.android||d.ipad||d.iphone||d["windows phone"])&&(d.mobile=!0),(d.cros||d.mac||d.linux||d.win)&&(d.desktop=!0),(d.chrome||d.opr||d.safari)&&(d.webkit=!0),d.rv){var e="msie";c.browser=e,d[e]=!0}if(d.opr){var f="opera";c.browser=f,d[f]=!0}if(d.safari&&d.android){var g="android";c.browser=g,d[g]=!0}d.name=c.browser,d.platform=c.platform,a.browser=d}(jQuery,window);

	function stripTags(string,allowed){
	  return string.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,function($0,$1){return ''});
	}

	function ltrim(str) {
	  return str.replace(/^[ \\s\u00A0 ]+/g,'');
	}

	function rawText(str){
  	var text=str
  		.replace(/<div><br><\/div>/g,'\n') //chrome newline
  		.replace(/<br>&nbsp;/g,'\n\n') //mozilla newline
  		.replace(/<div>|<br>|<\/p>/g,'\n'); //html tags
  	return ltrim(stripTags(text));
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
				$.error('Element is not a tweet box plugin');
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
				buttons:{
					tweet:'Tweet',
					reply:'Tweet Reply'
				},
				'info-size':16
  		},settings);
	    this.index=count++;
	    var sourceText=this.settings.default||stripTags($.trim($(this).html().replace(/<br>/g,'\n')));
			if($(this).css('position').toLowerCase()!='absolute')$(this).css('position','relative');
			var cover={position:'absolute',top:'0px',right:'0px',bottom:'0px',left:'0px'};
	    if($.browser.webkit||$.browser.mozilla){
	    	this.previousText=sourceText;
		    this.$editor=$('<div contenteditable="true" id="editor'+this.index+'" class="tweet-box-editable">').css(this.settings.css).css(cover).css({bottom:'40px',left:'0px','z-index':'99','overflow-x':'hidden','overflow-y':'auto','white-space':'pre'});
		    $(this).css({overflow:'hidden',padding:'0px'}).html(this.$editor);
		    this.$editor.focus();

		    this.$editor.bind('keyup',function(e){
		    	$(self).tweetbox('highlight',e.which);
		    });
		    this.$editor.bind('mouseup',function(e){
		    	$(self).tweetbox('highlight');
		    });

		    setTimeout(function(){
			    $('#editor'+self.index).focus();
			    $(self).tweetbox('highlight');
			  },25);

			}else{
		    this.$editor=$('<textarea id="editor'+this.index+'" class="tweet-box-editable">').css(this.settings.css).css({width:'100%',height:'100%'});

		    this.$editor.focus();
		    this.$editor.bind('keyup mouseup',function(e){
		    	var text=rawText(self.$editor.html()+self.settings.postfix);
	    		var avaiable=(self.settings.limit-text.length);
		    	$(self).tweetbox('info',avaiable<0?'<span style="color:red">'+avaiable+'</span>':avaiable);
		    });

				this.$placement=$('<div>').css(cover).css({bottom:'40px',left:'0px','z-index':'99','overflow':'hidden'}).html(this.$editor);
		    $(this).css({overflow:'hidden',padding:'0px'}).html(this.$placement);
		    setTimeout(function(){
			    $('#editor'+self.index).focus();
			  },10);
			}
		  this.$button=$('<button class="tweet-box-button">').css({position:'absolute',top:'5px',bottom:'5px',right:'1%',width:'25%',overflow:'hidden'}).html(this.settings.buttons[this.settings.action]).click(function(){
	    	var text=rawText(self.$editor.html()+self.settings.postfix);
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
    	var text=rawText(this.$editor.html())
    	var size=text.length;
    	var avaiable=(this.settings.limit-this.settings.postfix.length-size);
    	$(this).tweetbox('info',avaiable<0?'<span style="color:red">'+avaiable+'</span>':avaiable);

    	if(keyCode&&keyCode==13&&rSel[0].characterRange.start==0){
    		text=this.previousText;
    	}else if(keyCode&&keyCode==13&&rSel[0].characterRange.start==this.previousText.length+1){
    		text=$.trim(this.previousText)+'\n\n';
    	}else{
	    	for(var i=0;i<this.settings.highlight.length;i++)
	    		text=text.replace(this.settings.highlight[i].match,function(m){return '<span class="'+self.settings.highlight[i].class+'">'+m+'</span>'});
	    }
    	this.$editor.html(text);
    	this.previousText=text;
    	rangy.getSelection().restoreCharacterRanges(editor,rSel);
		},
		info:function(text){
	    this.$info.html(text);
	    return this;
		}
	};

}(jQuery));