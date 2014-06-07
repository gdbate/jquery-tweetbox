# jquery.tweetbox #

### version 0.1.0 ###

----------

A user input for composting tweets with customizable #Hashtag, @Mention and URL highlighting.


![example showing highlighting](https://raw.githubusercontent.com/gdbate/jquery-tweetbox/master/example.png)

## Installation ##

```html
<script src="/path/to/jquery.js" type="text/javascript"></script>
<script src="/path/to/rangy-core.js" type="text/javascript"></script>
<script src="/path/to/rangy-textrange.js" type="text/javascript"></script>
<script src="/path/to/jquery.scrollfade.js"></script>
```

## Usage ##

First draw a div:

```html
<div id="compose">
default content on #this thing.
</div>
```

Then use the jquery plugin:

```javascript
$('#compose').tweetbox({css:{padding:'10px'}});
```

Also add your CSS classes
```css
.mention{color:red;background-color:rgba(255,0,0,.04);}
.hashtag{color:blue;background-color:rgba(0,0,255,.04);}
.url{color:green;background-color:rgba(0,255,0,.04);text-decoration:underline;}
div.tweet-box-bottom{background-color:#5facdd;}
button.tweet-box-button{
	background-color:#81c0e9;
	border:1px solid #3990cd;
	-webkit-border-radius:3px;
	-moz-border-radius:3px;
	border-radius:3px;
	color:white;
	font-weight:bold;
}
div.tweet-box-info{
	font-size:12px;
	color:rgba(255,255,255,.8);
}

```

## Configuration Variables ##

- **cb** *callback function for submission*
- **css** *CSS to apply to the editor*
- **default** *default content, good for replies (if not specified in HTML)*
- **postfix** *add content to an end of a tweet, reduces available characters*
- **limit** *change the twitter character limit (from 140)*
- **highlight** *regular expressions matching content and what span[class] they get*
- **action** *specify if it is a tweet or retweet*
- **button** *hash for button text key being the action*


## Using Configuration ##

```javascript
$('.compose').tweetbox({
  css:{
	color:'#888'
  },
  postfix:' #tweetrm'
});
```

Some other useful methods:

```javascript
//trigger highlighting refresh
$('.window').tweetbox('highlight');

//change info next to the submit button
$('.window').tweetbox('info','start typing!');
```


## Useful CSS Classes ##

- tweet-box-editable
- tweet-box-button
- tweet-box-info
- tweet-box-bottom

## Browser Support ##

New Chrome and Mozilla supported. IE does work, it just doesn't highlight anything..

## Known Bugs ##

- When doing newlines sometimes creates unexpected behavior.

## Todo ##

- IE highlighting
- better testing & support

----------

----------

-Greg Bate