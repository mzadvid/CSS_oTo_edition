<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>


<script language="JavaScript" type="text/javascript">
oTo_CSS_modele = new Object();
oTo_CSS_modele['properties'] = new Object();
</script>

<script language="JavaScript" src="CSS_oTo_modele_properties_new.js" type="text/javascript"></script>

<script language="JavaScript" type="text/javascript">

// alert (oTo_CSS_modele['properties']['@font-face']['values_formtype']);

var liste_css_props = new Array();

for (nameprop in oTo_CSS_modele['properties'])
{
	liste_css_props.push(nameprop);
}
liste_css_props.sort();

/*
var newfile = 'var oTo_CSS_modele = new Object();<br>';
newfile += 'oTo_CSS_modele[\'properties\'] = new Object();<br>';
newfile += '<br>';
*/

var newfile = '';

var liste_valdescs = new Array('values_formtype', 'values_sample', 'explain_values_fr', 'explain_values_en', 'explain_fr', 'explain_en', 'url_w3schools', 'navigators_fr', 'navigators_en', 'hacks', 'javascript');

for (var a = 0; a < liste_css_props.length; a ++) 
{
	var cette_propriete = liste_css_props[a];
	var laproprioto = oTo_CSS_modele['properties'][cette_propriete];		

	newfile += '<a name="'+cette_propriete+'"></a><div style="width:1200px; display:block;"><h2><a href="#'+cette_propriete+'" onclick="document.getElementById(\'w3schools\').src = \'http://www.w3schools.com/cssref/'+laproprioto['url_w3schools']+'\';">oTo_CSS_modele[\'properties\'][\''+cette_propriete+'\']</a> = new Object();</h2></div>';	
	newfile += '<textarea id="'+cette_propriete+'___debut" style="display:none;"/>\n\noTo_CSS_modele[\'properties\'][\''+cette_propriete+'\'] = new Object();\n</textarea>';
	


	for (var ee=0; ee < liste_valdescs.length; ee++)
	{
		if (laproprioto[liste_valdescs[ee]] == null || laproprioto[liste_valdescs[ee]] == 'undefined')
			var value_a_add = '';
		else
			var value_a_add = laproprioto[liste_valdescs[ee]].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ --- /, '\n') ;
		
		newfile += '<div class="'+liste_valdescs[ee]+'" style="width:400px; display:block; float:left; text-align:right;">oTo_CSS_modele[\'properties\'][\'<strong>'+cette_propriete+'</strong>\'][\''+liste_valdescs[ee]+'\'] = </div>';
		newfile += '<textarea id="'+cette_propriete+'___'+liste_valdescs[ee]+'_debut" style="display:none;"/>oTo_CSS_modele[\'properties\'][\''+cette_propriete+'\'][\''+liste_valdescs[ee]+'\'] = </textarea>';
		newfile += '<div class="'+liste_valdescs[ee]+'" style="width:800px; display:block; float:left; text-align:left;"><textarea class="valeur" id="'+cette_propriete+'___'+liste_valdescs[ee]+'" style="width:800px; height:25px; display:block; float:left;" onchange="save_file();"/>'+value_a_add+'</textarea></div>'; //.replace(/&lt;/g, '<').replace(/&gt;/g, '>')+'\';
		newfile += '<textarea id="'+cette_propriete+'___'+liste_valdescs[ee]+'_fin" style="display:none;"/></textarea>';
		newfile += '<div class="'+liste_valdescs[ee]+'" style="display:block; width:1px; clear:both;"/></div>';
	
		if (a == 0)
		{
			if (ee == 0)
			{
				var optionsaffiche = '<option value="all">Toutes</option><option value=""> </option>';
				var optionsafficheplus = '<option value=""> </option>';
			}
			optionsaffiche += '<option value="'+liste_valdescs[ee]+'">'+liste_valdescs[ee]+'</option>';
			optionsafficheplus += '<option value="+'+liste_valdescs[ee]+'"> + '+liste_valdescs[ee]+'</option>';
		}
	}
	
	newfile += '';
}

optionsaffiche = '<p style="position:fixed; top:100px; right:30px;"><select onchange="affiche(this.value)">'+optionsaffiche+optionsafficheplus+'</select></p>';

function affiche (quel)
{
	if (quel != '')
	{
	//	alert (quel);
		var siplus = 0;
		if (quel.match(/\+/))
		{
			quel = quel.replace(/\+/g, '');
			siplus = 1;
		}
	
		if (quel == 'all')
		{
			for (div = 0; div < document.getElementsByTagName('div').length; div++)
			{
				document.getElementsByTagName('div')[div].style.display = 'block';
			}
		}
		else
		{
			if (siplus == 0)
			{
				for (div = 0; div < document.getElementsByTagName('div').length; div++)
				{
					if (!document.getElementsByTagName('div')[div].id.match(/^(main)|(css_area)|(css_w3schools_div)|(save_newfile_div)$/))
						document.getElementsByTagName('div')[div].style.display = 'none';
				}
			}
			
			var lesquels = new Array();
			if (quel.match(/|/))
				lesquels = quel.split('|');
			else
				lesquels[0] = quel;	
							
							
			for (quels = 0; quels < lesquels.length; quels ++)	
			{				
				for (div = 0; div < document.getElementsByClassName(lesquels[quels]).length; div++)
					document.getElementsByClassName(lesquels[quels])[div].style.display = 'block';
			}
		}
		
		
	}
}


function newfile_to_div ()
{
	document.getElementById('css_area').innerHTML = optionsaffiche+newfile; //.replace(/<br>/g, '<br>');
	
}
function save_file ()
{
	var toutesprops = document.getElementsByTagName('textarea');
	var valuechampall = ''; 
	
	for (var ii=0; ii< toutesprops.length; ii++)
	{
	//	var cetextareaid = ;
	
		if (toutesprops[ii].className == 'valeur')
			var ok_value = '"'+toutesprops[ii].value.replace(/"/g, "'").replace(/\n/g, ' --- ')+'";\n'; /*.replace(/&lt;/g, '<').replace(/&gt;/g, '>')*/
		else
			var ok_value = toutesprops[ii].value;

		valuechampall += ok_value;
	}
	
	window.frames['save_newfile'].document.getElementById('css_props').value = valuechampall;
	window.frames['save_newfile'].document.forms[0].submit();
	
}
</script>
<style type="text/css">
html, body, div#main {
	height:100%;
	font-size:12px;
	margin:Opx;
	padding:0px;
}
div#main {
width:auto;	
}
</style>
</head>

<body onload="newfile_to_div();">
<div id="main" style="position:relative; display:block; width:100%; height:100%">
    <div id="css_area" style="position:relative; display:block; width:100%; height:50%; max-height:50%; overflow:scroll;">
    &nbsp;
    </div>
    <div id="css_w3schools_div" style="position:relative; display:block; width:100%; height:50%;">
        <iframe id="w3schools" src="http://www.w3schools.com/cssref/" style="width:100%; height:100%;" frameborder="0" scrolling="yes"></iframe>
    </div>
    <div id="save_newfile_div" style="position:fixed; top:2px; right:30px; display:block; width:300px; height:30px;">
        <iframe id="save_newfile" name="save_newfile" src="tri_css_save.php" style="width:100%; height:100%;" frameborder="0" scrolling="yes"></iframe>
    </div>
</div>    
</body>
</html>
