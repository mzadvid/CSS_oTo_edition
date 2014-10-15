function bodyload (ressourceDOM) { 
	document.head.appendChild(ressourceDOM) ;

	// alert(' a ajouté : '+ressourceDOM.src);

};

function addEvent(element, event, fn) {
	if (element.addEventListener)
		element.addEventListener(event, fn, false);
	else if (element.attachEvent)
		element.attachEvent('on' + event, fn);
}


if (document.html_named_colors == null || document.html_named_colors == 'undefined')
{			
	var css_oto_named_colors = document.createElement('script');
	css_oto_named_colors.type = 'text/javascript';
	css_oto_named_colors.src = 'named_colors.js';
	
	addEvent(window, 'load', function(){ bodyload(css_oto_named_colors); });

}

if (document.oTo_CSS_modele == null || document.oTo_CSS_modele == 'undefined')
{
	var css_oto_modele = document.createElement('script');
	css_oto_modele.type = 'text/javascript';
	css_oto_modele.src = 'CSS_oTo_modele.js';
	
	addEvent(window, 'load', function(){ bodyload(css_oto_modele); /* alert (oTo_CSS_modele['properties']['border']['values_formtype']); */  });
	
	
}


CSS_OTO_EDITOR = {};

(function()
{ 

	if (window.all_CSS_edition == null)
		window.all_CSS_edition = new Object();

// début de scope local

	CSS_OTO_EDITOR = CSS_OTO_EDITOR || {};


// déclaration de la classe de makeform proprement dite
	CSS_OTO_EDITOR.form = 
    {
				
		reg_trim: /^\s*|\s*$/g,
		reg_nolines: /(\s+)/g,
    	reg_CSS_properties_fin: /\}/,
    	reg_CSS_name_properties_split: /\{/,
    	reg_CSS_properties_split: /;/,
    	reg_CSS_propertie_value_split: /:/,
		
    	reg_CSS_value_fin_parenthese: /\)/,
    	reg_CSS_value_dbt_parenthese_split: /\(/,
		
		reg_CSS_value_virgule_split: /,/, 
		reg_CSS_value_espace_split: / /,

		reg_isnumeric: /^[.0-9]+(px|em|%)?$/,
		reg_isnumericwithunit: /^[.0-9]+(px|em|%)$/,
		reg_numeric_val: /^([.0-9]+)(px|em|%)?$/,
		reg_numeric_unit: /^[.0-9]+(px|em|%)?$/,

		reg_isimage: /^url ?\(/,
		reg_image_src: /$.+\('?([^')]+)'?\).*$/,		
		
		reg_istext: /^[-a-z]+$/,
		
		liste_des_polices_remake: 0,
		uldespolices: null,
		
		liste_units_dimensions: new Array('px', 'em', '%'),	

		HTML_base_form_listepolice : '<input type="hidden" id="___id_a_remplacer___" value="___value_a_remplacer___"/><div id="___id_a_remplacer____policemakemenu"><a id="___id_a_remplacer____policemakemenu_a" href="MemeEndroit" onmouseover="ListeDesPolices(this);">___value_a_remplacer___</a></div><div id="___id_a_remplacer____policeform"></div>',
		

		HTML_base_form_listechoix: '<input type="hidden" id="___id_a_remplacer____unit" value="___element_liste_selected___"/><div class="___classe_css___" id="InfosPage" onmouseover="InfosPage(this); CSS_OTO_EDITOR.form.valeurform_aff_infos(this, \'open\');" onmouseout="InfosPage(this); CSS_OTO_EDITOR.form.valeurform_aff_infos(this)"><a href="#MemeEndroit" id="___id_a_remplacer______a" class="InfosPageA">___element_liste_selected___</a><div id="___id_a_remplacer____InfosPage"><ul>___liste_de_choix___</ul></div></div>',
		
		HTML_base_form_listeproprietes: '<div class="___classe_css___" id="InfosPage" onmouseover="InfosPage(this);" onmouseout="InfosPage(this);"><a href="#MemeEndroit" id="___id_a_remplacer______a" class="InfosPageA">___element_liste_selected___</a><div id="___id_a_remplacer____InfosPage"><ul>___liste_de_choix___</ul></div></div>',
		
		HTML_base_listechoix_elemt: '<li><a href="#MemeEndroit" onclick="CSS_OTO_EDITOR.form.set_value(\'___id_a_remplacer___\', this);">___element_choix___</a>___SiULDetail___</li>',

		HTML_base_form_numeric: '<input type="text" class="numeric" id="___id_a_remplacer___" value="___value_a_remplacer____numeric" onchange="CSS_OTO_EDITOR.form.set_value(\'___id_a_remplacer___\');" style="___styledisplay_a_remplacer____numeric" onmouseover="CSS_OTO_EDITOR.form.valeurform_aff_infos(this, \'open\')" onmouseout="CSS_OTO_EDITOR.form.valeurform_aff_infos(this)"/><input type="hidden" id="___id_a_remplacer____exval" value="___value_a_remplacer____numeric" />',
		

// déclaration des méthodes
	
	
	
		aff_choix_combine : function (obj) {
			
			var cetid = obj.id;
			
			var base_id = cetid.replace(/___c[0-9]+_div_a$/, '');
			var class_hide = base_id+'_tohide';
			var id_toview = cetid.replace(/_a$/, '');
			
			var id_div_menucombine = base_id+'_combine';
			
			var lesdivs = document.getElementsByClassName(class_hide);
			
			for (ttr= 0; ttr<lesdivs.length; ttr++)
			{
				lesdivs[ttr].style.display = 'none';
			}
			document.getElementById(id_toview).style.display = 'block';
		
			var lesamenu = document.getElementById(id_div_menucombine+'_InfosPage').getElementsByTagName('li');
			for (ttr= 0; ttr<lesamenu.length; ttr++)
			{
				lesamenu[ttr].className = '';
			}

			document.getElementById(cetid).parentNode.className = 'selected';
			
			
		},
		
		adapterLargeur : function (o)
		{
			if (document.divtmp == null)
			{
				document.divtmp = document.createElement('div');
				document.divtmp.style = "display:block; float:left; width:auto; margin:10px;";
				document.divtmp.id = "div_tmp";

				var conteneurdivtmp = document.createElement('div');
				conteneurdivtmp.style = "position:absolute; right:0%; bottom:0%; width:1px; height:1px; overflow:hidden; padding:0px;";
				
				conteneurdivtmp.appendChild (document.divtmp);
				document.body.appendChild(conteneurdivtmp);

			}

			var div = document.getElementById('div_tmp');
			var aeval = '';
			
			if (o == null)
			{
				var tousinputs = document.getElementsByTagName('input');
				
				for (rr=0 ; rr<tousinputs.length; rr++)
				{
					o = tousinputs[rr];
						
					if (o.type == 'text' && !o.id.match(/_colorhexa$/))
					{
						div.innerHTML = o.value;
						o.style.width = (div.clientWidth+3)+'px'; // + une petite marge de 10px
						
						// aeval = "CSS_OTO_EDITOR.form.adapterLargeur('"+o.id+"')";
						o.onfocus = function(){ self.adapterLargeur(this.id);}
					}
					
				}
				
			}
			else
			{
				if (typeof(o) == 'string')
					o = document.getElementById(o);
			
				div.innerHTML = o.value;
				o.style.width = (div.clientWidth+3)+'px'; // + une petite marge de 10px
				
			//	alert(o.value+' --- '+o.style.width);
				
				aeval = "CSS_OTO_EDITOR.form.adapterLargeur('"+o.id+"')";
				document.adalarge = setTimeout("eval(\""+aeval+"\")",300);
				
				o.onblur = function(){window.clearTimeout(document.adalarge)}
				
			}
		},
		
		getElementPos : function(e) {
			var e1=e, e2=e;
			var x=0, y=0;
			if(e1.offsetParent) {
				do {
					x += e1.offsetLeft;
					y += e1.offsetTop;
				} while(e1 = e1.offsetParent);
			}
			while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
				x -= e2.scrollLeft;
				y -= e2.scrollTop;
			}
			return [x, y];
		},
	
	
		getElementSize : function(e) {
			return [e.offsetWidth, e.offsetHeight];
		},


		navbottom : function (objid) {	
			var obj = document.getElementById(objid);
			
			if (document.getElementById('Menu_Nav_'+objid) != null)
				var idnav = 'Menu_Nav_'+objid;
			else
				var idnav = 'Menu_Nav_first_'+objid;
			
			var maxh = self.getElementPos(document.getElementById(idnav))[1] - 12 ;
							
			if (obj.style.marginTop != null)
				var margeH = new Number (obj.style.marginTop.replace(/px$/, ''));
			else
			{
	//			var margeH = 0;
				var margintop_computed = getComputedStyle(obj,null).getPropertyValue('margin-top').replace(/[^0-9]/g, '');
				var margeH = new Number(margintop_computed);
			}
			
			var newmarge_H = margeH+3;
			var margeTopOriginale = new Number (window.memostyle[objid+'_marginTop'].replace(/px/, ''));
			
			document.getElementById('Suivi').innerHTML = idnav+' (margeH) '+margeH+' ;;; (ul top) '+self.getElementPos(obj)[1]+' ?<= (maxh) '+maxh+' alors descend.';
			
			
//			if (newmarge_H <= (margeTopOriginale-20)) 
			if (self.getElementPos(obj)[1]  <= maxh) 
				obj.style.marginTop = newmarge_H+'px'; 
				
			else if (document.bouge) 
				clearInterval(document.bouge);
				
	//		document.getElementById('Suivi').innerHTML = self.getElementPos(obj)[1]+' <= '+maxh+' (max) ';
		},
		
		navtop : function (objid) {				
		
			var obj = document.getElementById(objid);
			var hauteurObj = self.getElementSize(obj)[1];
			

			if (document.getElementById('Menu_Nav_'+objid) != null)
				var idnav = 'Menu_Nav_'+objid;
			else
				var idnav = 'Menu_Nav_first_'+objid;
			
			var maxh = self.getElementPos(document.getElementById(idnav))[1] +self.getElementSize(document.getElementById(idnav))[1] + 10 ;
														
		//	alert (obj.style.marginTop);
		
			if (obj.style.marginTop != '')
				var margeH = new Number (obj.style.marginTop.replace(/px$/, ''));
			else
			{
	//			var margeH = 0;
				var margintop_computed = getComputedStyle(obj,null).getPropertyValue('margin-top').replace(/[^0-9]/g, '');
				var margeH = new Number(margintop_computed);
			}
		
			var newmarge_H = margeH-3;
			
			document.getElementById('Suivi').innerHTML = idnav+' (margeH) '+margeH+' ;;; (max) '+(maxh - hauteurObj)+' ?<= (ul top)'+self.getElementPos(obj)[1]+' alors monte.';
		
	//		if (newmarge_H >= (0 - hauteurObj))
			if ((maxh - hauteurObj) <= self.getElementPos(obj)[1])
				obj.style.marginTop = newmarge_H+'px'; 
			else if (document.bouge) 
				clearInterval(document.bouge);
				
		},


	
		make_scrolling : function (liobj) {
			var obj = liobj.getElementsByTagName('ul')[0];

			var obj_parent = liobj;
			var objul = obj;

			var rapport = '';
			
			
		//	liobj.onmouseout = function () { var objout = this; if (objout.getElementsByTagName('ul')[0] != null) objout.getElementsByTagName('ul')[0].style.display = 'none'; objout.onmouseout = function (){}; };
			
			if (obj_parent.nodeName.toLowerCase() == 'li')
			{
				var liparents = obj_parent.parentNode.getElementsByTagName('li');
				
				for (lf=0; lf < liparents.length; lf++)
				{
					var celifrere = liparents[lf];

					if (celifrere.parentNode.getElementsByTagName('li')[0].innerHTML.replace(/<[^>]+>/g, '').substr(0,100) == obj_parent.parentNode.getElementsByTagName('li')[0].innerHTML.replace(/<[^>]+>/g, '').substr(0,100))
					{
					//	rapport += 'meme UL, '+celifrere.parentNode.getElementsByTagName('li')[0].innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+' == '+obj_parent.parentNode.getElementsByTagName('li')[0].innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+'<br>\n';
						if (celifrere.innerHTML.replace(/<[^>]+>/g, '').substr(0,100) != obj_parent.innerHTML.replace(/<[^>]+>/g, '').substr(0,100))
						{
							var ulsdeceli = celifrere.getElementsByTagName('ul');
							for (uli=0; uli<ulsdeceli.length; uli++)
							{
								ulsdeceli[uli].style.display = 'none';
								
							}
							
					//		rapport += celifrere.innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+' != '+liobj.innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+' : ferme LI UL<br>\n';
						}
						else
						{
							if (celifrere.getElementsByTagName('ul')[0] != null)
							{
								celifrere.getElementsByTagName('ul')[0].style.display = 'block';

								if (document.resetposmenu == null) document.resetposmenu = new Object();
								if (document.resetposmenu['Menu_Nav_'+celifrere.getElementsByTagName('ul')[0].id] == null || document.resetposmenu['last'] != 'Menu_Nav_'+celifrere.getElementsByTagName('ul')[0].id)
								{
									document.resetposmenu['Menu_Nav_'+celifrere.getElementsByTagName('ul')[0].id] = 1;
									document.resetposmenu['last'] = 'Menu_Nav_'+celifrere.getElementsByTagName('ul')[0].id;
								}
							}
				//			rapport += celifrere.innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+' == '+liobj.innerHTML.replace(/<[^>]+>/g, '').substr(0,100)+' : OUVRE LI UL<br>\n';

						}
						
					}
				}
					
			}
		//	alert (obj_parent.nodeName.toLowerCase()+'\n'+rapport);
		//	document.getElementById('Suivi').innerHTML = obj_parent.nodeName.toLowerCase()+'<br>---'+rapport+'---<br><br><br>'+document.getElementById('Suivi').innerHTML;
			
			
			if (obj != null)
			{

				if (typeof(document.id_infospg_ul) == 'undefined')
					document.id_infospg_ul = 0;

				if (objul.id == '')
				{
					var good_ulid = 'infospg_ul'+document.id_infospg_ul;
					objul.id = good_ulid; 
				}
				else
					var good_ulid = objul.id;

			document.getElementById('Suivi').innerHTML += '<br>'+good_ulid+' ';

				if ( document.resetposmenu == null || document.resetposmenu['last'] == null || document.resetposmenu[document.resetposmenu['last']] == null || (document.resetposmenu['last'] != 'Menu_Nav_first_'+good_ulid && document.resetposmenu['last'] != 'Menu_Nav_'+good_ulid))	
				{			
				
			document.getElementById('Suivi').innerHTML += ' alors make scrolling... ';

					if (document.documentElement && document.documentElement.clientWidth) // Donc DOCTYPE
						var DocRef = document.documentElement; // Dans ce cas c'est documentElement qui est réfèrence
					else var DocRef = document.body; // Dans ce cas c'est body qui est réfèrence == =
				
					if (window.memostyle == null)
						window.memostyle = new Object();
								
					var scrollleft = DocRef.scrollLeft;
					var scrollTop = DocRef.scrollTop;
					var size_element = self.getElementSize(obj);
					var size_h_IP = size_element[0];
		
					var idnav = 'Menu_Nav_'+good_ulid;
					if (objul.parentNode.nodeName.toLowerCase() == 'div')
						idnav ='Menu_Nav_first_'+good_ulid ;

					if (document.resetposmenu == null) document.resetposmenu = new Object();
					if (document.resetposmenu[idnav] == null || document.resetposmenu['last'] != idnav)
					{
						document.resetposmenu[idnav] = 1;
						document.resetposmenu['last'] = idnav;
					}
	
//	document.getElementById('Suivi').innerHTML += document.resetposmenu['last']+'<br>'+document.getElementById('Suivi').innerHTML;
	
					if (size_h_IP > 0)
					{
						
						window.memostyle[good_ulid+'_display'] = objul.style.display;
						objul.style.display = 'block';
						
						var epaisscontour_val = getComputedStyle(objul,null).getPropertyValue('border-left-width').replace(/[^0-9]/g, '');
						var epaisscontour_valulparent = getComputedStyle(objul.parentNode.parentNode,null).getPropertyValue('border-left-width').replace(/[^0-9]/g, '');
						var epaiscontour = new Number (epaisscontour_val);
						var epaiscontour_ulparent = new Number (epaisscontour_valulparent);
		
		//				var rapp_epaisseur = '('+objul.style.borderLeftWidth+' ... '+objul.style.borderWidth+' ... '+objul.style.border+')';
						
						var size_element = self.getElementSize(objul);
						var size_h_element = size_element[0];
						var size_v_element = size_element[1];
						
		
						var pos_element = self.getElementPos(objul);
						var pos_h_element = pos_element[0];
						var pos_v_element = pos_element[1];
		
						var pos_v_bas = pos_v_element + size_v_element;	
						var bas_v_max = document.hautfenetre + scrollTop;
		
		//		alert (pos_v_bas+'('+pos_v_element+' + '+size_v_element+') >? '+bas_v_max+' ('+document.hautfenetre+' + '+scrollTop+')');
		//		alert ('ul no : '+ul+'\nposition = '+pos_element.join(' x ')+'\nsize = '+size_element.join(' x ')+'\nposition basse = '+pos_v_bas+',  max possible en bas = '+bas_v_max);
				
						if (window.memostyle[good_ulid+'_height'] == null)
						{		
							window.memostyle[good_ulid+'_position'] = objul.style.position;
							window.memostyle[good_ulid+'_top'] = objul.style.top;
							window.memostyle[good_ulid+'_height'] = objul.style.height;
							window.memostyle[good_ulid+'_width'] = objul.style.width;
							window.memostyle[good_ulid+'_overflowY'] = objul.style.overflowY;
							window.memostyle[good_ulid+'_overflowX'] = objul.style.overflowX;
							window.memostyle[good_ulid+'_marginTop'] = objul.style.marginTop;
							window.memostyle[good_ulid+'_marginLeft'] = objul.style.marginLeft;
							window.memostyle[good_ulid+'_zIndex'] = objul.style.zIndex;
						}
		
						objul.style.display = window.memostyle[good_ulid+'_display'];

		
						if (pos_v_bas > bas_v_max)
						{
						 // Essaie par au-dessus : 
							var pos_v_ob_sidessus = pos_v_element - 20 - size_v_element;
							var max_v_siaudessus = scrollTop;
							
							if (pos_v_ob_sidessus > max_v_siaudessus)
							{
	//	document.getElementById('Suivi').innerHTML = pos_v_ob_sidessus+' > '+max_v_siaudessus+' : assez de place au dessus...';
								
								objul.style.marginTop = '-'+(size_v_element)+'px';
								
							}
							else
							{
								// si place en dessus est plus petit que place en dessous
		
								var hauteur_dispo_bas = (scrollTop+document.hautfenetre) - pos_v_element;
								var hauteur_dispo_haut = pos_v_element - scrollTop;
								
								if (hauteur_dispo_haut < hauteur_dispo_bas)
								{
	//	document.getElementById('Suivi').innerHTML = hauteur_dispo_haut+' > '+hauteur_dispo_bas+' : pas assez de place au dessus, plus de place en bas que en haut';
																	
							//		objul.style.height = (hauteur_dispo_bas-10)+'px';	
									var margintop_ulnav0 = '12px';	
									
									if (objul.parentNode.nodeName.toLowerCase() == 'div' && objul.parentNode.getElementsByClassName('Menu_Nav')[0] != null && document.getElementById('Menu_Nav_first_'+good_ulid) != null)
										document.getElementById('Menu_Nav_first_'+good_ulid).style = 'position:absolute; z-index:10; top:0px; left:0px; margin-top:'+margintop_ulnav0+';';
								}
								else
								{
								//	var heightobj = hauteur_dispo_haut-20+10;
									
									if (objul.parentNode.nodeName.toLowerCase() == 'div' && objul.parentNode.getElementsByClassName('Menu_Nav')[0] == null)
										var heightobj = size_v_element;
									else
										var heightobj = size_v_element-10;
		
									objul.style.marginTop = '-'+(heightobj)+'px';
									
									var margintop_ulnav0 = '-30px';		
	
									if (objul.parentNode.nodeName.toLowerCase() == 'div' && objul.parentNode.getElementsByClassName('Menu_Nav')[0] != null && document.getElementById('Menu_Nav_first_'+good_ulid) != null)
										document.getElementById('Menu_Nav_first_'+good_ulid).style = 'position:absolute; z-index:10; top:0px; left:0px; margin-top:'+margintop_ulnav0+';';
									
	//	document.getElementById('Suivi').innerHTML = hauteur_dispo_haut+' > '+hauteur_dispo_bas+' : pas assez de place au dessus, plus de place en haut...'+heightobj;
								}
								
								
								if (memo_nav_created == null)
									var memo_nav_created = new Object();
								
								if (memo_nav_created['Menu_Nav_'+good_ulid] == null)
								{
									var divgobottom = document.createElement('a');
									var divgotop = document.createElement('a');
									var divnavul = document.createElement('span');
									var divespacebtn = document.createElement('li');
									
									divgobottom.innerHTML = 'V';
									divgotop.innerHTML = 'V';
									
									divgobottom.href = '#MemeEndroit';
									divgotop.href = '#MemeEndroit';
									
									divnavul.className = 'Menu_Nav';
									divnavul.id = idnav;
										
									divnavul.style = '';
									divgotop.style = 'transform:rotate(180deg); line-height:8px;';
									divgobottom.style = 'line-height:8px;';
									
									divnavul.onmouseover = function () { obj.style.display = 'block' };
									divgobottom.onmouseover = function () { obj.style.display = 'block' };
									divgotop.onmouseover = function () { obj.style.display = 'block' };
		
									divgobottom.onmousedown = function () { var obj=this.parentNode.id.replace(/^Menu_Nav_(first_)?/, ''); document.bouge = setInterval("CSS_OTO_EDITOR.form.navbottom(\""+obj+"\");", 16 ) };
									divgotop.onmousedown = function () { var obj=this.parentNode.id.replace(/^Menu_Nav_(first_)?/, ''); document.bouge = setInterval("CSS_OTO_EDITOR.form.navtop(\""+obj+"\");", 16 ) };
		
									divgobottom.onmouseup = function () { if (document.bouge) clearInterval(document.bouge)};
									divgotop.onmouseup = function () { if (document.bouge) clearInterval(document.bouge)};
									
									divnavul.appendChild(divgotop);
									divnavul.appendChild(divgobottom);
									
									var left_ul = self.getElementPos(objul)[0];
									var left_li = self.getElementPos(objul.parentNode)[0];
									
									
									var marginleft_MNav = (left_ul - epaiscontour) - (left_li + (epaiscontour_ulparent * 2)) ;
									
									
									if (objul.parentNode.nodeName.toLowerCase() == 'div' && objul.parentNode.getElementsByClassName('Menu_Nav')[0] == null)
									{
										
										divnavul.style = 'position:absolute; z-index:10; top:0px; left:0px; margin-top:'+margintop_ulnav0+';';
										objul.parentNode.appendChild (divnavul);
										
									}
									else if (objul.parentNode.getElementsByClassName('Menu_Nav')[0] == null)
									{
									//	alert (left_ul+' - '+left_li+' - '+epaiscontour+' \ncontour ul parent :  '+epaiscontour_ulparent);
										divnavul.style = ' margin-left:'+(marginleft_MNav-20)+'px; /* right:10px; */';
										objul.parentNode.insertBefore (divnavul, objul);
									}
									memo_nav_created['Menu_Nav_'+good_ulid] = 'ok';
									
		
							//		alert ('Menu_Nav_'+good_ulid+' \parentnode: '+objul.parentNode.nodeName+'\nzIndex: '+divnavul.style.zIndex);
								
								}
							}
						}
						else
						{
							
	//			document.getElementById('Suivi').innerHTML = pos_v_bas+' !> '+bas_v_max+' : assez de place en dessous...';
	
							objul.style.height = window.memostyle[good_ulid+'_height'];
							objul.style.width = window.memostyle[good_ulid+'_width'];
			
							objul.style.overflowX = window.memostyle[good_ulid+'_overflowX'];
							objul.style.overflowY = window.memostyle[good_ulid+'_overflowY'];
							objul.style.marginTop = window.memostyle[good_ulid+'_marginTop'];
							objul.style.top = window.memostyle[good_ulid+'_top'];
							objul.style.position = window.memostyle[good_ulid+'_position'];
						
							document.isopeninfospage = null;
						}
						
						document.id_infospg_ul ++;
						
					}
					
					else
					{
						var les_MenusNavElmts = obj.getElementsByTagName('span');
						for (li=0; li < les_MenusNavElmts.length; li++)
						{
							var ceNavElement = les_MenusNavElmts[li];
							var ceNavElement_id = ceNavElement.id;
							
							if (ceNavElement.className == 'Menu_Nav')
							{
								ceNavElement.parentNode.removeChild(ceNavElement);
							}
							
						}
						
						memo_nav_created == null;
						
						var good_ulid = objul.id;
						
						objul.style.height = window.memostyle[good_ulid+'_height'];
						objul.style.width = window.memostyle[good_ulid+'_width'];
		
						objul.style.overflowX = window.memostyle[good_ulid+'_overflowX'];
						objul.style.overflowY = window.memostyle[good_ulid+'_overflowY'];
						objul.style.marginTop = window.memostyle[good_ulid+'_marginTop'];
						objul.style.top = window.memostyle[good_ulid+'_top'];
						objul.style.position = window.memostyle[good_ulid+'_position'];
					//	objul.style.display = window.memostyle[good_ulid+'_display'];
					//	objul.style.zIndex = window.memostyle[good_ulid+'_zIndex'];
					
						document.isopeninfospage = null;
					}
						
			//		obj_parent.style.overflow = 'visible'; // window.memostyle['parentobj_overflow'];
				}
				else
				{
					document.getElementById('Suivi').innerHTML += ' scrolling is on : '+document.resetposmenu['last']+' '+document.resetposmenu[document.resetposmenu['last']];
					
				}
			}
		},
		
		menunav_reset : function (obj) {
			
			var les_MenusNavElmts = obj.getElementsByTagName('span');
			for (li=0; li < les_MenusNavElmts.length; li++)
			{
				var ceNavElement = les_MenusNavElmts[li];
				var ceNavElement_id = ceNavElement.id;
				
				if (ceNavElement.className == 'Menu_Nav')
				{
					ceNavElement.parentNode.removeChild(ceNavElement);
				}
				
			}
			memo_nav_created = 'reset'; 
			memo_nav_created = null;
			document.resetposmenu = 'reset'; 
			document.resetposmenu = null;	

			document.getElementById('Suivi').innerHTML += ' -> reset';
		},
		
		sort_liste_valeur:function(obj) {
		
			if (window.memostyle == null) window.memostyle = new Object(); 
			
			document.getElementById(self.form_in_div).className = 'unselectable'; // '-moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;  user-select: none;';					
			
			var objparent = obj.parentNode.parentNode.parentNode.parentNode;

			document.onmouseup = function (){
				
				document.getElementById(self.form_in_div).className = '';
				var class_sort = document.getElementById(window.sort_on_id).className;
				var obj_a_deplacer = document.getElementById('divmovetmp').firstChild;
				var id_a_deplacer = obj_a_deplacer.id;			
			
				var idbeforepour = document.getElementById(window.sort_on_id).parentNode.getElementsByClassName(document.getElementById(window.sort_on_id).className);
				var obj_element_before = '';
				
				for (ze=0; ze<idbeforepour.length; ze++)
				{
					var keldiv = idbeforepour[ze].id;
					
					if (keldiv == window.sort_on_id)
					{
						if (document.getElementById(window.sort_on_id).parentNode.getElementsByClassName(document.getElementById(window.sort_on_id).className)[ze+1] != null)
							obj_element_before = document.getElementById(window.sort_on_id).parentNode.getElementsByClassName(document.getElementById(window.sort_on_id).className)[ze+1];
	
						ze = idbeforepour.length;
					}
				}
			
				if (obj_element_before != '')
					document.getElementById(window.sort_on_id).parentNode.insertBefore(obj_a_deplacer,obj_element_before);
				else
					document.getElementById(window.sort_on_id).parentNode.appendChild(obj_a_deplacer);

				document.onmousemove = '';
				document.onmouseup = '';
				
				var elementssorts = document.getElementsByClassName(class_sort);
				
				for (var esa=0; esa<elementssorts.length; esa++)
				{
					var cetes = elementssorts[esa];
					var cetesparent = cetes.parentNode;

					if (cetes.id.match(/^sort_as_first/))
						cetesparent.removeChild(cetes);
				}
				
				var elementssorts = document.getElementsByClassName(class_sort);
				for (var esa=0; esa<elementssorts.length; esa++)
				{
					var cetes = elementssorts[esa];
				//	alert (elementssorts[esa].id);
					
					cetes.onmouseover = '';
					cetes.onmouseout = '';
					
					if (cetes.id != null && window.memostyle[cetes.id+'_marginBottom'] != null)
						cetes.style.marginBottom = window.memostyle[cetes.id+'_marginBottom'] ;

				}
				

				document.body.removeChild(window.divmove);
			}
			
		//	objparent.style.visibility = 'hidden';
			
			var elementssortables = document.getElementsByClassName(objparent.className);
			
		//	alert(objparent.className+' ... '+document.getElementsByClassName(objparent.className)[0].id);
			var nbsortfirst = 0;
			
			for (var es=0; es<elementssortables.length; es++)
			{
				var cetes = document.getElementById(document.getElementsByClassName(objparent.className)[es].id);
				
				cetes.onmouseover = function (){ 					
					window.sort_on_id = this.id;  
					
					if (window.memostyle[this.id+'_marginBottom'] == null)
					{
						var valmargin = new Number (this.style.marginBottom.replace(/[a-z]+$/, '')); 
						window.memostyle[this.id+'_marginBottom'] = this.style.marginBottom; 
						window.memostyle[this.id+'_bigmarginBottom'] = (valmargin+self.getElementSize(objparent)[1])+'px';
					}
					this.style.marginBottom = window.memostyle[this.id+'_bigmarginBottom'] ;				
					this.onmouseout = function (){ if (window.memostyle[this.id+'_marginBottom'] != 'undefined') this.style.marginBottom = window.memostyle[this.id+'_marginBottom']; };
				};
				
				var cetesparent = cetes.parentNode;
				
				if (!cetesparent.firstChild.id.match(/^sort_as_first/))
				{
					var divsortasfirst = document.createElement('div');
					
					divsortasfirst.id = 'sort_as_first'+nbsortfirst;
					divsortasfirst.className = objparent.className;
					
					divsortasfirst.style.width = self.getElementSize(cetesparent.firstChild)[0]+'px';
					divsortasfirst.style.height = '15px';
					divsortasfirst.style.position = 'absolute';
					divsortasfirst.style.marginTop = '-15px';
					divsortasfirst.style.background = 'transparent';
					divsortasfirst.style.border = 'none';

			//		divsortasfirst.style.border = 'white 1px solid';
					
					
					divsortasfirst.onmouseover = function (){ 					
						window.sort_on_id = this.id;  
						
						this.style.position = 'relative';
						this.style.background = 'transparent';
						this.style.border = 'none';
						
						if (window.memostyle[this.id+'_marginBottom'] == null)
						{
							var valmargin = new Number (this.style.marginBottom.replace(/[a-z]+$/, '')); 
							window.memostyle[this.id+'_marginBottom'] = this.style.marginBottom; 
							window.memostyle[this.id+'_bigmarginBottom'] = (valmargin+self.getElementSize(objparent)[1])+'px';
						}
						this.style.marginBottom = window.memostyle[this.id+'_bigmarginBottom'] ;				
						this.onmouseout = function (){ this.style.position = 'absolute'; if (window.memostyle[this.id+'_marginBottom'] != 'undefined') this.style.marginBottom = window.memostyle[this.id+'_marginBottom']; };
					};
					
					cetesparent.insertBefore(divsortasfirst, cetesparent.firstChild);
					nbsortfirst ++;
				}
				
			}
			
					
			window.divmove = document.createElement('div');
			window.divmove.id = 'divmovetmp';
			window.divmove.style = 'position:absolute; display:block;float:left;top:'+(self.getElementPos(objparent)[1]+10)+'px;left:'+(self.getElementPos(objparent)[0]-5)+'px;';
			window.divmove.className = objparent.parentNode.className;

			window.divmove.appendChild(objparent);

			document.body.appendChild(window.divmove);

			document.onmousemove = function (event) {
			//	var x = event.clientX -5;
			//	var y = event.clientY + 10;
			
				var xy = self.getMousePagePos(event);
								
				var x = xy[0] - 5;
				var y = xy[1] + 10;
				
				window.divmove.style.left = x+'px';
				window.divmove.style.top = y+'px';
				
  			};
			
			 return false;

		},
	
		getMousePagePos : function (e) {
			var Mouse_X; // Variable globale Position X de la Mouse
			var Mouse_Y;
			var DocRef; // Variable pour IE uniquement
			
			
			if ( e) {
				// Dans ce cas on obtient directement la position dans la page
				Mouse_X = e.pageX;
				Mouse_Y = e.pageY ;
			}
			else {
			// Dans ce cas on obtient la position relative à la fenêtre d'affichage
			
				Mouse_X = event.clientX; 
				Mouse_Y = event.clientY; 
				
				if (document.documentElement && document.documentElement.clientWidth) // Donc DOCTYPE
					DocRef = document.documentElement; // Dans ce cas c'est documentElement qui est réfèrence
				else DocRef = document.body; // Dans ce cas c'est body qui est réfèrence == =
			
				//-- On rajoute la position liée aux ScrollBars
				Mouse_X += DocRef.scrollLeft;
				Mouse_Y += DocRef.scrollTop;
			}
			
			return (new Array (Mouse_X, Mouse_Y));

		},
		
		
		
		
		

		color_rgb_hexa:function (r,g,b) {
			return (
				(0x100 | Math.round(r)).toString(16).substr(1) +
				(0x100 | Math.round(g)).toString(16).substr(1) +
				(0x100 | Math.round(b)).toString(16).substr(1)
			);
		},

		color_hsv_hexa:function (h,s,v) {
			
					if(h === null) { return [ v, v, v ]; }
					var i = Math.floor(h);
					var f = i%2 ? h-i : 1-(h-i);
					var m = v * (1 - s);
					var n = v * (1 - s*f);
					switch(i) {
						case 6:break;
						case 0: r=v; g=n; b=m; break;
						case 1: r=n; g=v; b=m; break;
						case 2: r=m; g=v; b=n; break;
						case 3: r=m; g=n; b=v; break;
						case 4: r=n; g=m; b=v; break;
						case 5: r=v; g=m; b=n; break;
					}
			
			return (self.color_rgb_hexa(r,g,b));
		},

		color_picker:function (obj)
		{
			var ok_val_opacity = 1;
			var idobj = obj.id;
			
			var idvalobj = idobj.replace(/_colorhexa$/, '');
						
			var color_mode = '';
			
			var valueobj = document.getElementById(idvalobj).value;
			
			document.getElementById(idvalobj+'_divinputcolortext').style.display = 'block';
			
			var ok_val_picker = '' ;
			var ok_value_input = '';
			
			var reg_color_str = new RegExp ("^#([0-9a-f]{3,6})$", "gi");
			var reg_color_rgb = /^rgba?\(([.0-9]+),([.0-9]+),([.0-9]+),?([.0-9]+)?.*$/gi;
					
			var reg_color_hsv = /^hsv\(([.0-9]+),([.0-9]+),([.0-9]+)\)$/gi;
			var reg_color_named = new RegExp (self.html_named_colors_REGEXP(), "gi");
		
			if (valueobj.match(/ /))
			{
				var lavalall = valueobj;
				
				var lesvalsu = lavalall.split(' ');
				for (zza=0; zza < lesvalsu.length; zza++)
				{
					var cetvalsu = lesvalsu[zza];
					
					if (cetvalsu.match (reg_color_str) || cetvalsu.match (reg_color_rgb) || cetvalsu.match (reg_color_hsv) || cetvalsu.match (reg_color_named))
					{
						valueobj = cetvalsu;
					}
					
				}
				
			}
		
		
		
			var pickercolormode = '';
			var pickeropacity = '';
			var pickervaluehexa = '';
			var pickerfromfunc = '';
		
		
			if (valueobj.toLowerCase().match(reg_color_named)	)
			{ 
		//	alert (valueobj.toLowerCase()+' --- '+valueobj.toLowerCase()+' --- '+self.html_named_colors[valueobj.toLowerCase()]+' --- '+self.html_named_colors['green']+' \n\n'+reg_color_named);
				ok_val_picker = html_named_colors[valueobj.toLowerCase()].replace(self.reg_color_str, '$1');
				ok_value_input = ok_val_picker;
				
				pickercolormode = 'namedcolor';
				pickeropacity = 1;
				pickerfromfunc = 'fromString' ; 
			}
			
			else if (valueobj.match(reg_color_rgb))
			{ 
				var ok_val_picker_forT = valueobj.replace(reg_color_rgb, '$1,$2,$3');
				
				var val_opacity = valueobj.replace(reg_color_rgb, '$4');
			
				
				if (val_opacity != null && val_opacity != '' && valueobj.match(/rgba/))
				{
					pickeropacity = val_opacity;
					pickercolormode = 'rgba';
				}
				else
				{
					pickeropacity = 1;
					pickercolormode = 'rgb';
				}
				
				
				var valtoT = ok_val_picker_forT.split(',');
				ok_val_picker = ok_val_picker_forT;

				ok_value_input = self.color_rgb_hexa(valtoT[0], valtoT[1], valtoT[2]);
				
				pickerfromfunc = 'fromRGB' ; 
			}
			
			else if (valueobj.match(reg_color_hsv))
			{ 
				pickercolormode = 'hsv';
				var ok_val_picker_forT = valueobj.replace(reg_color_hsv, '$1,$2,$3');
				
				var valtoT = ok_val_picker_forT.split(',');
				
				var ok_val_picker = new Array();
				ok_val_picker[0] = new Number(valtoT[0]);
				ok_val_picker[1] = new Number(valtoT[1]);
				ok_val_picker[2] = new Number(valtoT[2]);
				
				
				ok_value_input = self.color_hsv_hexa(valtoT[0], valtoT[1], valtoT[2]);
				
				pickeropacity = 1;
				pickerfromfunc = 'fromHSV' ; 
			}
		
			else if (valueobj.match(reg_color_str))
			{ 
		
				ok_val_picker = valueobj.replace(reg_color_str, '$1');
				ok_value_input = ok_val_picker;
		
				pickercolormode = '#';
				pickeropacity = 1;
				pickerfromfunc = 'fromString' ; 
			}
			
			var colors_liste = new Array();
			colors_liste = self.colors_liste();	
		
			ok_value_input = ok_value_input.toUpperCase();
			document.getElementById(idobj).value = ok_value_input;
			
			var onclosepickerfunction = "document.getElementById('"+idvalobj+"_divinputcolortext').style.display = 'none';";
			
			document.myPicker = {};
			
			document.myPicker = new jscolor.color(document.getElementById(idobj), {opacity:pickeropacity, invisibleValue:true, onclosefunction : onclosepickerfunction, colors_to_liste : colors_liste});
			document.myPicker.color_mode = pickercolormode;
			
			document.myPicker.fromString(ok_value_input) ; 
			document.myPicker.showPicker();
			
			
		},

		
		html_named_colors_REGEXP : function () {
			var reg_html_named_colors = '';
			
			for (namecolor in html_named_colors)
			{
			//	var ok_name = html_named_colors[name];
				if (namecolor.match(/^[a-z]+$/i))
				{
					if (reg_html_named_colors != '')
						reg_html_named_colors += '|';
						
					reg_html_named_colors += namecolor.toLowerCase();	
				}
				
			}
			
			return (reg_html_named_colors);
			
		},

		colors_tri: function (colors_T){
			var colors_triees = colors_T;
			// ...
			
			return colors_triees;
			
		},

		colors_liste:function ()
		{
			var toutescss = '';
			if (self.liste_couleurs_polices_images != '' )	
				 toutescss += self.liste_couleurs_polices_images;	
				 
			toutescss += document.getElementById(self.id_a_maj).value;	
			toutescss = toutescss.replace(/\s+/gi, ' ');
			
			var forreglacolor = "("+self.forreg_iscolor.replace(/rgba.+color/i, 'rgba?[^)]+\\)')+")";
		
			var toutescouleurs =  new Array();
			toutescouleurs =  self.preg_match_all(forreglacolor, toutescss); // toutescss.replace(reg_lacolor, ',');
				
			if (toutescouleurs.length > 0)
			{
				toutescouleurs = self.array_unique(toutescouleurs);
				toutescouleurs = self.colors_tri(toutescouleurs);
				
			}
				
			return (toutescouleurs);
		},


		set_color : function (id_de_cette_valeur)
		{
			
			var thisopacity = document.myPicker.opacity;
			if (thisopacity == 'undefined' || thisopacity == null)
				thisopacity = 1; 
			var thisvaleurcolor = 'rgba('+(Math.round(document.myPicker.rgb[0]*255))+','+(Math.round(document.myPicker.rgb[1]*255))+','+(Math.round(document.myPicker.rgb[2]*255))+','+thisopacity+')';
			document.getElementById(id_de_cette_valeur).value = thisvaleurcolor; 
			self.set_value(id_de_cette_valeur);
				
			
			var textcolor = thisvaleurcolor.replace(/,[.0-9]\)$/, ',0)');
			var bgcolor = thisvaleurcolor.replace(/,[.0-9]\)$/, ',1)');
		
			document.getElementById(id_de_cette_valeur+'_colorhexa').style.color = textcolor;	
			document.getElementById(id_de_cette_valeur+'_colorhexa').style.backgroundColor = bgcolor;
			document.getElementById(id_de_cette_valeur+'_colorhexa').style.borderColor = bgcolor;
			document.getElementById(id_de_cette_valeur+'_colorhexa').style.opacity = thisopacity;
			
				
		},
					
				
		polices_liste:function ()
		{
			var toutescss = '';
			if (self.liste_couleurs_polices_images != '' )	
				 toutescss += self.liste_couleurs_polices_images;	
				 
			toutescss += document.getElementById(self.id_a_maj).value;	
			toutescss = toutescss.replace(/\s+/gi, ' ');
			
			var forreglapolice = "(font-family[^;]+;)";
		
			var touteslespolices =  new Array();
			var lespolices =  new Array();
			lespolices =  self.preg_match_all(forreglapolice, toutescss); // toutescss.replace(reg_lacolor, ',');
				
		//	alert (lespolices.join());	
			if (lespolices.length > 0)
			{
				for (var o=0; o<lespolices.length; o++)
				{
					var cettepropolice = lespolices[o].replace(/font-family *: *| *;/gi, '');
					var new_polices = new Array();
					
					if (cettepropolice.match(/,/))
					{		
						cettepropolice = cettepropolice.replace(/\s*,\s*/gi, ',');	
						cettepropolice = cettepropolice.replace(/^\s*|\s*$/gi, '');	
						new_polices = cettepropolice.split(',');	
					}
					else
					{
						cettepropolice = cettepropolice.replace(/^\s*|\s*$/gi, '');	
						new_polices[0] = cettepropolice;	
					}
					
					touteslespolices = touteslespolices.concat(new_polices);	
					
					
				}
				touteslespolices = self.array_unique(touteslespolices);
				touteslespolices = self.colors_tri(touteslespolices);
				
			//	alert (touteslespolices.join('\n'));
			}
				
			return (touteslespolices);
		},
		
		set_police : function (obj) {
			
			var leidobj = obj.id;
			
			if (leidobj.match(/_a([0-9]+)$/))
			{
				var leobj_id_ok_value = leidobj.replace(/_a([0-9]+)$/g, '_input$1');
				var leobj_ok_value = document.getElementById(leobj_id_ok_value).value;
			}
			else
				var leobj_ok_value = '';
		
			var ok_action = true;
			if (leobj_ok_value == '' && !confirm('Voulez-vous vraiment supprimer cette police de la liste ?'))
				ok_action = false;
			
			if (ok_action == true)
			{
				
				var leobj_id_a_valuer = leidobj.replace(/(_a[0-9]+)|(_delete)$/g, '');
				var idclass_liste_polices_champs = leobj_id_a_valuer.replace(/_p[0-9]+$/g, '');
			
				var value_actuelle = document.getElementById(leobj_id_a_valuer).value;
				
				var laaction = 'replace';
				
				for (r=0; r<document.getElementsByClassName(leobj_id_a_valuer+'_action').length ; r++) 
				{ 
					if (document.getElementsByClassName(leobj_id_a_valuer+'_action')[r].checked) 
					{ 
						laaction = document.getElementsByClassName(leobj_id_a_valuer+'_action')[r].value;
					}
				}
				
				if (laaction == 'before')
				{
					if (value_actuelle != '') leobj_ok_value += ','+value_actuelle;
				}
				
				if (laaction == 'after')
				{
					if (value_actuelle != '') leobj_ok_value = value_actuelle+','+leobj_ok_value;
				}
				
				if (laaction == 'delete')
					leobj_ok_value = '';
				
				document.getElementById(leobj_id_a_valuer).value = leobj_ok_value;
				
				var liste_champs = document.getElementsByClassName(idclass_liste_polices_champs);
				var newvalspolice = '';
				
				for (tt=0; tt<liste_champs.length;tt++)
				{
					var cetteval = liste_champs[tt].value;
					cetteval = cetteval.replace(/^\s$|\s*$/g, '');
					 
					if (cetteval != '')
					{
						if (newvalspolice != '')
							newvalspolice += ',';
						newvalspolice += cetteval;
					}
						
					
				}
				
				var lespoliceschoisies = self.array_unique(newvalspolice.split(','));
				
				document.getElementById(idclass_liste_polices_champs).value = lespoliceschoisies.join(',');
		
				window.ListeDesPolices(document.getElementById(idclass_liste_polices_champs+'_policemakemenu_a'));
				
				self.set_value(idclass_liste_polices_champs, document.getElementById(idclass_liste_polices_champs));
			
//				alert (leidobj+'\n'+idclass_liste_polices_champs+'\n-'+leobj_ok_value+'-');
		
			}
			
		},
	
	
		menu_police_explique : function (obj) {
					
			for (r=0; r<document.getElementsByClassName(obj.name).length ; r++) 
			{ 
				if (document.getElementsByClassName(obj.name)[r].checked) 
				{ 
					document.getElementById(obj.name+'explain').innerHTML = document.getElementsByClassName(obj.name)[r].title;
				}
			}
		
		},
		
		menu_police_set_action : function (obj) {
					
			for (r=0; r<document.getElementsByClassName(obj.name).length ; r++) 
			{ 
				document.getElementsByClassName(obj.name)[r].checked = false; 
			}
			obj.checked = true;
		},
		
		

		preg_match_all : function (regex, haystack) {
			var globalRegex = new RegExp(regex, 'gi');
			var globalMatch = haystack.match(globalRegex);
		
		   return globalMatch;
		},
		
		array_unique : function (array_a_uniquer) {
			var array_is_unique = array_a_uniquer.reverse().filter(function (e, i, arr) {  return arr.indexOf(e, i+1) === -1; }).reverse();
			return (array_is_unique);
		},

		oTo_html2DOM : function(html) {
			var frame = document.createElement('iframe');
			frame.style.display = 'none';
			
			document.body.appendChild(frame);
			frame.contentDocument.open();
			frame.contentDocument.write(html);
			frame.contentDocument.close();

		//	frame.onload = function (frame) {
				var el = frame.contentDocument.body.firstChild;
			//	var el = window.frames[0].document.getElementsByTagName('body')[0];
			//	alert (el);
				document.body.removeChild(frame);
				return el;
		//	}
			
			
		},
		
		lengthOf : function(obj) {
		// Get the size of an object
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		
		
		 explain : function ()
		 {
		//	self.explain();
		//	oTo_CSS_modele['properties'][css_property_name]['explain_values']
		
			lang = self.lang;
			
			if (oTo_CSS_modele['properties']['border']['explain_values_'+lang] == null)
			{
				var liste_css_props = new Array();
				for (nameprop in oTo_CSS_modele['properties'])
				{
					liste_css_props.push(nameprop);
				}
				liste_css_props.sort();

		//		alert(liste_css_props.join(' - '));

				var liste_valdescs = new Array('explain_values_en', 'explain_en', 'navigators_en', 'explain_values_'+lang, 'explain_'+lang, 'navigators_'+lang);
				
				for (var a = 0; a < liste_css_props.length; a ++) 
				{
					var cette_propriete = liste_css_props[a];
					var laproprioto = oTo_CSS_modele['properties'][cette_propriete];		
				
					for (var ee=0; ee < liste_valdescs.length; ee++)
					{
						var cetval = liste_valdescs[ee]; 
						var cetval_lg = liste_valdescs[ee].replace(/_[a-z]+$/, '');
						
						if (laproprioto[cetval] != null && laproprioto[cetval] != 'undefined')
						{
						//	alert(oTo_CSS_modele['properties'][cette_propriete][cetval_lg]+' = '+laproprioto[cetval]);
							oTo_CSS_modele['properties'][cette_propriete][cetval_lg] = laproprioto[cetval].replace(/</g, '&lt;').replace(/>/g, '&gt;');
						}
					}
					
				}
				
			}
			 
		 },
		 

		 navigators_img : function (prop_name, if_hover)
		 {
		//	alert(' - ' +oTo_CSS_modele['properties'][prop_name]['navigators']);		
			 if (oTo_CSS_modele['properties'][prop_name] != null)
			 {
				 var lesimg = oTo_CSS_modele['properties'][prop_name]['navigators'].replace(/ --- .+$/, '').split(/,/g);
				 var imginimg = '';
				 
		//	alert(' - ' +lesimg);		

			//	 alert (oTo_CSS_modele['properties'][prop_name]['navigators']+' \n'+lesimg);
				 for (yy= 0; yy<lesimg.length; yy++)
				 {
					imginimg += '<img src="http://www.w3schools.com/images/'+lesimg[yy]+'.gif" alt="'+lesimg[yy]+'" title="'+lesimg[yy]+'"/>';
					self.loadimage('http://www.w3schools.com/images/'+lesimg[yy]+'.gif');

				 }
			 }
	
	
		
			 var onmousov = '';	
			 if (if_hover != null)
			 {
			 	onmousov = ' onmouseover="CSS_OTO_EDITOR.form.navigators_aff_infos(this, 1);" onmouseover="navigators_aff_infos(this);"';
				imginimg = '<a target="_blank" href="http://www.w3schools.com/cssref/'+oTo_CSS_modele['properties'][prop_name]['url_w3schools']+'"'+onmousov+'>'+imginimg+'</a>';
			 }

			 return(imginimg);
		 },

		loadimage : function (url) {	
			if (document.imagesloaded == null)
			{
				document.imagesloaded = new Object();


				var loadimages_content = document.createElement('div');
				loadimages_content.style = 'height:1px; width:1px; overflow:hidden; position:absolute; right:0%; bottom:0%;'; //border:5px dotted #660000; background:#FF0000;
				
				document.getElementById(self.form_in_div).parentNode.insertBefore(loadimages_content, document.getElementById(self.form_in_div));
				
				self.loadimages_div = document.createElement('div');
				self.loadimages_div.style = 'margin:10px;'; //border:5px dotted #660000; background:#FF0000;
				
				loadimages_content.appendChild(self.loadimages_div);
				
				
			}
			if (document.imagesloaded[url] == null)
			{		
				document.imagesloaded[url] = 1;

				var imagehtml = document.createElement('img');
				imagehtml.src = url;
				
				self.loadimages_div.appendChild(imagehtml);
				
			}
		},

		navigators_aff_infos : function (obj, openorclose)
		{
			var id_base = obj.parentNode.id.replace(/_navigators/, '');
			
			if (openorclose == null)
			{
				document.getElementById(id_base+'_navigators_details').style.display = 'none';
				document.getElementById(id_base+'_aide_valeur').style.display = 'none';
				document.getElementById(id_base+'_aide_propriete').style.display = 'block';
			}
			else
			{
				document.getElementById(id_base+'_navigators_details').style.display = 'block';
				document.getElementById(id_base+'_aide_valeur').style.display = 'none';
				document.getElementById(id_base+'_aide_propriete').style.display = 'none';
			}
			
		},
		
		explain_all_values : function (obj,openorclose) 
		{
			
			var id_base = obj.parentNode.id.replace(/_navigators/, '');
				
			if (document.getElementById(id_base+'_navigators_details') != null)
			{
				if (openorclose == null)
				{
					document.getElementById(id_base+'_navigators_details').style.display = 'none';
					document.getElementById(id_base+'_aide_valeur').style.display = 'none';
					document.getElementById(id_base+'_aide_propriete').style.display = 'block';				
					
				}
				else
				{
					document.getElementById(id_base+'_navigators_details').style.display = 'none';
					document.getElementById(id_base+'_aide_valeur').style.display = 'block';
					document.getElementById(id_base+'_aide_propriete').style.display = 'none';
				}
			}
		},
				
		
		valeurform_aff_infos : function (obj, openorclose)
		{
			var id_base = '';
			
			if (obj.parentNode.id)
				id_base = obj.parentNode.id;
			
			if ((id_base == '' || !id_base.match(/_form/)) && obj.parentNode.parentNode.id)
				id_base = obj.parentNode.parentNode.id;
			
			if ((id_base == '' || !id_base.match(/_form/)) && obj.parentNode.parentNode.parentNode.id)
				id_base = obj.parentNode.parentNode.parentNode.id;
			
	//		alert (obj.id);
					
			id_base = id_base.replace(/_form/, '_explain');
			
			if (obj.id == '')
				var leobjid = obj.parentNode.id;
			else if (obj.id != 'InfosPage')
				var leobjid = obj.id;
			else
				var leobjid = obj.firstChild.id;
				
			var objid_T = leobjid.split(/___/g);
			var prop_name = objid_T[3];
			
		// alert (id_base+'\n'+leobjid+'\n'+prop_name);
			
			var num = id_base.replace(/^.+([0-9]+)$/, '$1');
			var valeur_a_explain = self.explain_cette_value (prop_name, num).replace(/^\s*|\s*$/g, '');
			
			
			if (document.getElementById(id_base+'_navigators_details') != null)
			{
				if (openorclose == null)
				{				
					if (self.opacite_aide != null)
						document.getElementById(id_base).style.opacity = self.opacite_aide;
						
					document.getElementById(id_base+'_navigators_details').style.display = 'none';
					document.getElementById(id_base+'_aide_valeur').innerHTML = oTo_CSS_modele['properties'][prop_name]['explain_values'].replace(/ --- /g, '<br>').replace(/ --- ([^:]+) :/g , ' --- <b>$1</b> :');				
					document.getElementById(id_base+'_aide_valeur').style.display = 'none';
					document.getElementById(id_base+'_aide_propriete').style.display = 'block';
				}
				else if (valeur_a_explain != '')
				{
					self.opacite_aide = document.getElementById(id_base).style.opacity;
					document.getElementById(id_base).style.opacity = 1;
	
					document.getElementById(id_base+'_navigators_details').style.display = 'none';
					document.getElementById(id_base+'_aide_valeur').innerHTML = valeur_a_explain;
					document.getElementById(id_base+'_aide_valeur').style.display = 'block';
					document.getElementById(id_base+'_aide_propriete').style.display = 'none';
				}
			}
		},
		
		
		
		 navigators_infos : function (prop_name)
		 {
			 var lesimg = oTo_CSS_modele['properties'][prop_name]['navigators'].replace(/ --- /g, '<br>').replace(/^[^<]+<br>/, '');
			 
			 return(lesimg);
		 },

		 explain_1line : function (prop_name)
		 {
			if (oTo_CSS_modele['properties'][prop_name] != null)
			{
				 var lesimg = oTo_CSS_modele['properties'][prop_name]['explain'].replace(/ --- .+$/, '');
				 return(lesimg);
			}
		 },

		 explain_restline : function (prop_name)
		 {
			if (oTo_CSS_modele['properties'][prop_name] != null)
			{
				 var lesimg = oTo_CSS_modele['properties'][prop_name]['explain'].replace(/^.+ --- (.+)$/, '$1').replace(/ --- /, '<br>');
				 return(lesimg);
			}
		 },

		
		escapeRegExp : function (str) {
			// Referring to the table here:
			// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
			// these characters should be escaped
			// \ ^ $ * + ? . ( ) | { } [ ]
			// These characters only have special meaning inside of brackets
			// they do not need to be escaped, but they MAY be escaped
			// without any adverse effects (to the best of my knowledge and casual testing)
			// : ! , = 
			// my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)
			
			var specials = [
				  "-", "[", "]" // order matters for these
				, "/", "{", "}", "(", ")", "*", "+", "?", ".", "\\", "^", "$", "|" // order doesn't matter for any of these
			  ], regex = RegExp('[' + specials.join('\\') + ']', 'g');
			
			return str.replace(regex, "\\$&");
			// test escapeRegExp("/path/to/res?search=this.that")
		  
		},
		
		 explain_cette_value : function (prop_name, num)
		 {
			 if (oTo_CSS_modele['properties'][prop_name] != null)
			 {
				 var lesimg = oTo_CSS_modele['properties'][prop_name]['explain_values'].split(/ --- /);
				 var infovoulue = '';
				 
				 
				 var listesamples = oTo_CSS_modele['properties'][prop_name]['values_sample'];
				 var listesamples_T = new Array();
				 
				 if (listesamples.match(/ /))
					listesamples_T = listesamples.split(/ /);
				else
					listesamples_T[0] = listesamples; 
					
				var imgsupp = new Array();	
								
				for (ss=0; ss<listesamples_T.length; ss++)
				{
					var sicettecombval = listesamples_T[ss];
					var imgsuppsupp = new Array();	
					
					if (sicettecombval != '' && oTo_CSS_modele['properties'][sicettecombval] != null)
					{
						imgsuppsupp = oTo_CSS_modele['properties'][sicettecombval]['explain_values'].split(/ --- /);
					}
					
					imgsupp.concat(imgsuppsupp);
					
					
				}
				
				lesimg.concat(imgsupp);
					
				 
				 for (yy= 0; yy<lesimg.length; yy++)
				 {
					 var info = lesimg[yy].replace(/^([^:]+):(.*)$/, '$1');
					 var voulue = lesimg[yy].replace(/^([^:]+):(.*)$/, '$2');
					 
					 for (aa=0; aa<listesamples_T.length; aa++)
					 {
						 var typevalue = listesamples_T[aa].replace(self.reg_trim, '');
						
					//	 alert (typevalue);
						 
						 if (typevalue != null && typevalue != '')
						 {
							 if (typevalue.match(/length|em|px|pt|cm|mm/))
							 {
							 	typevalue = 'length|em|px|pt|cm|mm';
						//		alert (typevalue);
							 }
							 
						//	 var reg_slash = new RegExp ("/","g");
							 
							 var reg_typevalue = new RegExp (self.escapeRegExp(typevalue),"g");
							 var regexiste = new RegExp( info+' : '+voulue , 'gi');
	
							 if (info.match(reg_typevalue) && !infovoulue.match(regexiste))
							 {
								 if (infovoulue != '')
									infovoulue += '<br>';
								 infovoulue += '<b>'.info+'</b> : '+voulue;
							 }
						 }
					 }
				 }
								
				 return(infovoulue);
			 }
		 },



		 explain_cette_value_liste : function (prop_name, typevalue)
		 {
			 
			 var lesimg = oTo_CSS_modele['properties'][prop_name]['explain_values'];
			 var sicombinevaluesample = new Array();
			 
			 if (oTo_CSS_modele['properties'][prop_name]['values_sample'].match(/ /))
			 	sicombinevaluesample = oTo_CSS_modele['properties'][prop_name]['values_sample'].split(/ /);
			else
			 	sicombinevaluesample[0] = oTo_CSS_modele['properties'][prop_name]['values_sample'];
			
			for (ss=0; ss<sicombinevaluesample.length; ss++)
			{
				var sicettecombval = sicombinevaluesample[ss];
				if (sicettecombval != '' && oTo_CSS_modele['properties'][sicettecombval] != null)
				{
					var values_explain_aaff = oTo_CSS_modele['properties'][sicettecombval]['explain_values'];

					lesimg += values_explain_aaff;
				}
				
			}
			
			 var lesimg_T = new Array();
			 
			 if (lesimg.match(/ --- /))
			 	lesimg_T = lesimg.split(/ --- /g);
			else
				lesimg_T[0] = lesimg;
				
			 var infovoulue = '';
			 
			 if (typevalue != null && typevalue != 'undefined' && typevalue != '')
			 {
				 typevalue = typevalue.replace(/^\s|\s$/g, '')
				 
			//	 alert (lesimg+'\n'+prop_name+'\n'+typevalue);
	
				 for (yy= 0; yy<lesimg_T.length; yy++)
				 {
					 var info = lesimg_T[yy].replace(/^([^:]+):(.*)$/, '$1').replace(/^\s|\s$/g, '');
					 var voulue = lesimg_T[yy].replace(/^([^:]+):(.*)$/, '$2').replace(/^\s|\s$/g, '');
					 
					 if (info == typevalue && voulue != '')
					 {
						 infovoulue += '<li>'+voulue+'</li>';
					 }
				 }
				 
				 if (infovoulue != '')
					infovoulue = '<ul class="explain">'+infovoulue+'</ul>';
					
			//	 alert (infovoulue);
			 }
				
			 return(infovoulue);
		 },

		menu_proprietes : function ()
		{
			lang = self.lang;

			if (self.menu_add_property == null || self.lang_ex != self.lang)
			{
				self.lang_ex = self.lang;
					
				var protype_lg = oTo_CSS_modele['properties_type_en'] ;
				if (oTo_CSS_modele['properties_type_'+lang] != null)
					var protype_lg = oTo_CSS_modele['properties_type_'+lang] ;
	
				var base_menu = oTo_CSS_modele['properties_type'];
				var menu_props = '';
				var ncateg = 0;
				
				for (categ in base_menu)
				{
					var liste_props = '';
					 
					for (prop_name = 0;  prop_name < base_menu[categ].length; prop_name++)
					{
						if (base_menu[categ][prop_name] != '' && !base_menu[categ][prop_name].match(/\(/))
						{
					//	alert (prop_name);
							liste_props += '<li><a href="#MemeEndroit" onclick="cssproperty_add(this)">'+base_menu[categ][prop_name]+'</a><ul class="explain"><li><p>'+self.explain_1line(base_menu[categ][prop_name])+'</p><p>'+self.navigators_img(base_menu[categ][prop_name])+'</p></li></ul></li>';
						}
						else if  (base_menu[categ][prop_name].match(/\(/))
							liste_props += '<li>'+base_menu[categ][prop_name]+'</li>';
						else 
							liste_props += '<li>&nbsp;</li>';
						
					}
					
					self.lang = 'fr';
					
					var nomcateg = oTo_CSS_modele['properties_type_'+self.lang][ncateg];
					
					menu_props += '<li><a href="#MemeEndroit">'+nomcateg+'</a><ul>'+liste_props+'</ul></li>';
					ncateg ++;
				}
				
				// menu_props ne comporte que ULs et LIs...
				// UL LI 1 : ajouter propri, supprimer, déplacer...
				var menu1 = '';
				
				menu1 += '<li>click and drag &bull; to move</li>';
				menu1 += '<li><a href="#MemeEndroit">'+self.translate('+ add a property')+'</a><ul>'+menu_props+'</ul></li>';
				menu1 += '<li><a href="#MemeEndroit" onclick="if(confirm(\''+self.translate('Do you really want to delete the '+base_menu+' property ?')+'\')) CSS_OTO_EDITOR.form.cssproperty_suppr(this);">'+self.translate('- delete '+base_menu+' property')+'</a></li>';
				
				var new_menu_props = self.HTML_base_form_listeproprietes.replace(/<\/?ul>/gi, '').replace(/___classe_css___/, 'menu_proprietes');
				
				new_menu_props = new_menu_props.replace(/___id_a_remplacer___/g, '');
				new_menu_props = new_menu_props.replace(/___element_liste_selected___/g, '&bull;');
				new_menu_props = new_menu_props.replace(/(id="InfosPage"[^<]+<a )/, '$1 onselectstart="return false;" onmousedown="CSS_OTO_EDITOR.form.sort_liste_valeur(this.parentNode);"');
				
// HTML_form_return += '<div id="css'+def_css_idx+'_property_btn'+css_property_idx+'_btnmove" onselectstart="return false;" onmousedown="CSS_OTO_EDITOR.form.sort_liste_valeur(this);"><span class="plus">∆</span></div>';
				
				
				new_menu_props = new_menu_props.replace(/___liste_de_choix___/g, '<ul>'+menu1+'</ul>');
				new_menu_props = new_menu_props.replace(/___explain_value___/g, '');
				
				self.menu_add_property = new_menu_props;
				
				var new_menu_props_newdef = self.HTML_base_form_listeproprietes.replace(/___classe_css___/, 'menu_proprietes_newdef');
				
				new_menu_props = new_menu_props.replace(/___id_a_remplacer___/g, '');
				new_menu_props = new_menu_props.replace(/___element_liste_selected___/g, '+ add a property;');
				
				new_menu_props = new_menu_props.replace(/___liste_de_choix___/g, menu_props);
				new_menu_props = new_menu_props.replace(/___explain_value___/g, '');
				
				self.menu_add_property = new_menu_props;
				
				
								
			}			
			
		},
		
		cssproperty_suppr : function (obj)
		{
			var test = '';
			test = obj.parentNode.id+'\n';
			test = obj.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.parentNode.id+'\n';
			
			alert (test);
			
		},
		
		cssproperty_add : function (obj)
		{
			var test = '';
			test = obj.parentNode.id+'\n';
			test = obj.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id+'\n';
			test = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id+'\n';
			
			alert (test);
			
		},
		
		
		
		aff_menu_properties : function (obj, nompropriete)
		{
			var id_obj = obj.id;
			
			document.getElementById(id_obj).getElementsByTagName('span')[0].style.display = 'none'; 
			
			var new_menu = self.oTo_html2DOM('<div id="CSS_oTo_form">'+self.menu_add_property.replace(/___property___/g, nompropriete)+'</div>');
			document.getElementById(id_obj).appendChild(new_menu); 

			document.getElementById(id_obj).onmouseover = '';		
		
		},

		make:function( champCSS, indiv, liste_couleurs_polices_images )
		{
			self.id_a_maj = champCSS.id;
			self.form_in_div = indiv;
			
			self.liste_couleurs_polices_images = '';
			
			var liste_named_colors = self.html_named_colors_REGEXP();
			
			if (liste_named_colors != '')
				liste_named_colors += '|';
				
			var for_regexp_color = "rgba?|color|"+liste_named_colors+"#[a-f0-9]{3}([a-f0-9]{3})?";
			self.forreg_iscolor = for_regexp_color;
			self.reg_iscolor = new RegExp (for_regexp_color, "gi");

			if (liste_couleurs_polices_images != null)
				self.liste_couleurs_polices_images = liste_couleurs_polices_images;

			var ereurre = '';
			var HTML_form_return = '';

			self.explain ();
			self.menu_proprietes ();
			

			
			
			value_champCSS = champCSS.value.replace(/\/\/([^\n]+)\n/g, '/* $1 */');
			
//			var reg_nocomment = new RegExp ('\/\*(?<!\*\/)(.*)\*\/', "g"); 
/* rech les commentaires : assertion arriere negative, regexp assertions : http://php.net/manual/fr/regexp.reference.assertions.php */
/*
Java script ne supporte pas les assertions arrieres, solution = 
'testt'.replace(/(es)?t/g, function($0, $1){ return $1 ? $0 : 'x'});
*/

			var reg_nocomment = new RegExp ("\/\\*((\\*\/)?.)+\\*\/", "g"); 

			value_champCSS = value_champCSS.replace(reg_nocomment, function($0, $1, $2){ return $2 ? $0 : ''}); 
			
			value_champCSS = value_champCSS.replace(self.reg_nolines, ' ');
			
	//		alert (value_champCSS);
			
			var defs_css_T = new Array(); 
			
			if (value_champCSS.match(self.reg_CSS_properties_fin))
				defs_css_T = value_champCSS.split(self.reg_CSS_properties_fin);
			else
				defs_css_T[0] = value_champCSS;
				
			for (def_css_idx in defs_css_T)
			{
				var def_css = defs_css_T[def_css_idx];
				var css_name_properties_T = new Array();
				
				
				if (def_css.match(self.reg_CSS_name_properties_split))
					css_name_properties_T = def_css.split(self.reg_CSS_name_properties_split);
				else
				{
					css_name_properties_T[0] = 'definition CSS sans nom';
					css_name_properties_T[1] = def_css;
				}
				
//				alert (def_css);
				
				var css_name = css_name_properties_T[0].replace(self.reg_trim, ''); 
				var css_properties = css_name_properties_T[1].replace(self.reg_trim, ''); 
				
				 
				if (all_CSS_edition[css_name] == null)
				{
					all_CSS_edition[css_name] = new Object();
				}
				
				var num_cette_cssname_si_repeated = self.lengthOf(all_CSS_edition[css_name]);
				all_CSS_edition[css_name][num_cette_cssname_si_repeated] = new Object();
				
					
				HTML_form_return += '<div class="css_name">'+css_name+'</div><div class="css_properties">';
				
				
				var css_properties_T = new Array();
				
				css_properties = css_properties.replace(/;\s*$/, '');
				
				
				
				
				if (css_properties.match(self.reg_CSS_properties_split))
					css_properties_T = css_properties.split(self.reg_CSS_properties_split);
				else
					css_properties_T[0] = css_properties;
					
	//			alert (css_properties+' '+css_properties_T[0]+' '+css_properties_T[1] );
	
	
				for (css_property_idx in css_properties_T)
				{
					
					var css_property = css_properties_T[css_property_idx];
					
				//	alert (css_property+' '+css_property_idx);
					
					var css_property_value_T = new Array();
					
					if (css_property.match(self.reg_CSS_propertie_value_split))
					{
						css_property_value_T = css_property.split(self.reg_CSS_propertie_value_split);
		
						var css_property_name = css_property_value_T[0].replace(self.reg_trim, ''); 
						var css_property_values = css_property_value_T[1].replace(self.reg_trim, '');
						
						var css_property_values_T = new Array();
						
						css_property_values = css_property_values.replace(/\s*,\s*/g, ',');

						var deboite_css_property_values_T = new Array();

						if (!css_property_name.match (/font/))
						{
							var pour_deboite_css_property_values = css_property_values.replace(/\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)(\s*,\s*([^,)]+)\s*)?\)/g, '($1-----$2-----$3-----$5)');
							
							if (pour_deboite_css_property_values.match(/,/))
							{
								pour_deboite_css_property_values = pour_deboite_css_property_values.replace(/,/g , ' +++ ');
								
								pour_deboite_css_property_values = pour_deboite_css_property_values.replace(/-----/g, ',');
								css_property_values = pour_deboite_css_property_values.replace(/,\)/g, ')');
								
						//		alert (pour_deboite_css_property_values+'\n'+css_property_values);

							}
							
						}

						if (css_property_values.match(self.reg_CSS_value_espace_split))
							css_property_values_T = css_property_values.split(self.reg_CSS_value_espace_split);
						else
							css_property_values_T[0] = css_property_values;
							
						var css_property_nb_vals = css_property_values_T.length;	
						var css_prop_num_val = 0;
						
						var new_css_property_vals_formline = '';
						
						if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name] == null)
						{
							all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name] = new Object();				
						}
						
						var num_cette_propriete_si_repeated = self.lengthOf(all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name]);
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated] = new Object();
							
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs'] = new Object();
						
						
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur'] = css_property_values;
						
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_numeric'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_image'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_color'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_liste'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_combine'] = new Array();
						all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['liste_separation'] = new Array();
						
						
						var htmform_property_values = '';
						
						var id_base_property = indiv+'___'+css_name+'___'+num_cette_cssname_si_repeated+'___'+css_property_name+'___'+num_cette_propriete_si_repeated;
						
			// FAIT LES FORMS POUR CHAQUE VALEURS (existantes dans la propriete css) : 
			
			

						
						for (css_property_value_idx in css_property_values_T)
						{
							// type de valeur : color, numeric, texte de liste... selon propris de l'objet modele.
							
							var css_property_value = css_property_values_T[css_property_value_idx];
							
							
							if (css_property_name.toLowerCase() == 'font-family' && css_property_value.match(/^[-_ "',a-z0-9]+$/i))
							{
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'].push(css_property_value);
								
							}
		
							else if (css_property_value.match(/\+\+\+/))
							{
						//		alert (css_property_value);
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['liste_separation'].push(css_property_value);
							}
							else if (css_property_value.match(self.reg_isnumeric))
							{
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_numeric'].push(css_property_value);
							}
							else if (css_property_value.match(self.reg_isimage))
							{
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_image'].push(css_property_value);
							}
							else if (css_property_value.match(self.reg_iscolor))
							{
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_color'].push(css_property_value);
							}
							else if (css_property_value.match(self.reg_istext))
							{
								all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_liste'].push(css_property_value);
							}
	
	
						}
							
						
						if (oTo_CSS_modele['properties'][css_property_name] != null && oTo_CSS_modele['properties'][css_property_name] != 'undefined')	
						{
							var oTo_val_CSS_Prop_T = oTo_CSS_modele['properties'][css_property_name]['values_formtype'].split(' ');
							var sidejaaffiche = false;
								
							var liselected = '';
							var nbcombine = 0;
								
							var limit_oto_val_css = oTo_val_CSS_Prop_T.length;	
							
							var compte_separations_valsexists = 0;
							var compte_separations_valsmodele = 0;
							
							var compte_polices_valsexists = 0;
							var compte_polices_valsmodele = 0;
							
							var compte_numerics_valsexists = 0;
							var compte_numerics_valsmodele = 0;
							
							var compte_listes_valsexists = 0;
							var compte_listes_valsmodele = 0;
							
							var compte_images_valsexists = 0;
							var compte_images_valsmodele = 0;
							
							var compte_colors_valsexists = 0;
							var compte_colors_valsmodele = 0;
							
							var compte_texte_valsexists = 0;
							var compte_texte_valsmodele = 0;
														
							
							var end_liste_valeur = false;
									
							var no_espace = false;
								var is_combine = false;
							

							for (oto_val_css = 0;  oto_val_css < limit_oto_val_css; oto_val_css++)
							{
								var si_listevaleurs = '';
								
								if (oTo_CSS_modele['properties'][css_property_name]['values_formtype'].match (/<\+>/))
								{
								
									if (oto_val_css == 0)
										si_listevaleurs ='<div id="'+id_base_property+'___listevals0">';

									if (oto_val_css > (limit_oto_val_css - 1 - oTo_val_CSS_Prop_T.length))
									{
										oto_val_css_ok = ((oTo_val_CSS_Prop_T.length) + oto_val_css) - limit_oto_val_css;
									
									//	alert ('oto_val_css_ok : \n'+oto_val_css_ok+' = (('+oTo_val_CSS_Prop_T.length+') - '+ oto_val_css+') - '+limit_oto_val_css+' ');
										var cetypevaleurCSS = oTo_val_CSS_Prop_T[oto_val_css_ok];
										
										if (oto_val_css_ok > 0)
											no_espace = false;

										
									}
								}
								else
								{
									var cetypevaleurCSS = oTo_val_CSS_Prop_T[oto_val_css];
								}
								
								
								
								
								
							//	var cetypevaleurCSS = oTo_val_CSS_Prop_T[oto_val_css];
							
								var cetypevaleurCSS_T = new Array();
								var liste_iddiv_choix_vals = new Array();
								var nom_liste_iddiv_choix_vals = new Array();
								
							
								if (cetypevaleurCSS.match(/>|</))
									cetypevaleurCSS_T = cetypevaleurCSS.split('|');
								else	
									cetypevaleurCSS_T[0] = cetypevaleurCSS;

// if (cetypevaleurCSS_T[0].match(/COMBINE/)) alert(cetypevaleurCSS_T.join('---'));

							
								var html_form_list_elements_create = '';
								var htmform_template = '';
								
								var valeurnumber = '';
								var valeurunit = '';
								var defaut_unit_dim = '';
								
								var html_form_list_forcolor = 0;

								for (ipossval = 0; ipossval<cetypevaleurCSS_T.length; ipossval++)
								{
									
									
									var typeinput = new Array();

									if (cetypevaleurCSS_T[ipossval].match(/^<COMBINE_/))
									{
											
										is_combine = true;
											
										var compte_separations_valsexists = 0;
										var compte_separations_valsmodele = 0;
										
										var compte_polices_valsexists = 0;
										var compte_polices_valsmodele = 0;
										
										var compte_numerics_valsexists = 0;
										var compte_numerics_valsmodele = 0;
										
										var compte_listes_valsexists = 0;
										var compte_listes_valsmodele = 0;
										
										var compte_images_valsexists = 0;
										var compte_images_valsmodele = 0;
										
										var compte_colors_valsexists = 0;
										var compte_colors_valsmodele = 0;
										
										var compte_texte_valsexists = 0;
										var compte_texte_valsmodele = 0;

										var lescombines = cetypevaleurCSS_T[ipossval].replace(/(<COMBINE_)|(>)/g, '');
										
										nom_liste_iddiv_choix_vals.push(lescombines);
										
										var lescombines_T = lescombines.split(/;|\]/g);
										
										typeinput = new Array();
	
	
										for (rere=0; rere<lescombines_T.length; rere++)
										{
												
											if (lescombines_T[rere].match(/^\[/))
											{
												typeinput.push(lescombines_T[rere].replace(/\[/, '<')+'>');
											}
											else
											{
												if (lescombines_T[rere] != '')
												{
													if (oTo_CSS_modele['properties'][lescombines_T[rere]] == null)
														alert (lescombines_T[rere]+' : propriete css non existante');
													else
													{
														var cecescombvalues = oTo_CSS_modele['properties'][lescombines_T[rere]]['values_formtype'].replace(/^([^ ]+) .*$/, '$1');
														
														typeinput.push(cecescombvalues);

													}
												}
											}
										}
										if (rapport == null && css_property_name == 'border') var rapport = '';
										if ( css_property_name == 'border') rapport += 'r0 : typeinput '+typeinput.join(' !-! ')+'\n';
										if ( css_property_name == 'border') rapport += 'r0 : lescombines_T '+lescombines_T.join(' !-! ')+'\n';
										if ( css_property_name == 'border') rapport += 'r0 : lescombines '+lescombines+'\n\n';
											
									}									
									
									else
									{
										typeinput[0] = cetypevaleurCSS_T[ipossval];
									}

										
									var limit_ddd = typeinput.length;
								
									for (var ddd=0; ddd < limit_ddd; ddd++)
									{

										var id_de_cette_valeur = id_base_property+'___c'+nbcombine+'___'+css_prop_num_val;
										
										if (is_combine) 
										{
											if (ddd == 0)
											{
												var sauve_htmform_template = htmform_template;
												htmform_template = '';
	
											}
											
											defaut_unit_dim = '';
											if (css_property_name == 'border')  rapport += '\nr1 : dans ddd->iscombine = ok : ddd='+ddd+'/'+limit_ddd+' '+typeinput[ddd]+'\n';
										}
								
										var typeinput_ok = '';
										var typeinput_pourok = '';
										
										
										typeinput_pourok = typeinput[ddd];
										
										htmform_template += si_listevaleurs;

										var cecescombvalues_T = new Array();
										
										if (typeinput_pourok.match(/\|/))
											cecescombvalues_T = typeinput_pourok.split('|');
										else
											cecescombvalues_T[0] = typeinput_pourok;
																
										if (css_property_name == 'border') rapport += '\nr2 : '+css_property_name+' :\n'+cecescombvalues_T.join(' !!! ');										
														
										
										for (ddde=0; ddde<cecescombvalues_T.length;ddde++)
										{
											if (is_combine && ddde == 0) 
												html_form_list_elements_create = '';
										
											typeinput_ok = cecescombvalues_T[ddde];
										
										
											if (css_property_name == 'border') rapport += 'r3 : typeinput_ok : '+typeinput_ok+' \n';
											
											
											if (typeinput_ok.match(/^<NUMERIC/))
											{
												
												
												var pour_htmform_template = self.HTML_base_form_numeric;
												
												if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_numeric'][compte_numerics_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_numeric'][compte_numerics_valsexists].match(self.reg_isnumeric))
												{
													css_property_value_to_form = all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_numeric'][compte_numerics_valsexists];
												
												
												
												
												
													if (css_property_value_to_form.match(self.reg_isnumericwithunit))
													{
														
												//		if (is_combine) alert (typeinput_ok+' '+css_property_value_to_form+' ok:reg_isnumericwithunit');
														
														
														valeurnumber = css_property_value_to_form.replace(self.reg_numeric_val, '$1');
														valeurunit = css_property_value_to_form.replace(self.reg_numeric_unit, '$1');
														
														all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['type'] = 'NUMERIC UNIT';
														
														if (html_form_list_elements_create == '')
														{
															var html_form_list_forunits = self.HTML_base_form_listechoix.replace(/___classe_css___/, 'units_list');
															var html_form_list_base_units = self.HTML_base_listechoix_elemt;
														}
														else
														{
															html_form_list_elements_create += '<li><a href="#MemeEndroit">&nbsp;</a></li>'; 
														}
														
														for (unitdim in self.liste_units_dimensions)
														{	
															var cette_expliq_value = self.explain_cette_value_liste (css_property_name, cette_unit_dim);
													
															var cette_unit_dim = self.liste_units_dimensions[unitdim];
															
															if (cette_unit_dim == valeurunit)
															{
																var defaut_unit_dim = cette_unit_dim;
																html_form_list_elements_create += html_form_list_base_units.replace(/(<li)[^>]*(><a [^>]*>)___element_choix___/g, '$1 style="display:none;" $2'+cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
																
															}
															else
															{
																html_form_list_elements_create += html_form_list_base_units.replace(/___element_choix___/g, cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
															}
															
															
														}
														
											//		alert (css_property_name+' '+css_prop_num_val+' : '+valeurnumber+' - '+valeurunit);
																		
													}
													else
													{
														valeurnumber = css_property_value_to_form;
														valeurunit = '';
														all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['type'] = 'NUMERIC';
													}
													
			
													compte_numerics_valsexists ++;
												
												}
												else
												{
													
													valeurnumber = '';
													valeurunit = '';
												
												//	if (is_combine) alert (typeinput_ok);
													
													
													
													if (typeinput_ok.match(/^<NUMERIC_UNITS/))
													{
														if (html_form_list_elements_create == '')
														{
															var html_form_list_forunits = self.HTML_base_form_listechoix.replace(/___classe_css___/, 'units_list');
															var html_form_list_base_units = self.HTML_base_listechoix_elemt;
														}
														else
														{
															html_form_list_elements_create += '<li><a href="#MemeEndroit">&nbsp;</a></li>'; 
														}
														
														
														
														for (unitdim in self.liste_units_dimensions)
														{	
															
															var cette_unit_dim = self.liste_units_dimensions[unitdim];
															var cette_expliq_value = self.explain_cette_value_liste (css_property_name, cette_unit_dim);
															
															if (unitdim == 0 && defaut_unit_dim == '')
															{
																defaut_unit_dim = cette_unit_dim;
																html_form_list_elements_create += html_form_list_base_units.replace(/(<li)[^>]*(><a [^>]*>)___element_choix___/g, '$1 style="display:none;" $2'+cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
																
															}
															else
															{
																html_form_list_elements_create += html_form_list_base_units.replace(/___element_choix___/g, cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
															}
															
														}
														
											//		alert (css_property_name+' '+css_prop_num_val+' : '+valeurnumber+' - '+valeurunit);
							
													}
													
													
												}
												
												
												
												pour_htmform_template = pour_htmform_template.replace(/___value_a_remplacer____numeric/g, valeurnumber);
				
												compte_numerics_valsmodele ++;
												
												
												htmform_template += pour_htmform_template;
												htmform_template = htmform_template.replace(/___id_a_remplacer___/g, id_de_cette_valeur);
											}
				
				
				
				
				
				
											
											else if (typeinput_ok.match(/^<LISTE_/))
											{
			
												if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_liste'][compte_listes_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_liste'][compte_listes_valsexists].match(self.reg_istext))
												{
													css_property_value_to_form = all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_liste'][compte_listes_valsexists];
													
												
													valeurnumber = css_property_value_to_form;
													valeurunit = '';
												
											if (css_property_name == 'border') rapport += 'r3.1 : creation LISTE ou NON : html_form_list_elements_create : -'+html_form_list_elements_create+'- \n'+ddd+' == '+(limit_ddd-1);
													
													if (html_form_list_elements_create == '')
													{
														var html_form_list_forunits = self.HTML_base_form_listechoix.replace(/___classe_css___/, 'options_list');
														var html_form_list_base_units = self.HTML_base_listechoix_elemt;
														
														
														if (ddd == limit_ddd-1)
														{
															compte_listes_valsmodele ++;
															
											if (css_property_name == 'border') rapport += '\n=> OUI : compte_listes_valsmodele: '+compte_listes_valsmodele+'\n';
														}
														
													}
													else
													{
														html_form_list_forunits = html_form_list_forunits.replace(/class="(units_list)"/g, 'class="units_options_list"')
														html_form_list_elements_create += '<li><a href="#MemeEndroit">&nbsp;</a></li>'; 
													}
													
													var listepossible = typeinput_ok.replace(/<LISTE_([^>]+)>/, '$1');
													var listepossible_T = listepossible.split(',');
													
													for (unitdim in listepossible_T)
													{	
														var cette_unit_dim = listepossible_T[unitdim];
														
														var cette_expliq_value = self.explain_cette_value_liste (css_property_name, cette_unit_dim);
														
														if (cette_unit_dim == valeurnumber)
														{
															html_form_list_elements_create = html_form_list_elements_create.replace(/display:none;/g, '');
															
															defaut_unit_dim = cette_unit_dim;
															html_form_list_elements_create += html_form_list_base_units.replace(/(<li)[^>]*(><a [^>]*>)___element_choix___/g, '$1 style="display:none;" $2'+cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
															
															if (htmform_template.match(/___styledisplay_a_remplacer____numeric/))
															{
																if (is_combine) htmform_template = htmform_template.replace(/___styledisplay_a_remplacer____numeric/g, '');
																else htmform_template = htmform_template.replace(/___styledisplay_a_remplacer____numeric/g, 'display:none;');
															}
															
															compte_listes_valsexists ++;
															
														}
														else
														{
															html_form_list_elements_create += html_form_list_base_units.replace(/___element_choix___/g, cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
														}
														
														
													}
													
													
												
												}
												else
												{
													
												
											//		alert (typeinput);
													if (html_form_list_elements_create == '')
													{
														var html_form_list_forunits = self.HTML_base_form_listechoix.replace(/___classe_css___/, 'options_list');
														var html_form_list_base_units = self.HTML_base_listechoix_elemt;
														
														if (ddd == limit_ddd-1)
															compte_listes_valsmodele ++;
															
													}
													else
													{
														html_form_list_forunits = html_form_list_forunits.replace(/class="(units_list)"/g, 'class="units_options_list"')
														html_form_list_elements_create += '<li><a href="#MemeEndroit">&nbsp;</a></li>'; 
													}
													
													var listepossible = typeinput_ok.replace(/<LISTE_([^>]+)>/, '$1');
													var listepossible_T = listepossible.split(',');
													
													
											//		alert (listepossible);
													for (unitdim in listepossible_T)
													{	
														var cette_unit_dim = listepossible_T[unitdim];
														var cette_expliq_value = self.explain_cette_value_liste (css_property_name, cette_unit_dim);
														
														if (unitdim == 0 && defaut_unit_dim == '')
														{
															
															if (htmform_template.match(/___styledisplay_a_remplacer____numeric/))
															{
																htmform_template = htmform_template.replace(/___styledisplay_a_remplacer____numeric/g, 'display:none;');
															}
															
															if (html_form_list_elements_create.match(/display:none;?/))
																html_form_list_elements_create.replace(/display:none;?/g, '')
															
															defaut_unit_dim = cette_unit_dim;
															html_form_list_elements_create += html_form_list_base_units.replace(/(<li)[^>]*(><a [^>]*>)___element_choix___/g, '$1 style="display:none;" $2'+cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
															
														}
														else
														{
															html_form_list_elements_create += html_form_list_base_units.replace(/___element_choix___/g, cette_unit_dim).replace(/___SiULDetail___/, cette_expliq_value);
														}
														
													}
														
											//		alert (css_property_name+' '+css_prop_num_val+' : '+valeurnumber+' - '+valeurunit);
							
												}
																						
											}
											
											else if (typeinput_ok.match(/^<POLICES>/))
											{
												
												
												var html_li_police = self.HTML_base_form_listepolice;
											
			
			// alert ('polices, teste valeur : '+all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'][compte_polices_valsexists]);
			
												if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'][compte_polices_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'][compte_polices_valsexists].match(/^[ '",-_a-z0-9]+$/i))
												{
													css_property_value_to_form = all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_polices'][compte_polices_valsexists];
													
													valeurnumber = css_property_value_to_form;
													valeurunit = '';
			
													var ce_htm_lipolice = html_li_police;
													htmform_template += ce_htm_lipolice.replace(/___value_a_remplacer___/g, css_property_value_to_form);
			
													
			//										alert (valeurspolices.join(' - ')+'\n\n'+htmform_template);
													compte_polices_valsexists ++;
												}
												
												else
												{
													
													var ce_htm_lipolice = html_li_police;
													htmform_template += ce_htm_lipolice.replace(/___value_a_remplacer___/g, 'choix de polices');
													
												}
	
												compte_polices_valsmodele ++;
			
											}
											
											else if (typeinput_ok.match(/^<COLOR>/))
											{
												
											
												var colorvalue = '';
												var colorstylebg = '';
												var sidisplay = '';
												
												if (html_form_list_elements_create != '')
												{
													
													html_form_list_forcolor = 1;													
	
													// units_options_list 
													html_form_list_forunits = html_form_list_forunits.replace(/class="(units_list)"/g, 'class="color_options_list"')
													html_form_list_elements_create = '<li>&nbsp;</li>'+html_form_list_elements_create; 
													html_form_list_elements_create = '<li><a href="#MemeEndroit" onclick="CSS_OTO_EDITOR.form.set_value(\''+id_de_cette_valeur+'\', this);">'+self.translate('color')+'</a></li>'+html_form_list_elements_create; 
													
													sidisplay = 'display:none;';
												}
											
												if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_color'][compte_colors_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_color'][compte_colors_valsexists].match(self.reg_iscolor))
												{
													css_property_value_to_form = all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['valeur_color'][compte_colors_valsexists];
													sidisplay = 'display:block;';
													if (html_form_list_elements_create != '')
													{
														if (html_form_list_elements_create.match(/display:none;?/))
															html_form_list_elements_create = html_form_list_elements_create.replace(/display:none;?/g, '')
			
														var reg_optioncolor = new RegExp ("(>"+self.translate('color')+"<)", "g");
														html_form_list_elements_create = html_form_list_elements_create.replace(reg_optioncolor, 'style="display:none;" $1');
														html_form_list_forunits = html_form_list_forunits.replace(/(class="InfosPageA">)[^<]+(<)/g, '$1'+self.translate('color')+'$2');
														
														defaut_unit_dim = self.translate('color');
														
													}
																
													// if (is_combine) 		alert ('valeur de couleur pour form : '+css_property_value_to_form); 
															
																	
													colorvalue = css_property_value_to_form;
													
													var colortextevalue = colorvalue;
													var colorinputvalue = colorvalue;
													var opacityinput = '';
													
													var styleinput = '';
													
													if (colortextevalue.match(/^(rgba[^,]+,)([^,]+,)([^,]+).+$/))
													{											
														colortextevalue = colorvalue.replace(/rgba[^.0-9]+([.0-9]+,)([.0-9]+,)([.0-9]+),([.0-9]+)(.+)$/, 'rgb($1$2$3)');
														colorinputvalue = colorvalue.replace(/rgba[^.0-9]+([.0-9]+,)([.0-9]+,)([.0-9]+),([.0-9]+)(.+)$/, 'rgb($1$2$3)');
														
														opacityinput = colorvalue.replace(/^.+[^.0-9]+([.0-9]+)[^.0-9]+$/, '$1');
														
												//		alert (colortextevalue+' --- '+colorinputvalue+' --- '+opacityinput)
														styleinput = 'opacity:'+opacityinput+'; ';
														
													}
			
			
													colorstylebg = sidisplay+' '+styleinput+' background-color:'+colorinputvalue+'; border-color:'+colorinputvalue+'; color:'+colortextevalue+';';
													
													// alert (colorstylebg);
													compte_colors_valsexists ++;
												
												}
												
			
												htmform_template += '<div class="select_color">'
								
												htmform_template += '<input id="'+id_de_cette_valeur+'_colorhexa"  type="text" class="select_color" style="'+colorstylebg+'" value="'+colorvalue+'" onclick="CSS_OTO_EDITOR.form.color_picker(this);" onchange="CSS_OTO_EDITOR.form.set_color(\''+id_de_cette_valeur+'\');" onmouseover="CSS_OTO_EDITOR.form.valeurform_aff_infos(this, \'open\')" onmouseout="CSS_OTO_EDITOR.form.valeurform_aff_infos(this)" />';
												
												htmform_template += '<input id="'+id_de_cette_valeur+'"  type="text" style="display:none;" value="'+colorinputvalue+'"  />';
												
												htmform_template += '<div id="'+id_de_cette_valeur+'_divinputcolortext" style="display:none; position:absolute; margin:0px 0px 0px 45px; z-index:1;"><input id="'+id_de_cette_valeur+'" class="select_color" type="text" style="width:200px;" value="'+colorvalue+'"/></div>';
												
												htmform_template += '</div>';
				
												
												compte_colors_valsmodele ++;
											
											}
											
											else if (typeinput_ok.match(/^<IMAGE>/))
											{
												
											}
											
											else if (typeinput_ok.match(/^<TEXTE>/))
											{
																																			
												if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['texte'][compte_texte_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['texte'][compte_texte_valsexists] != "")
												{
													valeurnumber = all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['texte'][compte_texte_valsexists];
													compte_texte_valsexists ++;
												}
												else
												{
													valeurnumber = '';												
												}
												
												htmform_template += '<input id="'+id_de_cette_valeur+'" class="inputtext" type="text" value="'+valeurnumber.replace(/"/, "'")+'" onmouseover="CSS_OTO_EDITOR.form.valeurform_aff_infos(this, \'open\')" onmouseout="CSS_OTO_EDITOR.form.valeurform_aff_infos(this)"/>';
													
												compte_texte_valsmodele ++;
												
												
											}
	
											else if (typeinput_ok.match(/^<\+>/))
											{
																								
												no_espace = true;
												
												if (end_liste_valeur == false)
												{
													if (all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['liste_separation'][compte_separations_valsexists] != null && all_CSS_edition[css_name][num_cette_cssname_si_repeated][css_property_name][num_cette_propriete_si_repeated]['valeurs']['liste_separation'][compte_separations_valsexists].match(/\+\+\+/) )
													{
														htmform_template += ',<input id="'+id_de_cette_valeur+'" type="hidden" value=" +++ "/>';
														if (compte_separations_valsexists  > 0)
														{
															htmform_template += '<input id="'+id_de_cette_valeur+'_supprlisteval" type="button" style="width:20px;height:12px; display:block; padding:0px;" value="-" onclick="CSS_OTO_EDITOR.form.suppr_liste_valeur(this);"/>';
														}
														
														htmform_template += '</div><div id="'+id_base_property+'___listevals'+(compte_separations_valsmodele+1)+'">';														
														
														limit_oto_val_css += oTo_val_CSS_Prop_T.length;	
														compte_separations_valsexists ++;
													}
													else
													{
													
														htmform_template += '<input id="'+id_de_cette_valeur+'" type="hidden" value=","/><input id="'+id_de_cette_valeur+'_supprlisteval" type="button" style="width:20px;height:12px; display:block; padding:0px;" value="-" onclick="CSS_OTO_EDITOR.form.suppr_liste_valeur(this);"/><input id="'+id_de_cette_valeur+'_creelisteval" type="button" style="width:20px;height:12px; display:block;" value="+" onclick="CSS_OTO_EDITOR.form.add_liste_valeur(this);"/>';
										
	
	
														htmform_template += '</div>';
														end_liste_valeur = true;
														
														limit_oto_val_css = 0;
														limit_ddd = 0;
														
													}
													
													
													
												}
												else
												{
													
												}
												
												compte_separations_valsmodele ++;
											}
											
											else
											{
												htmform_template += '<input id="'+id_de_cette_valeur+'" class="nomodif" type="text" value="'+typeinput_ok.replace(/<|>/g, '')+'"/>';
												
												htmform_property_values = htmform_property_values.replace( /<div class="value_separator">&nbsp;<\/div>$/, '') ;
												no_espace = true;
											}
	
	
	
	
	
											if (is_combine) 
											{
												if (ddde == cecescombvalues_T.length-1 && html_form_list_elements_create != '')
												{
													html_form_list_forunits = html_form_list_forunits.replace(/___element_liste_selected___/g, defaut_unit_dim);								
													html_form_list_forunits = html_form_list_forunits.replace(/___liste_de_choix___/, html_form_list_elements_create);
													
													html_form_list_forunits = html_form_list_forunits.replace(/___id_a_remplacer___/g, id_de_cette_valeur);
													
													
													if (html_form_list_forcolor == 1)
												//		htmform_template = '<div class="property_value_list">'+html_form_list_forunits+'</div>'+htmform_template;
														htmform_template = htmform_template.replace(/(<div class="select_color">.+(?!<div class="select_color">))$/, '<div class="property_value_list">'+html_form_list_forunits+'</div>$1');
													else
														htmform_template += '<div class="property_value_list">'+html_form_list_forunits+'</div>';
	
	
	// /(<div class="select_color">.+(?!<div class="select_color">))$/
	
													html_form_list_forcolor = 0;
													sidejaaffiche = false;
	
													css_prop_num_val++;
													
												}
												
												if (rapport != null) rapport += '\nfin de tour ddd combine - css_prop_num_val : '+css_prop_num_val+' - is_combine: '+is_combine;
											
												
											} // FIN ddde

	
									
											if (rapport != null) rapport += '\nfin boucle ddd - is_combine: '+is_combine+'\n';
											
											if (is_combine) 
											{
												if (ddd == limit_ddd-1)
												{	
													if (rapport != null) rapport += '\nfin boucle ddd - DANS is_combine: '+is_combine+'\n';
													var display_combine = 'none';
													
													var base_div_choix_vals = id_de_cette_valeur.replace(/___[0-9]+$/, '');	
													var classdiv_choix_vals = base_div_choix_vals.replace(/___c[0-9]+$/, '')+'_tohide';
													var iddiv_choix_vals = base_div_choix_vals+'_div';
													
													if (compte_polices_valsexists ==  compte_polices_valsmodele && compte_numerics_valsexists == compte_numerics_valsmodele && compte_listes_valsexists == compte_listes_valsmodele && compte_images_valsexists == compte_images_valsmodele && compte_colors_valsexists == compte_colors_valsmodele && sidejaaffiche == false)
													{
														
														sidejaaffiche = true;
														display_combine = 'block';
														liselected = iddiv_choix_vals;
														
													}
													
													htmform_template = htmform_template.replace(/___id_a_remplacer___/g, id_de_cette_valeur);
													htmform_template = sauve_htmform_template + ' --- <div id="'+iddiv_choix_vals+'" class="'+classdiv_choix_vals+'" style="display:'+display_combine+';">' + htmform_template + '</div>';
												
												
													if (ddd == limit_ddd-1 && sidejaaffiche == false)
													{
														var reg_comb0 = new RegExp ("(id=\""+id_de_cette_valeur+'_div\"[^>]+display:)none;', 'g');
														htmform_template = htmform_template.replace(reg_comb0, '$1block;');
														
														liselected = iddiv_choix_vals;
													
													}
													
													if (rapport != null) rapport += '\nfin boucle ddd - 2eme DANS is_combine: '+is_combine+'\n';
													
													if (rapport != null) rapport += 'r4 : FIN ddd:'+ddd+' ipossval : '+ipossval+'/'+cetypevaleurCSS_T.length+' - '+nbcombine+'\n\n';
													if (rapport != null) rapport += compte_polices_valsexists+' ==  '+compte_polices_valsmodele+' && \n'+compte_numerics_valsexists+' ==  '+compte_numerics_valsmodele+' && \n'+compte_listes_valsexists+' ==  '+compte_listes_valsmodele+' && \n'+compte_images_valsexists+' ==  '+compte_images_valsmodele+' && \n'+compte_colors_valsexists+' ==  '+compte_colors_valsmodele+' && \n'+sidejaaffiche+' ==  false\n';
													
													liste_iddiv_choix_vals.push(iddiv_choix_vals);
													nbcombine ++;
													
													
												
												}
												
												
												
											}
											else 
											{
												if (rapport != null) rapport += 'r4 : NON COMBINE ! \n\n';
											}
			
										
										} // Fin ddd
										
																				
									} 


								}
								
								
// Fin ipossval

								if (is_combine) 
								{
							
									if (liste_iddiv_choix_vals.length > 1)
									{

										var html_form_list_divcomb = self.HTML_base_form_listeproprietes.replace(/___classe_css___/, 'combine');
										
										var menuchoix_divcomb = '';
																																
										for (aae=0; aae < liste_iddiv_choix_vals.length; aae++)
										{	
											document.getElementById('Suivi').innerHTML += liste_iddiv_choix_vals[aae]+' == '+liselected+'<br>';
											if (nom_liste_iddiv_choix_vals[aae] != 'undefined')
											{
												var classa_name = '';
												if (liste_iddiv_choix_vals[aae] == liselected && liselected != 'undefined')
													classa_name = 'selected';
											
												menuchoix_divcomb += '<li class="'+classa_name+'"><a href="#MemeEndroit" id="'+liste_iddiv_choix_vals[aae]+'_a" onclick="CSS_OTO_EDITOR.form.aff_choix_combine(this)">'+nom_liste_iddiv_choix_vals[aae]+'</a></li>';	
											}
										}

										var id_div_menucombine = liste_iddiv_choix_vals[0].replace(/___c[0-9]+_.+$/, '')+'_combine';

										var le_html_form_list_divcomb = html_form_list_divcomb.replace(/___element_liste_selected___/g, 'choix');								
										le_html_form_list_divcomb = le_html_form_list_divcomb.replace(/___liste_de_choix___/g, menuchoix_divcomb);
										le_html_form_list_divcomb = le_html_form_list_divcomb.replace(/___id_a_remplacer___/g, id_div_menucombine);
										
										
										if (rapport != null) rapport += 'r5 : FIN ipossval : '+ipossval+'/'+cetypevaleurCSS_T.length+' - '+nbcombine+'\n';
											
									//	alert(le_html_form_list_divcomb);
										htmform_template += le_html_form_list_divcomb;

									}
										
								}								
							
								
								
								
								if (!is_combine)
								{
									if (html_form_list_elements_create != '')
									{
										html_form_list_forunits = html_form_list_forunits.replace(/___element_liste_selected___/g, defaut_unit_dim);								
										html_form_list_forunits = html_form_list_forunits.replace(/___liste_de_choix___/, html_form_list_elements_create);
										
										if (html_form_list_forcolor == 1)
											htmform_template = '<div class="property_value_list">'+html_form_list_forunits+'</div>'+htmform_template;
										else
											htmform_template += '<div class="property_value_list">'+html_form_list_forunits+'</div>';
									}
								}
								else
								{
								}
	
								if (htmform_template.match(/___styledisplay_a_remplacer____numeric/))
								{
									htmform_template = htmform_template.replace(/___styledisplay_a_remplacer____numeric/g, '');
								}
	
								if (rapport != null) 
								{
									rapport += 'r6 : FIN oto_val_css : '+oto_val_css+'/'+limit_oto_val_css+' - '+nbcombine+'\n';
									
									// alert (rapport);
									rapport = null;
								}
							
								htmform_template = htmform_template.replace(/___id_a_remplacer___/g, id_de_cette_valeur);
	
	
	
								htmform_template = htmform_template.replace(/___value_a_remplacer___/g, valeurnumber);
								
								
								var explain_values = '';	
								if (oTo_CSS_modele['properties'][css_property_name]['explain_values'] != null)
									explain_values = oTo_CSS_modele['properties'][css_property_name]['explain_values'];

								htmform_template = htmform_template.replace(/___explain_value___/g, explain_values);
								
								// alert (no_espace);
								if (htmform_property_values != '' && no_espace == false)
								{
									htmform_property_values += '<div class="value_separator">&nbsp;</div>';
									no_espace = false;
								}
							//	else
							//		
								
								
								htmform_property_values += '<div class="property_value">'+htmform_template+'</div>';
								
							
								css_prop_num_val ++;
							
							
							}
							
								
								
							
							HTML_form_return += '<div class="css_property" id="css'+def_css_idx+'_property_'+css_property_idx+'">';
	
			
							HTML_form_return += '<div class="css_property_btn">';
							
// HTML_form_return += '<div id="css'+def_css_idx+'_property_btn'+css_property_idx+'_btnmove" onselectstart="return false;" onmousedown="CSS_OTO_EDITOR.form.sort_liste_valeur(this);"><span class="plus">∆</span></div>';
							
							HTML_form_return += '<div id="css'+def_css_idx+'_property_btn'+css_property_idx+'_btnplus" onmouseover="CSS_OTO_EDITOR.form.aff_menu_properties(this, \''+css_property_name+'\');"><span class="plus">&bull;</span></div>';
							HTML_form_return += '</div>';
						//	self.menu_add_property
							
							
							
							
							
							HTML_form_return += '<div class="css_property_name" id="css'+def_css_idx+'_property_name'+css_property_idx+'">'+css_property_name+'<input type="hidden" class="css_property_name_ok" id="'+id_base_property+'_namechange" value="'+css_property_name+'"/><input type="hidden" class="css_property_value_ok" value="'+css_property_values+'" id="'+id_base_property+'_valuechange"></div>';
							HTML_form_return += '<div class="css_property_form" id="css'+def_css_idx+'_property_form'+css_property_idx+'">'+htmform_property_values+'</div>';
							
//							alert (oTo_CSS_modele['properties'][css_property_name]['explain']+'\n'+oTo_CSS_modele['properties'][css_property_name]['explain_values']);

							var explain = '';	
							var explain_details = '';	
							if (oTo_CSS_modele['properties'][css_property_name]['explain'] != null)
							{
								explain = self.explain_1line(css_property_name);
								explain_details = self.explain_restline(css_property_name);
																
							}
							var explain_values = '';	
							if (oTo_CSS_modele['properties'][css_property_name]['explain_values'] != null)
								explain_values = oTo_CSS_modele['properties'][css_property_name]['explain_values'];
							
							var navimg = self.navigators_img(css_property_name, 1);
							var navinfos = self.navigators_infos(css_property_name);
							
						//	alert (navimg+'\n\n\n'+navinfos+'\n\n\n'+explain_values+'\n\n\n'+explain);
							
 
							HTML_form_return += '<div class="css_property_explain">';
							HTML_form_return += '<div>';

							HTML_form_return += '<div id="css'+def_css_idx+'_property_explain'+css_property_idx+'"><a href="#MemeEndroit" onmouseover="CSS_OTO_EDITOR.form.explain_all_values(this);">'+explain+'</a></div>';

							HTML_form_return += '<div class="css_property_explain_navigators" id="css'+def_css_idx+'_property_explain'+css_property_idx+'_navigators">'+navimg+' <a href="#MemeEndroit" onmouseover="CSS_OTO_EDITOR.form.explain_all_values(this,1);">'+self.translate('values details')+'</a></div>';
							HTML_form_return += '<div class="css_property_explain_aide_propriete" id="css'+def_css_idx+'_property_explain'+css_property_idx+'_aide_propriete">'+explain_details.replace(/ --- /g, '<br>')+'</div>';

							HTML_form_return += '<div class="aide_value_form" id="css'+def_css_idx+'_property_explain'+css_property_idx+'_aide_valeur" style="display:none;" onmouseout="CSS_OTO_EDITOR.form.explain_all_values(this);"><div>'+explain_values.replace(/ --- /g, '<br>').replace(/ --- ([^:]+) :/g , ' --- <b>$1</b> :')+'</div></div>';
							HTML_form_return += '<div id="css'+def_css_idx+'_property_explain'+css_property_idx+'_navigators_details" style="display:none;">'+navinfos.replace(/ --- /g, '<br>')+'</div>';
							HTML_form_return += '</div>';
							HTML_form_return += '</div>';
							HTML_form_return += '</div>';
							
							
						}
						
						else
						{
							
							
							HTML_form_return += '<div class="css_property" id="css'+def_css_idx+'_property_'+css_property_idx+'">';
							HTML_form_return += '<div class="css_property_name" id="css'+def_css_idx+'_property_name'+css_property_idx+'"><input type="text" class="css_property_name_ok" id="'+id_base_property+'_namechange" value="'+css_property_name+'"/></div>';
							HTML_form_return += '<div class="css_property_form" id="css'+def_css_idx+'_property_form'+css_property_idx+'"><input type="text" class="css_property_value_ok" value="'+css_property_values+'" id="'+id_base_property+'_valuechange"></div>';
							HTML_form_return += '<div class="css_property_explain" id="css'+def_css_idx+'_property_explain'+css_property_idx+'"><div id="css'+def_css_idx+'_property_explain'+css_property_idx+'">ERREUR: propri&eacute;t&eacute; inconnue</div></div><br>';
							HTML_form_return += '</div>';
							
							
						}
						
						
						
						
					}
					else
					{

					//	ereurre += '\npropriete css et valeur inséparables (par le signe '+self.reg_CSS_propertie_value_split+' )\n : '+css_property+'\n';
					}
					
				}
				
//				HTML_form_return += '<div class="css_name">'+css_name+'</div><div class="css_properties">';
				HTML_form_return += '</div>';
				
			}



			if (typeof('InfosPage') != 'function')
			{
				window.InfosPage = function (obj)
				{
					if (obj.getElementsByTagName('div')[0] != null)
					{
						// alert('-'+obj.getElementsByTagName('a')[0].onmouseover+'-'+typeof(obj.getElementsByTagName('a')[0].onmouseover));
						if (obj.getElementsByTagName('a')[0].onmouseover == '' || obj.getElementsByTagName('a')[0].onmouseover == null)
						{
							CSS_OTO_EDITOR.form.menunav_reset(obj);
							obj.getElementsByTagName('a')[0].onmouseover = function () { CSS_OTO_EDITOR.form.menunav_reset(this.parentNode); };
						}
						
						if (obj.getElementsByTagName('div')[0].style.display == 'block')
						{
					//		alert ('masque');
					//		obj.getElementsByTagName('div')[0].style.display = 'none';
					//		self.setSizeAndPosULs(obj.getElementsByTagName('div')[0], 'reset');
							

						}
						else if (document.resetposmenu == null)
						{
				//			alert ('affiche');

				//			self.setSizeAndPosULs(obj.getElementsByTagName('div')[0], 'reset');

						//	obj.getElementsByTagName('div')[0].style.display = 'block';

							var div100p100 = document.createElement('div');
							div100p100.style = 'top:0px; left:0px; position:fixed; width:100%; height:100%;';
							
							if (document.body.appendChild(div100p100))
							{
								document.largfenetre = (div100p100.offsetWidth);
								document.hautfenetre = (div100p100.offsetHeight);
								
								document.body.removeChild(div100p100);
								
							}
							
							
									
							var leslis = obj.getElementsByTagName('li');
							
							for (il=0; il< leslis.length; il++)
							{
								var celi = 	leslis[il];
								
	//							if (celi.getElementsByTagName('ul')[0] != null)
		//						{
									celi.onmouseover = function () { var obji = this; CSS_OTO_EDITOR.form.make_scrolling (obji);};
								//	celi.onmouseout = function () { this.getElementsByTagName('ul')[0].style.display='none'; };
//								}
							}
							self.make_scrolling (obj);
					//		self.setSizeAndPosULs(obj.getElementsByTagName('div')[0]);
							
						}
					}
				};
				
				
			}
			
			
			
			if (typeof('ListeDesPolices') != 'function')
			{
				window.ListeDesPolices = function (objpourid)
				{
					var idobj_given = objpourid.id;
					
					if (idobj_given == 'InfosPage')
					{
						idobj_given = objpourid.getElementsByTagName('a')[0].id;
						var idobj = idobj_given.replace(/___a$/g, '');
						var liste_de_base = 0;
						
					}
					else
					{
						var liste_de_base = 1;
						var idobj = idobj_given.replace(/_policemakemenu_a$/g, '');
					}
			//	alert (objpourid.id+'\n\n'+idobj_given+'\n\n'+idobj);


/*


	HTML_base_form_listepolice : '<input type="hidden" id="___id_a_remplacer___" value="___value_a_remplacer___"/><div id="___id_a_remplacer____policemakemenu"><a id="___id_a_remplacer____policemakemenu_a" href="MemeEndroit" onmouseover="ListeDesPolices(this);"/><div id="___id_a_remplacer____policeform"></div>',

<input type="hidden" id="___id_a_remplacer____unit" value="___element_liste_selected___"/>

<div id="InfosPage" onmouseover="ListeDesPolices(this); InfosPage(this);" onmouseout="InfosPage(this);"><a href="#MemeEndroit" id="___id_a_remplacer______a" class="InfosPageA" style="___police_a_remplacer___">___element_liste_selected___</a><div id="___id_a_remplacer____InfosPage"><ul></ul><span class="explain_value">___explain_value___</span></div></div>


*/

					if (liste_de_base == 1 && idobj_given.match(/_policemakemenu_a/))
					{
						document.getElementById(idobj+'_policeform').innerHTML = '';							
						
						var valeurspolices = new Array();
						var valeur_police = document.getElementById(idobj).value;
						
						if (valeur_police.match(/,/))
						{
							valeur_police + valeur_police.replace(/\s*,\s*/gi, '');
							valeur_police + valeur_police.replace(/^\s*|\s*$/gi, '');
							
							valeurspolices = valeur_police.split(',');

						}
						else
						{
							valeur_police + valeur_police.replace(/^\s*|\s*$/gi, '');
							valeurspolices[0] = valeur_police;

						}


						for (var to=0; to<valeurspolices.length; to++)
						{
							var cetidpolice = idobj+'_p'+to;
							var cettepolice_value = valeurspolices[to];
							var cettepolice = cettepolice_value.replace(/'|"/g, '');

							var divip = document.createElement('div');
							divip.id = 'InfosPage';
							
							divip.onmouseover =  function () { ListeDesPolices(this); } ;
							
							divip.onmouseout =  function () { InfosPage(this);} ;
							
							var divaip = document.createElement('a');
							divaip.href = "#MemeEndroit";
							divaip.id = cetidpolice+"___a" ;
							divaip.class = "InfosPageA" ;
							divaip.style = "font-family:"+cettepolice+";";
							divaip.innerHTML = cettepolice;
							
							var divdivip = document.createElement('div');
							divdivip.id = cetidpolice+'_InfosPage';
														
							divip.appendChild(divaip);							
							divip.appendChild(divdivip);				
							
							var divinputip = document.createElement('input');
							divinputip.id = cetidpolice;
							divinputip.className = idobj;
							divinputip.type = 'hidden';
							divinputip.value = cettepolice;
							
							divip.appendChild(divinputip);				
							document.getElementById(idobj+'_policeform').appendChild(divip);							
							
						}

						document.getElementById(idobj+'_policemakemenu').style.display = 'none';							
						document.getElementById(idobj+'_policeform').style.display = 'block';							

					}
					else
					{						
											
					
// alert (idobj+'_InfosPage\n\n'+document.getElementById(idobj+'_InfosPage').innerHTML+'\n\n'+idobj_given+ ' --- '+idobj);
						
						
						if (document.getElementById(idobj+'_InfosPage') != null)
						{
							var lediv_po = document.getElementById(idobj+'_InfosPage');
							if (document.getElementById(idobj+'_InfosPage').getElementsByTagName('ul')[0] != null)
							{
								var leul_po = document.getElementById(idobj+'_InfosPage').getElementsByTagName('ul')[0];
								lediv_po.removeChild(leul_po);
							}
							lediv_po.innerHTML = '';
						
						/*
							if (CSS_OTO_EDITOR.form.uldespolices != null)
								alert (CSS_OTO_EDITOR.form.uldespolices+'\n'+idobj+'_InfosPage');
					*/
							if (CSS_OTO_EDITOR.form.uldespolices == null || CSS_OTO_EDITOR.form.liste_des_polices_remake == 1 || (CSS_OTO_EDITOR.form.uldespolices_id != idobj+'_InfosPage'))
							{
						
								var lenewul = document.createElement('ul');
								lenewul.className = 'menu_police';
							
							//	lenewul.onmouseout = function () { alert (this.parentNode.id); this.parentNode.style.display = 'none';} ;

								var lenewul_liactions = document.createElement('li');
								lenewul_liactions.className = 'actions';
								
								var lenewul_explications = document.createElement('span');
								
								lenewul_explications.id = idobj+'_actionexplain';
								

								var liste_actions_menupolice = new Array('before','replace','after','delete');
								var liste_actions_explics_menupolice = new Array('placer avant ','remplacer','placer ensuite','supprimer');
								
								for (ui=0; ui<liste_actions_menupolice.length; ui++)
								{
									var lenewul_liactionsradio = document.createElement('input');

									lenewul_liactionsradio.className = idobj+'_action';
									lenewul_liactionsradio.type = 'radio';
									lenewul_liactionsradio.name = idobj+'_action';
									


									lenewul_liactionsradio.onmouseover = function () { document.getElementById(this.name+'explain').innerHTML = this.title; }; 
									lenewul_liactionsradio.onmouseout = function () { CSS_OTO_EDITOR.form.menu_police_explique(this); }; 
									lenewul_liactionsradio.onmousedown = function () { CSS_OTO_EDITOR.form.menu_police_set_action(this); }; 									
									
									lenewul_liactionsradio.value = liste_actions_menupolice[ui];
									lenewul_liactionsradio.title = liste_actions_explics_menupolice[ui];

									if (liste_actions_menupolice[ui] == 'replace')
									{
										lenewul_liactionsradio.checked = true;
										lenewul_explications.innerHTML = liste_actions_explics_menupolice[ui];
										lenewul_liactionsradio.id = idobj+'_replace';
										
									}
									if (liste_actions_menupolice[ui] == 'delete')
									{
										lenewul_liactionsradio.className = 'delete';
										lenewul_liactionsradio.onclick = function () {CSS_OTO_EDITOR.form.set_police(this);}; 
										lenewul_liactionsradio.id = idobj+'_delete';
									}
									lenewul_liactions.appendChild(lenewul_liactionsradio);
									
								}
								
								lenewul_liactions.appendChild(lenewul_explications);
								
								lenewul.appendChild(lenewul_liactions);
								
								
								
								
								
						
								var lespolices_T = CSS_OTO_EDITOR.form.polices_liste();
						//		var html_form_polices_elements_create = '';
								
						//		alert (lespolices_T.join(' --- '));
								for (po=0; po<lespolices_T.length; po++)
								{
									
										var cettepolice = lespolices_T[po].replace(/'|"/gi, '');
										var cettevaluepolice = lespolices_T[po];
										
							//			html_form_polices_elements_create += CSS_OTO_EDITOR.make.html_form_list_base_units.replace(/___element_choix___/g, cettevaluepolice);
										
										var le_input = document.createElement('input');
										var le_a = document.createElement('a');
										var le_li = document.createElement('li');
										
										le_input.value = cettevaluepolice;
										le_input.id = idobj+'_input'+po;
										le_input.type = 'hidden';
										
										le_a.href = '#MemeEndroit';
										le_a.innerHTML = cettevaluepolice;
										le_a.id = idobj+'_a'+po;
										
										le_a.style.fontFamily = cettepolice;
										
										le_a.onclick = function (){ CSS_OTO_EDITOR.form.set_police(this); };
										
										le_li.appendChild(le_a);
										le_li.appendChild(le_input);
										lenewul.appendChild(le_li);
										
								}
	
								CSS_OTO_EDITOR.form.uldespolices_id = idobj+'_InfosPage';
								CSS_OTO_EDITOR.form.uldespolices = lenewul;
								CSS_OTO_EDITOR.form.liste_des_polices_remake = 0;
						
								if (document.getElementById(idobj+'_replace') != null) 
									document.getElementById(idobj+'_replace').checked = true;	
						
						
							}
							
							lediv_po.appendChild(CSS_OTO_EDITOR.form.uldespolices);

					//		alert (idobj+'\n\n___sinew: '+lenewul+'\n_______\n\n'+CSS_OTO_EDITOR.form.uldespolices);
							
							InfosPage(objpourid);	
						
						//	objpourid.getElementsByTagName('div')[0].style.display = 'block';					
						//	objpourid.getElementsByTagName('div')[0].style.border = '1px #FF0000 solid';					
						
						
						}
						
					}
				};
				
				
			}
			


		
// STYLES ET MENUS OUVRANTS DU FORM CSS		
			if (document.oToCSSstylesform == null)
			{			
				var css_oto_edit_styles = document.createElement('link');
				css_oto_edit_styles.href = 'CSS_oTo_edition.css';
				css_oto_edit_styles.rel = 'stylesheet';
				css_oto_edit_styles.type = 'text/css';
				
				document.head.appendChild(css_oto_edit_styles);
				
				document.oToCSSstylesform = 'ok';
			}
						

// INCORPORATION DU FORM CSS		

		//	$('#'+indiv).append(HTML_form_return);

		//	document.getElementById(indiv).innerHTML = HTML_form_return;
			
			
			if (document.getElementById('CSS_oTo_form') != null)
			{
				var divconteneur = document.getElementById(indiv);
				var divformulaire = document.getElementById('CSS_oTo_form');
				divconteneur.removeChild(divformulaire);
			}
			var el = self.oTo_html2DOM('<div id="CSS_oTo_form">'+HTML_form_return+'</div>');
			
			if (document.getElementById(indiv).appendChild(el)) self.adapterLargeur();

// SCRIPT SELECTEUR DE COULEUR DU FORM CSS		
			if (document.oToCSScolorform == null)
			{			
				var css_oto_edit_colorscript = document.createElement('script');
				css_oto_edit_colorscript.type = 'text/javascript';
				css_oto_edit_colorscript.src = 'jscolor/oTo_jscolor.js';
				
				document.head.appendChild(css_oto_edit_colorscript);
				
				
				document.oToCSScolorform = 'ok';
			}





			
			if (ereurre != '') 	
				alert(ereurre);

		
		
		}, 
		
		translate : function (expr)
		{
			return(expr);
			
		},
		
		add_liste_valeur:function (obj) 
		{
			
			
			var levaluechange_input = document.getElementById(obj.id.replace(/___c[0-9]+.+$/, '_valuechange'));
			
		//	alert (levaluechange_input.value);
			
			levaluechange_input.value = levaluechange_input.value.replace(/([^+]+)$/, '$1 +++ $1'); 


		//	alert (levaluechange_input.value);
			if (self.set_value()) 
			{ 
		//		alert ('ok set value'); 
				CSS_OTO_EDITOR.form.make(document.getElementById(self.id_a_maj), self.form_in_div);
			}
			
		} ,

		suppr_liste_valeur:function (obj) 
		{
			
			var id_obj = obj.id;
			var id_divliste = obj.parentNode.id;
			var id_valeur_0 = id_obj.replace(/^(.+___)[0-9]+_supprlisteval$/, '$1')+'0';
			
			document.getElementById(id_divliste).innerHTML = '';
			

			if (self.set_value(id_valeur_0)) 
			{ 
			//	alert ('ok set value'); 
				CSS_OTO_EDITOR.form.make(document.getElementById(self.id_a_maj), self.form_in_div);
			}
			
			
		} ,
		
		liste_proprietes :function (){
			
			if (self.liste_proprietes == null)
			{
				self.liste_proprietes = new array();
				
				for (nomprop in oTo_CSS_modele['properties'])
				{
					self.liste_proprietes.push(nomprop);
				}
				
				self.liste_proprietes.sort();
			}
			
			return (self.liste_proprietes);
		},
				
    	set_value:function( wantedid, object ) 
        {
			
			var erreure = '';

			if (wantedid != null)
			{
				var id_a = wantedid.replace(/(___a)?$/, '');
				var id_racine = wantedid.replace(/___[0-9]+$/, '');
				var idvaluechange = id_racine.replace(/___c[0-9]+$/, '');
				
		//		alert (wantedid+'\n'+id_a+'\n'+id_racine+'\n'+idvaluechange);
				
				var fromliste = '';
				
			//	object = document.getElementById(id_a);
				
				if (document.getElementById(wantedid+'_exval') != null && document.getElementById(wantedid+'_exval').value == '')
					document.getElementById(wantedid+'_exval').value = '11';
				
				if (object != null && object.href != null) // Si la valeur vient d'un objet <A>
				{
					if (document.getElementById(wantedid+'___a') != null)
					{
						var valeur_nouvelle = object.innerHTML;
						var ainfospage_T = document.getElementById(wantedid+'_InfosPage').getElementsByTagName('a');
						var liinfospage_T = document.getElementById(wantedid+'_InfosPage').getElementsByTagName('li');
						var nbdea = 0;
						
						
						document.getElementById(wantedid+'___a').innerHTML = valeur_nouvelle;
						
						// divtest___div.css_properties___0___font-size___0___c1___0
						// divtest___div.css_properties___0___font-size___0___c0___0
						
						
						// alert (wantedid+' - '+document.getElementById(wantedid));
						
						if (document.getElementById(wantedid) != null && !valeur_nouvelle.match(/^(px|em|%|pt|mm|cm)$/) )
						{
							document.getElementById(wantedid).value = '';	
							document.getElementById(wantedid).style.display = 'none';	
						}
						else if (document.getElementById(wantedid) != null)
						{
							document.getElementById(wantedid).style.display = 'inline';	
							
							if (document.getElementById(wantedid).value == '')
								document.getElementById(wantedid).value = document.getElementById(wantedid+'_exval').value ;
						}
						
			//		var rapport = '';
						for (numa=0; numa<liinfospage_T.length; numa++)
						{
		
							liinfospage_T[numa].style.display = 'block';
							
							if (liinfospage_T[numa].getElementsByTagName('a')[0] != null)
							{
								liinfospage_T[numa].getElementsByTagName('a')[0].style.display = 'block';
								var cette_a_valeur = liinfospage_T[numa].getElementsByTagName('a')[0].innerHTML;
								
							}
	
			//		rapport += numa+' : '+liinfospage_T[numa].style.display+' -'+cette_a_valeur+'- == -'+valeur_nouvelle+'\n';
	
							if (cette_a_valeur == valeur_nouvelle)
							{
								liinfospage_T[numa].style.display = 'none';
								
								// alert (valeur_nouvelle+'\n'+self.translate('color'));
								
								if (valeur_nouvelle.match(/^px|em|%|pt|mm|cm$/))
								{
									document.getElementById(idvaluechange+'_valuechange').value = document.getElementById(wantedid).value+valeur_nouvelle;									
								}
								else if (valeur_nouvelle == self.translate('color') && document.getElementById(wantedid+'_divinputcolortext') != null)
								{
									document.getElementById(wantedid+'_colorhexa').value = '#F66';
									document.getElementById(wantedid+'_colorhexa').style.display = 'block';
									document.getElementById(idvaluechange+'_valuechange').value = '#F66';									
								}
								
								else if (document.getElementById(wantedid+'_divinputcolortext') != null)
								{
									document.getElementById(wantedid+'_colorhexa').style.display = 'none';
									document.getElementById(idvaluechange+'_valuechange').value = valeur_nouvelle;									
								}
								
								
							}
							
						}
						
				//		alert (valeur_nouvelle+' '+liinfospage_T.length+'\n\n'+rapport);
						
					//	fromliste = 'oui';
		
					}
					
				}
	
				else if (document.getElementById(wantedid+'_divinputcolortext') == null && /* document.getElementById(wantedid) != null  && document.getElementById(wantedid+'_exval') != null && */ document.getElementById(wantedid).className == 'numeric' && document.getElementById(wantedid).value.match(/^[-,.0-9]+$/) )
				{
					document.getElementById(wantedid+'_exval').value = document.getElementById(wantedid).value.replace(/,/g, '.') ;
					document.getElementById(wantedid).value = document.getElementById(wantedid+'_exval').value ;
				}
				else if (document.getElementById(wantedid+'_divinputcolortext') == null )
				{
				//	document.getElementById(wantedid).value = document.getElementById(wantedid+'_exval').value;
		
					// A VERIFIER TYPE DE NOMBRE 
					if (document.getElementById(wantedid).value.replace(/^\s+|\s*$/g, '') != '')
						erreure += 'Veuillez indiquer un nombre.\n';
						
				}
				
				if (erreure != '')
				{
					alert (erreure);
				}
				else
				{
					if (document.getElementById(idvaluechange+'_valuechange') != null)
					{
						var new_valeur = '';
						var nb_nuls = 0;
								
						var imax_maxparams = 6;
								
						for (i_maxparams=0; i_maxparams<imax_maxparams; i_maxparams++)
						{
						
							var new_valeur_val = '';
							var new_valeur_unit = '';
							var new_valeur_color = '';
							
							var new_valor = '';
							
							var no_valeur_new = false;
							
							if (document.getElementById(id_racine+'___'+i_maxparams+'___a') != null)
							{							
								new_valeur_unit = document.getElementById(id_racine+'___'+i_maxparams+'___a').innerHTML;	
								
								if (new_valeur_unit == self.translate('color'))
									new_valeur_unit = '';
								else if (document.getElementById(wantedid+'_divinputcolortext') != null)
									no_valeur_new = true;	
								
										
							}
							
							if (no_valeur_new == false && document.getElementById(id_racine+'___'+i_maxparams) != null)
							{
								new_valeur_val = document.getElementById(id_racine+'___'+i_maxparams).value;	
							}
							
							if (new_valeur_unit == new_valeur_val)
								new_valeur_val = '';
							
							new_valor = new_valeur_val+new_valeur_unit;
							
							
							if (new_valor != '' && !new_valor.match(/^(px|em|pt|%|mm|cm)$/))
							{
								if (new_valeur != '')
									new_valeur += ' ';
									
								new_valeur += new_valor;
							}
							
							if (new_valor == '')
							{
								nb_nuls ++;
								if (nb_nuls == 15)
									imax_maxparams = 0;
									
							}
							
							imax_maxparams ++;
		
						}
						
						
						document.getElementById(idvaluechange+'_valuechange').value = new_valeur;
					}
				}
			}
					
				
				
			
			if (erreure == '')
			{
						
				var new_value_css_allform = '';
				
	
				var css_names_form = document.getElementById(self.form_in_div).getElementsByClassName('css_name');
				var css_properties_form = document.getElementById(self.form_in_div).getElementsByClassName('css_properties');
				
				for (css_name_idx=0; css_name_idx < css_names_form.length; css_name_idx++)
				{
					var css_name = css_names_form[css_name_idx];
					var css_properties = css_properties_form[css_name_idx];
					
					if (new_value_css_allform != '')
						new_value_css_allform += '\n';
						
						
					if (css_properties != null && css_properties != '' && typeof(css_properties.getElementsByClassName) == 'function')
					{
						var css_name_property_name_T = css_properties.getElementsByClassName('css_property_name_ok');
						var css_name_property_value_T = css_properties.getElementsByClassName('css_property_value_ok');
						
						var for_new_valcssallf = '';
						
						for (css_name_property_idx = 0; css_name_property_idx < css_name_property_name_T.length; css_name_property_idx++)
						{
							var css_name_property_name = css_name_property_name_T[css_name_property_idx];
							var css_name_property_value = css_name_property_value_T[css_name_property_idx];
							
							
							if (css_name_property_name != null  && css_name_property_value != null && css_name_property_name.value != '' && css_name_property_value.value != '' && css_name_property_name.value != 'undefined' && css_name_property_value.value != 'undefined')
							{
	
								if (for_new_valcssallf != '')
									for_new_valcssallf += '\n';
									
								var lavaleur_css_name_property_value1 = css_name_property_value.value;
								
								var lavaleur_css_name_property_value2 = lavaleur_css_name_property_value1.replace(/ \+\+\+ /g, ',' );	
								var lavaleur_css_name_property_value3 = lavaleur_css_name_property_value2.replace(/ +, +/g, ',');	
								var lavaleur_css_name_property_value4 = lavaleur_css_name_property_value3.replace(/ +\/ +/g, '/');	
								var lavaleur_css_name_property_value5 = lavaleur_css_name_property_value4.replace(/ +\/ +/g, '/');	
								
								var lavaleur_css_name_property_value = lavaleur_css_name_property_value5.replace(/\/+$/g, '');	
								
						//		if (css_name_property_name.value == 'box-shadow')
						//			alert ('base : '+css_name_property_value.value+'\n\n2 : '+lavaleur_css_name_property_value2+'\n\nok : '+lavaleur_css_name_property_value);
				
									
								for_new_valcssallf += '	'+css_name_property_name.value+' : '+lavaleur_css_name_property_value+';'; 
							}
							

						}
						
						
					}
					
					if (css_name != 'definition CSS sans nom' && for_new_valcssallf != '')
					{
						new_value_css_allform += css_name.innerHTML; 
						new_value_css_allform += ' {\n';
	
						new_value_css_allform += for_new_valcssallf;
						
						new_value_css_allform += '\n';
						new_value_css_allform += ' }\n';
					 
					}
					
					
				}
				
				var valouinnerhtm = '';
				
				if (document.getElementById(self.id_a_maj).value != null)
				{
					document.getElementById(self.id_a_maj).value = new_value_css_allform;
					
					valouinnerhtm = 'value';
				}
				else
				{
					document.getElementById(self.id_a_maj).value = new_value_css_allform;
					valouinnerhtm = 'innerhtml';
					
					
				}
				
				self.apply_on_page = 1;
				
				if (self.apply_on_page == 1)
				{
					if (document.is_css_ajour != null)
						document.head.removeChild(document.is_css_ajour);
						
					document.is_css_ajour = document.createElement('style');
					document.is_css_ajour.type = 'text/css';
					document.is_css_ajour.innerHTML = new_value_css_allform;

					document.head.appendChild(document.is_css_ajour);
					

				}
				
				return (true);
			}
			
			
	//		alert (valouinnerhtm+' \n\n'+new_value_css_allform);
    	}
   
		
		
		
	}; // fin de classe

// trick JavaScript pour émuler le self:: en PHP : on utilise une variable locale
	var self = CSS_OTO_EDITOR.form;
	
})(); // fin de scope local

// De n'importe où, en JavaScript, on peut donc appeler ces fonctions de cette manière :
// onchange="CSS_OTO_EDITOR.form.make(this, 'divtest');"


