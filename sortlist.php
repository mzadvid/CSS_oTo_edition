<!DOCTYPE HTML>
<html>
<head>


<SCRIPT LANGUAGE="JavaScript">
N = (document.all) ? 0 : 1;
var ob;
function MD() {
if (N) {
ob = document.layers[s.target.name];
X=s.x;
Y=s.y;
return false;
}
else {
ob = event.srcElement.parentElement.style;
X=event.offsetX;
Y=event.offsetY;
}
} 
function MM() {
if (ob) { 
if (N) { 
ob.moveTo((s.pageX-X), (s.pageY-Y)); 
} 
else { 
ob.pixelLeft = event.clientX-X + document.body.scrollLeft; 
ob.pixelTop = event.clientY-Y + document.body.scrollTop; 
t.style.left=s.style.left;
t.style.top=s.style.top;
return false;
} 
} 
} 
function MU() { 
ob = null; 
} 

if (N) { 
document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
} 
document.onmousedown = MD; 
document.onmousemove = MM; 
document.onmouseup = MU; 
</script>
<style type="text/css">
<!--
a {  color: #000000; text-decoration: none}
a:hover {  color: #FF0000; text-decoration: none}
-->
</style>
<div id="s" style="position:absolute;left:100;top:150;">
<img src="dragnmenu.gif">
</div>
<body bgcolor="ffffff">
<div id="t" style="position:absolute;left:100;top:150;">
<table border=0>
<tr>
<th width=153>
<table border=0>
<tr>
<th>
<BR><BR>
<A HREF="#" onMouseOver="window.status='Description du lien 01';
return(true);" onMouseOut="window.status='';return(true);";>
Lien 01
</A>
<BR>
</th>
</tr>
<tr>
<th>
<A HREF="#" onMouseOver="window.status='Description du lien 02';
return(true);" onMouseOut="window.status='';return(true);";>
Lien 02
</A>
<BR>
</th>
</tr>
</th>
</tr>
</table>
</table>
</div>

Télécharger
</body>
</html>