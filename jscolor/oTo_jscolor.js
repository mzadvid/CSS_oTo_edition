/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2013-04-08
 * @link    http://jscolor.com
 */


var jscolor = {


	dir : '', // location of jscolor directory (leave empty to autodetect)
	bindClass : 'color', // class name
	binding : true, // automatic binding via <input class="...">
	preloading : true, // use image preloading?


	install : function() {
		jscolor.addEvent(window, 'load', jscolor.init);
	},


	init : function() {
		if(jscolor.binding) {
			jscolor.bind();
		}
		if(jscolor.preloading) {
			jscolor.preload();
		}
	},


	getDir : function() {
		if(!jscolor.dir) {
			var detected = jscolor.detectDir();
			jscolor.dir = detected!==false ? detected : 'jscolor/';
		}
		return jscolor.dir;
	},


	detectDir : function() {
		var base = location.href;

		var e = document.getElementsByTagName('base');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].href) { base = e[i].href; }
		}

		var e = document.getElementsByTagName('script');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
				var src = new jscolor.URI(e[i].src);
				var srcAbs = src.toAbsolute(base);
				srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
				srcAbs.query = null;
				srcAbs.fragment = null;
				return srcAbs.toString();
			}
		}
		return false;
	},


	bind : function() {
		var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for(var i=0; i<e.length; i+=1) {
			var m;
			if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if(m[3]) {
					try {
						prop = (new Function ('return (' + m[3] + ')'))();
					} catch(eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},


	preload : function() {
		for(var fn in jscolor.imgRequire) {
			if(jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},


	images : {
		pad : [ 181, 101 ],
		sld : [ 16, 101 ],
		sldopa : [ 16, 101 ],
		cross : [ 15, 15 ],
		arrow : [ 7, 11 ]
	},


	imgRequire : {},
	imgLoaded : {},


	requireImage : function(filename) {
		jscolor.imgRequire[filename] = true;
	},


	loadImage : function(filename) {
		if(!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
		}
	},


	fetchElement : function(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},


	addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},


	fireEvent : function(el, evnt) {
		if(!el) {
			return;
		}
		if(document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if(document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on'+evnt, ev);
		} else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
			el['on'+evnt]();
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


	getRelMousePos : function(e) {
		var x = 0, y = 0;
		if (!e) { e = window.event; }
		if (typeof e.offsetX === 'number') {
			x = e.offsetX;
			y = e.offsetY;
		} else if (typeof e.layerX === 'number') {
			x = e.layerX;
			y = e.layerY;
		}
		return { x: x, y: y };
	},


	getViewPos : function() {
		if(typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},


	getViewSize : function() {
		if(typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},


	URI : function(uri) { // See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function(uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function() {
			var result = '';
			if(this.scheme !== null) { result = result + this.scheme + ':'; }
			if(this.authority !== null) { result = result + '//' + this.authority; }
			if(this.path !== null) { result = result + this.path; }
			if(this.query !== null) { result = result + '?' + this.query; }
			if(this.fragment !== null) { result = result + '#' + this.fragment; }
			return result;
		};

		this.toAbsolute = function(base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI;

			if(base.scheme === null) { return false; }

			if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if(r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if(r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if(r.path === '') {
						t.path = base.path;
						if(r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if(r.path.substr(0,1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if(base.authority !== null && base.path === '') {
								t.path = '/'+r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/,'')+r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while(path) {
				if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
					path = path.replace(/^\.+/,'').substr(1);
				} else if(path.substr(0,3)==='/./' || path==='/.') {
					path = '/'+path.substr(3);
				} else if(path.substr(0,4)==='/../' || path==='/..') {
					path = '/'+path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if(path==='.' || path==='..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if(uri) {
			this.parse(uri);
		}

	},


	//
	// Usage example:
	// var myColor = new jscolor.color(myInputElement)
	//

	color : function(target, prop) {


		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.slider = true; // show the value/saturation slider?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.onImmediateChange = null; // onchange callback (can be either string or function)
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1

		this.opacity = 1; // read-only  0-1, 0-1, 0-1
		this.invisibleValue = false;
		this.onclosefunction = '';
		this.colors_to_liste = new Array();
		this.colors_liste_n_cols = 0;
		this.colors_liste_width = 0;
		
		
		this.minH = 0; // read-only  0-6
		this.maxH = 6; // read-only  0-6
		this.minS = 0; // read-only  0-1
		this.maxS = 1; // read-only  0-1
		this.minV = 0; // read-only  0-1
		this.maxV = 1; // read-only  0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerSmartPosition = true; // automatically adjust picker position when necessary
		this.pickerButtonHeight = 20; // px
		this.pickerClosable = false;
		this.pickerCloseText = 'Close';
		this.pickerButtonColor = 'ButtonText'; // px
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;


		for(var p in prop) {
			if(prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}


		this.hidePicker = function() {
			if(isPickerOwner()) {
				removePicker();
			}
		};


		this.showPicker = function() {
			if(!isPickerOwner()) {
				var tp = jscolor.getElementPos(target); // target pos
				var ts = jscolor.getElementSize(target); // target size
				var vp = jscolor.getViewPos(); // view pos
				var vs = jscolor.getViewSize(); // view size
				var ps = getPickerDims(this); // picker size
				var a, b, c;
				switch(this.pickerPosition.toLowerCase()) {
					case 'left': a=1; b=0; c=-1; break;
					case 'right':a=1; b=0; c=1; break;
					case 'top':  a=0; b=1; c=-1; break;
					default:     a=0; b=1; c=1; break;
				}
				var l = (ts[b]+ps[b])/2;

				// picker pos
				if (!this.pickerSmartPosition) {
					var pp = [
						tp[a],
						tp[b]+ts[b]-l+l*c
					];
				} else {
					var pp = [
						-vp[a]+tp[a]+ps[a] > vs[a] ?
							(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
							tp[a],
						-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
							(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
							(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
					];
				}
				drawPicker(pp[a], pp[b]);
			}
		};


		this.importColor = function() {
			if(!valueElement) {
				this.exportColor();
			} else {
				if(!this.adjust) {
					if(!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if(!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);

				} else if(this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};


		this.exportColor = function(flags) {
			if(!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if(this.caps) { value = value.toUpperCase(); }
				if(this.hash) { value = '#'+value; }
				valueElement.value = value;
			}
			if(!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundImage = "none";
				styleElement.style.backgroundColor =
					'#'+this.toString();
					
					
				if (THIS.invisibleValue == true)
				{	
					styleElement.style.color = '#'+this.toString();
				}
				else
				{
					styleElement.style.color =
						0.213 * this.rgb[0] +
						0.715 * this.rgb[1] +
						0.072 * this.rgb[2]
						< 0.5 ? '#FFF' : '#000';
				}
					
					
					
			}
			if(!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if(!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
			if(isPickerOwner()) {
				redrawSldopa();
			}
		};


		this.fromOpacity = function(opacity) { // null = don't change

			// alert ('1 : '+valueElement.opacity+' '+opacity)	;

			if (opacity == 'undefined' || opacity == '' || opacity == null) 
			{ 
				valueElement.opacity = 1;
				THIS.opacity = 1;
			}
			else 
			{
				valueElement.opacity = opacity;
				THIS.opacity = Math.round(opacity*100)/100;
				
		//		alert(valueElement.opacity);
			}
			
			redrawSldopa();
			
//			this.exportColor(flags);
		};

		this.fromHSV = function(h, s, v, flags) { // null = don't change
			if(h !== null) { h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h)); }
			if(s !== null) { s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s)); }
			if(v !== null) { v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v)); }

			this.rgb = HSV_RGB(
				h===null ? this.hsv[0] : (this.hsv[0]=h),
				s===null ? this.hsv[1] : (this.hsv[1]=s),
				v===null ? this.hsv[2] : (this.hsv[2]=v)
			);

			this.exportColor(flags);
		};

		

		this.fromRGB = function(r, g, b, flags) { // null = don't change
		
			if(r !== null) { r = Math.max(0.0, Math.min(1.0, r)); }
			if(g !== null) { g = Math.max(0.0, Math.min(1.0, g)); }
			if(b !== null) { b = Math.max(0.0, Math.min(1.0, b)); }

			var hsv = RGB_HSV(
				r===null ? this.rgb[0] : r,
				g===null ? this.rgb[1] : g,
				b===null ? this.rgb[2] : b
			);
			if(hsv[0] !== null) {
				this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
			}
			if(hsv[2] !== 0) {
				this.hsv[1] = hsv[1]===null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
			}
			this.hsv[2] = hsv[2]===null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			
			this.rgb[0] = rgb[0];
			this.rgb[1] = rgb[1];
			this.rgb[2] = rgb[2];

			this.exportColor(flags);
		};


		this.fromString = function(hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if(!m) {
				return false;
			} else {
				if(m[1].length === 6) { // 6-char notation
					this.fromRGB(
						parseInt(m[1].substr(0,2),16) / 255,
						parseInt(m[1].substr(2,2),16) / 255,
						parseInt(m[1].substr(4,2),16) / 255,
						flags
					);
				} else { // 3-char notation
					this.fromRGB(
						parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
						parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
						parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
						flags
					);
				}
				return true;
			}
		};

		this.RGB_Hexa = function (ra,ga,ba) {
			var red = parseInt(ra);
			var green = parseInt(ga);
			var blue = parseInt(ba);
			
			var rgb = blue | (green << 8) | (red << 16);
			return rgb.toString(16);
		};
		
		this.HSV_Hexa = function (ha, sa, va) {
			
			var ragaba = THIS.HSV_RGB(ha, sa, va);
			
			return (THIS.RGB_Hexa(ragaba[0],ragaba[1],ragaba[2]));
		}

		this.apply_color = function (color_selected) {

			var ok_change = 'yes';	

			var reg_hsv = /^hsv[^.0-9]+([.0-9]+)\s*,\s*([.0-9]+)\s*,\s*([.0-9]+)\s*[^.0-9a-f]$/gi;
			var reg_rgb = /^rgb(a)?[^.0-9]+([.0-9]+)\s*,\s*([.0-9]+)\s*,\s*([.0-9]+)\s*,?\s*([.0-9]+)?\s*[^.0-9a-f]$/gi;
			var reg_hexa = /^#([0-9a-f]{3})([0-9a-f]{3})?$/gi;
			
			var forfromopacity = 1;
			if (reg_hexa.test(color_selected))
			{
				valueElement.value = color_selected.replace(reg_hexa, '$1$2');
			//	alert ('reg_hexa : '+color_selected+' '+valueElement.value);

			}
			else if (reg_rgb.test(color_selected))
			{
				var vals_T = color_selected.replace(reg_rgb, '$2-$3-$4-$5').split('-');
				
				valueElement.value = THIS.RGB_Hexa(vals_T[0],vals_T[1],vals_T[2]);
				
				if (vals_T[3] != null && vals_T[3] != 'undefined' && vals_T[3] != '')
					forfromopacity = vals_T[3];
				
			//	alert ('reg_rgb : '+color_selected+' '+valueElement.value+'\n'+forfromopacity);
			}
			else if (reg_hsv.test(color_selected))
			{
				var vals_T = color_selected.replace(reg_rgb, '$1-$2-$3').split('-');
				
				valueElement.value = THIS.HSV_Hexa(vals_T[0],vals_T[1],vals_T[2]);
				
			//	alert ('reg_hsv : '+color_selected+' '+valueElement.value);
			}
			else 
			{
				
				var rapp = '';
				for (ioo in html_named_colors)
				{
					var iois = html_named_colors[ioo];
					
					rapp += '\n'+ioo+''+iois;
					
				}
				
			//	alert (' -'+color_selected+'- -'+color_selected.toLowerCase()+'- '+html_named_colors[color_selected.toLowerCase()]+' --- '+html_named_colors['red']+'\n\n'+rapp);
				
				
				if (html_named_colors != null && html_named_colors[color_selected.toLowerCase()] != 'undefined')
				{
					
					valueElement.value = html_named_colors[color_selected.toLowerCase()];
					alert ('html_named_colors : '+color_selected+' '+valueElement.value);
				}
				else
				{
					alert ('couleur non reconnue : '+color_selected);
					ok_change = 'no';	
				}
			}
			
			
			if (ok_change = 'yes')
			{
				THIS.fromString(valueElement.value);
				THIS.fromOpacity(forfromopacity);
				redrawPad();
				redrawSld();
				jscolor.fireEvent(valueElement,'change');
			}
			
		}
		
		function string_RGB (hex) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if(!m) {
				return false;
			} else {
				if(m[1].length === 6) { // 6-char notation
					var sr = parseInt(m[1].substr(0,2),16) / 255;
					var sv = parseInt(m[1].substr(2,2),16) / 255;
					var sb = parseInt(m[1].substr(4,2),16) / 255;
				} else { // 3-char notation
					var sr = parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255;
					var sv = parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255;
					var sb = parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255;
				}
				
				var areturn = new Array(sr*255, sv*255, sb*255);
				return (areturn);
			}
		};


		this.toString = function() {
			return (
				(0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
			);
		};


		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r,g),b);
			var v = Math.max(Math.max(r,g),b);
			var m = v - n;
			if(m === 0) { return [ null, 0, v ]; }
			var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
			return [ h===6?0:h, m/v, v ];
		}


		function HSV_RGB(h, s, v) {
			if(h === null) { return [ v, v, v ]; }
			var i = Math.floor(h);
			var f = i%2 ? h-i : 1-(h-i);
			var m = v * (1 - s);
			var n = v * (1 - s*f);
			switch(i) {
				case 6:
				case 0: return [v,n,m];
				case 1: return [n,v,m];
				case 2: return [m,v,n];
				case 3: return [m,n,v];
				case 4: return [n,m,v];
				case 5: return [v,m,n];
			}
		}


		function removePicker() {
			delete jscolor.picker.owner;
			document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
			
			if (typeof(THIS.onclosefunction) != '')
			{
				eval(THIS.onclosefunction);
			}
		}


		function drawPicker(x, y) {
			
			// A ajouter : colors_to_liste
			
			if(!jscolor.picker) {
				jscolor.picker = {
					box : document.createElement('div'),
					boxB : document.createElement('div'),
					pad : document.createElement('div'),
					padB : document.createElement('div'),
					padM : document.createElement('div'),
					
					sld : document.createElement('div'),
					sldB : document.createElement('div'),
					sldM : document.createElement('div'),
					
					sldopa : document.createElement('div'),
					sldopaB : document.createElement('div'),
					sldopaM : document.createElement('div'),
					
					colordoc : document.createElement('ul'),
					colordocD : document.createElement('div'),
					
					btn : document.createElement('div'),
					btnS : document.createElement('span'),
					btnT : document.createTextNode(THIS.pickerCloseText)
				};
				
				redrawColorsList(jscolor.picker.colors_to_liste);

				for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
					
					var seg = document.createElement('div');
					seg.style.height = segSize+'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);					
					
					
				}



////////////////////////////////////////


				THIS.value_actuelle = valueElement.value;
				var value_RGB = string_RGB(valueElement.value);
				
				
				var rapp = '';
				// alert (valueElement.value+'\n'+value_RGB[0]+','+value_RGB[1]+','+value_RGB[2]+'\n'+rapp);
								
				jscolor.picker.sldopa.setAttribute("id","opacity_slider");
				
				for(var i=0,segSize=4; i<jscolor.images.sldopa[1]; i+=segSize) {
								
					var inv_i = 100 - i;				
					
					var segopacity = inv_i/100;	
					rapp += segopacity+'\n';
								
										
					var segopa = document.createElement('div');
					segopa.style.height = segSize+'px';
					segopa.style.fontSize = '1px';
					segopa.style.lineHeight = '0';
					segopa.style.marginLeft = '-30px';
					
				//	segopa.style.border = '1px solid #000000';
					segopa.style.backgroundColor = 'rgba('+value_RGB[0]+','+value_RGB[1]+','+value_RGB[2]+','+segopacity+')';
					
					jscolor.picker.sldopa.appendChild(segopa);
					
				}

				// alert (valueElement.value+'\n'+value_RGB[0]+','+value_RGB[1]+','+value_RGB[2]+'\n'+rapp);
				
				
////////////////////////////////////////




				jscolor.picker.sldB.appendChild(jscolor.picker.sld);

				jscolor.picker.sldopaB.appendChild(jscolor.picker.sldopa);
				
				jscolor.picker.sldopaB.style.backgroundImage = 'url(\''+jscolor.getDir()+'bg_opacity.gif\')';
				jscolor.picker.sldopaB.style.backgroundRepeat = 'repeat-y';
				
				jscolor.picker.sldM.style.marginRight = '35px';
				
				
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);

				jscolor.picker.box.appendChild(jscolor.picker.sldopaB);
				jscolor.picker.box.appendChild(jscolor.picker.sldopaM);
				
				
				jscolor.picker.colordocD.appendChild(jscolor.picker.colordoc);
				
				jscolor.picker.box.appendChild(jscolor.picker.colordocD);

				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
				jscolor.picker.btn.appendChild(jscolor.picker.btnS);
				jscolor.picker.box.appendChild(jscolor.picker.btn);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;


			if (valueElement.opacity != null && valueElement.opacity != THIS.opacity)
			{
				THIS.opacity = valueElement.opacity;
// alert (p.opacity+' --- '+THIS.opacity+' --- value element non undefined : '+valueElement.opacity);
				
			}
			else
			{
// alert (p.opacity+' --- '+THIS.opacity+' --- value element undefined ou == THIS.opacity : '+valueElement.opacity);
				valueElement.opacity = THIS.opacity;
			}
			
// alert (p.opacity+' --- '+THIS.opacity+' --- '+valueElement.opacity);

//			p.opacity = THIS.opacity;
//			valueElement.opacity = THIS.opacity;
			
			// controls interaction
			p.box.onmouseup =
			p.box.onmouseout = function() { target.focus(); };
			p.box.onmousedown = function() { abortBlur=true; };
			p.box.onmousemove = function(e) {
				if (holdPad || holdSld || holdSldopa) {
					holdPad && setPad(e);
					holdSld && setSld(e);
					holdSldopa && setSldopa(e);
					
					if (document.selection) {
						document.selection.empty();
					} else if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					dispatchImmediateChange();
				}
			};
			if('ontouchstart' in window) { // if touch device
				p.box.addEventListener('touchmove', function(e) {
					var event={
						'offsetX': e.touches[0].pageX-touchOffset.X,
						'offsetY': e.touches[0].pageY-touchOffset.Y
					};
					if (holdPad || holdSld  || holdSldopa) {
						holdPad && setPad(event);
						holdSld && setSld(event);
						holdSldopa && setSldopa(event);
						dispatchImmediateChange();
					}
					e.stopPropagation(); // prevent move "view" on broswer
					e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
				}, false);
			}
			p.padM.onmouseup =
			p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
			p.padM.onmousedown = function(e) {
				// if the slider is at the bottom, move it up
				switch(modeID) {
					case 0: if (THIS.hsv[2] === 0) { THIS.fromHSV(null, null, 1.0); }; break;
					case 1: if (THIS.hsv[1] === 0) { THIS.fromHSV(null, 1.0, null); }; break;
				}
				holdSld=false;
				holdSldopa=false;
				holdPad=true;
				setPad(e);
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.padM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}
			p.sldM.onmouseup =
			p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
			p.sldM.onmousedown = function(e) {
				holdPad=false;
				holdSld=true;
				holdSldopa=false;
				
				setSld(e);

				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.sldM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}


/////////////////////////////////////////


			p.sldopaM.onmouseup =
			p.sldopaM.onmouseout = function() { if(holdSldopa) { holdSldopa=false; jscolor.fireEvent(valueElement,'change'); } };
			p.sldopaM.onmousedown = function(e) {
				holdPad=false;
				holdSld=false;
				holdSldopa=true;
				
				setSldopa(e);
				
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.sldopaM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}

/////////////////////////////////////////

			// picker
			var dimscolorlist = 0;
			

			if (p.colors_liste_n_cols > 0)
			p.colors_liste_width = p.colors_liste_n_cols*20;

			if (p.colors_liste_width > 0)
				dimscolorlist = p.colors_liste_width + 2*THIS.pickerFace;
			
		//	alert (p.colors_liste_width);	
				
			var dims = getPickerDims(THIS);
			p.box.style.width = dims[0]+dimscolorlist + 'px';
			p.box.style.height = dims[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = x+'px';
			p.boxB.style.top = y+'px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder+'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0]+'px';
			p.pad.style.height = jscolor.images.pad[1]+'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace+'px';
			p.padB.style.top = THIS.pickerFace+'px';
			p.padB.style.border = THIS.pickerInset+'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0]+'px';
			p.sld.style.height = jscolor.images.sld[1]+'px';

			// slider border
			p.sldB.style.display = THIS.slider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
		//	p.sldB.style.right = THIS.pickerFace+'px';
			p.sldB.style.left = 5 + THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
		//	p.sldB.style.marginRight = '35px';
			
			p.sldB.style.top = THIS.pickerFace+'px';
			p.sldB.style.border = THIS.pickerInset+'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.display = THIS.slider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
//			p.sldM.style.right = '0';
			p.sldM.style.left = 5 + THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + 'px';

	//		p.sldM.style.border = '#FFFF00 1px solid';

			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.sldM.style.cursor = 'hand';
			}
			
			
			
/////////////////////////////////////////////


			// slider image
			p.sldopa.style.overflow = 'hidden';
			p.sldopa.style.width = jscolor.images.sldopa[0]+'px';
			p.sldopa.style.height = jscolor.images.sldopa[1]+'px';

			// slider border
			p.sldopaB.style.display = THIS.slider ? 'block' : 'none';
			p.sldopaB.style.position = 'absolute';
			
		//	p.sldopaB.style.marginRight = '10px';
			p.sldopaB.style.border = '2px solid #000000';
			
		//	p.sldopaB.style.right = THIS.pickerFace+'px';
		//	p.sldopaB.style.left = THIS.pickerFace + 4*THIS.pickerInset + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + p.sldM.style.width+'px';
			p.sldopaB.style.left = 2*THIS.pickerFace + jscolor.images.sld[0] + 5 + 2*THIS.pickerInset + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + 'px';
			
			
			p.sldopaB.style.top = THIS.pickerFace+'px';
			p.sldopaB.style.border = THIS.pickerInset+'px solid';
			p.sldopaB.style.borderColor = THIS.pickerInsetColor;
			
			

			// slider mouse area
			p.sldopaM.style.display = THIS.slider ? 'block' : 'none';
			p.sldopaM.style.position = 'absolute';
//			p.sldopaM.style.right = '0';
//			p.sldopaM.style.left = THIS.pickerFace + 4*THIS.pickerInset + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + p.sldM.style.width+'px';
			p.sldopaM.style.left = 2*THIS.pickerFace + jscolor.images.sld[0] + 5 + 2*THIS.pickerInset + jscolor.images.pad[0] + 1*jscolor.images.arrow[0] + 'px';
			
			
//			p.sldopaM.style.border = '#FF0000 1px solid';
			
			p.sldopaM.style.top = '0';
			p.sldopaM.style.width = jscolor.images.sldopa[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
			p.sldopaM.style.height = p.box.style.height;
			try {
				p.sldopaM.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.sldopaM.style.cursor = 'hand';
			}



			p.colordoc.style.margin = '0px';
			p.colordoc.style.padding = '0px';
			p.colordoc.style.height = '100px';
			p.colordoc.style.maxHeight = '100px';
			p.colordoc.style.width = p.colors_liste_width+'px';
			

			p.colordoc.style.top = THIS.pickerFace+'px';
			p.colordoc.style.border = THIS.pickerInset+'px solid';
			p.colordoc.style.borderColor = THIS.pickerInsetColor;


			var colors_liste_left = 2*THIS.pickerInset + 4*THIS.pickerFace + jscolor.images.pad[0] + (THIS.slider ? 4*THIS.pickerInset + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] + jscolor.images.sldopa[0] : 0);
			
			p.colordocD.style.left = colors_liste_left+'px';
			p.colordocD.style.top = THIS.pickerFace+'px';
			p.colordocD.style.position = 'absolute';
			
			
			
			p.colordocD.style.margin = '0px';
			p.colordocD.style.padding = '0px';
			p.colordocD.style.height = '100px';
			p.colordocD.style.maxHeight = '100px';
			p.colordocD.style.width = p.colors_liste_width + THIS.pickerInset*2 +'px';
			
			p.colordocD.style.backgroundImage = 'url(\''+jscolor.getDir()+'bg_opacity.gif\')';
			
		//	alert ('left: '+jscolor.picker.colordocD.style.left+'\nwidth: '+jscolor.picker.colordoc.style.width+'\nheight:'+jscolor.picker.colordoc.style.height);

/////////////////////////////////////////////			
			
			
			
			
			

			// "close" button
			function setBtnBorder() {
				var insetColors = THIS.pickerInsetColor.split(/\s+/);
				var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = pickerOutsetColor;
			}
			p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.pickerFace + 'px';
			p.btn.style.bottom = THIS.pickerFace + 'px';
			p.btn.style.padding = '0 15px';
			p.btn.style.height = '18px';
			p.btn.style.border = THIS.pickerInset + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.pickerButtonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			try {
				p.btn.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.btn.style.cursor = 'hand';
			}
			p.btn.onmousedown = function () {
				THIS.hidePicker();
			};
			p.btnS.style.lineHeight = p.btn.style.height;

			// load images in optimal order
			switch(modeID) {
				case 0: var padImg = 'hs.png'; break;
				case 1: var padImg = 'hv.png'; break;
			}
			p.padM.style.backgroundImage = "url('"+jscolor.getDir()+"cross.gif')";
			p.padM.style.backgroundRepeat = "no-repeat";
			
			
		//	p.sldM.style.border = "1px #00FF00 solid";
			p.sldM.style.backgroundImage = "url('"+jscolor.getDir()+"arrow.gif')";
			p.sldM.style.backgroundRepeat = "no-repeat";

		//	p.sldopaM.style.border = "1px #FF0000 solid";
			p.sldopaM.style.backgroundImage = "url('"+jscolor.getDir()+"arrow.gif')";
			p.sldopaM.style.backgroundRepeat = "no-repeat";

			p.pad.style.backgroundImage = "url('"+jscolor.getDir()+padImg+"')";
			p.pad.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundPosition = "0 0";

			// place pointers
			redrawPad();
			redrawSld();
			
			
			
	//		alert (valueElement.opacity+' --- '+THIS.opacity+' --- '+p.opacity+' --- ');
			redrawSldopa();
			redrawColorsList(jscolor.picker.colors_to_liste);

			jscolor.picker.owner = THIS;
			document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}


		function getPickerDims(o) {
			
			var width_colors_liste = 0;
			
			if (THIS.colors_liste_width > 0)
				width_colors_liste = THIS.colors_liste_width + 50;
			
			var dims = [
				2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[0] +
					(o.slider ? 4*o.pickerInset + 4*jscolor.images.arrow[0] + jscolor.images.sld[0] + jscolor.images.sldopa[0] + width_colors_liste : 0),
				o.pickerClosable ?
					4*o.pickerInset + 3*o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight :
					2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[1]
			];
			
		//	alert (width_colors_liste+'\n'+dims[0]);

			return dims;
		}


		function redrawPad() {
			// redraw the pad pointer
			switch(modeID) {
				case 0: var yComponent = 1; break;
				case 1: var yComponent = 2; break;
			}
			var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
			jscolor.picker.padM.style.backgroundPosition =
				(THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
				(THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch(modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for(var i=0; i<seg.length; i+=1) {
						seg[i].style.backgroundColor = 'rgb('+
							(rgb[0]*(1-i/seg.length)*100)+'%,'+
							(rgb[1]*(1-i/seg.length)*100)+'%,'+
							(rgb[2]*(1-i/seg.length)*100)+'%)';
					}
					break;
				case 1:
					var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
					var i = Math.floor(THIS.hsv[0]);
					var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
					switch(i) {
						case 6:
						case 0: rgb=[0,1,2]; break;
						case 1: rgb=[1,0,2]; break;
						case 2: rgb=[2,0,1]; break;
						case 3: rgb=[2,1,0]; break;
						case 4: rgb=[1,2,0]; break;
						case 5: rgb=[0,2,1]; break;
					}
					for(var i=0; i<seg.length; i+=1) {
						s = 1 - 1/(seg.length-1)*i;
						c[1] = c[0] * (1 - s*f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb('+
							(c[rgb[0]]*100)+'%,'+
							(c[rgb[1]]*100)+'%,'+
							(c[rgb[2]]*100)+'%)';
					}
					break;
			}
		}


		function redrawColorsList(colorsliste) {
			
				jscolor.picker.colordoc.innerHTML = '';
				for(var i=0; i<THIS.colors_to_liste.length; i++) {
					
					
					if (i == 0 || i/4 == Math.round( i/4 ) )
					{
						if (i > 0)
						{
							jscolor.picker.colordoc.appendChild(li);
							
							if (i < (THIS.colors_to_liste.length -1))
								jscolor.picker.colors_liste_n_cols ++;
						}
						else
							jscolor.picker.colors_liste_n_cols = 1;
							
						var li = document.createElement('li');
					
						li.style.height = '100px';
						li.style.width = '20px';
						li.style.display = 'block';
						li.style.cssFloat = 'left';
						li.style.padding = '0px';
						li.style.margin = '0px';
						
						
						
					}
					else if (i == (THIS.colors_to_liste.length-1) && li.innerHTML != '')
					{
						jscolor.picker.colordoc.appendChild(li);
						
				//		jscolor.picker.colors_liste_n_cols ++;
						
					}
					var seg = document.createElement('a');
					seg.style.height = '25px';
					seg.style.width = '20px';
					seg.style.fontSize = '12px';
					seg.style.lineHeight = '16px';
					seg.style.margin = '0px';
					seg.style.padding = '0px';
					
					seg.style.display = 'block';
					seg.style.overflow = 'hidden';
					seg.style.textDecoration = 'none';
				//	seg.style.cssFloat = 'left';
					seg.href = '#MemeEndroit';
					seg.style.backgroundColor = THIS.colors_to_liste[i];
					seg.style.borderColor = THIS.colors_to_liste[i];
					seg.innerHTML = '&nbsp;&nbsp;';

					seg.id = 'colors_liste_jsc_'+i;
					seg.title = THIS.colors_to_liste[i];
					
					var lacouleur = THIS.colors_to_liste[i];
						
					var seginp = document.createElement('input');
					seginp.id = seg.id+'_value';
					seginp.value = lacouleur;
					seginp.type = 'hidden';
					
					// controls interaction
					seg.onmouseup =
					seg.onclick = function () { THIS.apply_color(document.getElementById(this.id+'_value').value) }
										
		
					li.appendChild(seg);
					li.appendChild(seginp);
					
				}
		}
		
		function redrawSld() {
			// redraw the slider pointer
			switch(modeID) {
				case 0: var yComponent = 2; break;
				case 1: var yComponent = 1; break;
			}
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
			jscolor.picker.sldM.style.backgroundPosition =
				'0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
		}
		
		function redrawSldopa() {
	
			// refill with ok color : 
			

		//	if (valueElement.value != THIS.value_actuelle)
		//	{
			
		//		jscolor.picker.sldopa.removeChild(segopa);
				
				THIS.value_actuelle = valueElement.value;
				var value_RGB = string_RGB(valueElement.value);
				
				if (document.getElementById('opacity_slider') != null)
					var opadiv = document.getElementById('opacity_slider');
				else
					var opadiv = jscolor.picker.sldopa;
	
					opadiv.innerHTML = '';
					
					var rapp = '';
					// alert (valueElement.value+'\n'+value_RGB[0]+','+value_RGB[1]+','+value_RGB[2]+'\n'+rapp);
					
					
	
					for(var i=0,segSize=4; i<jscolor.images.sldopa[1]; i+=segSize) {
									
						var inv_i = 100 - i;				
						
						var segopacity = inv_i/100;	
						rapp += segopacity+'\n';
									
											
						var segopa = document.createElement('div');
						segopa.style.height = segSize+'px';
						segopa.style.fontSize = '1px';
						segopa.style.lineHeight = '0';
						segopa.style.marginLeft = '-30px';
						
					//	segopa.style.border = '1px solid #000000';
						segopa.style.backgroundColor = 'rgba('+value_RGB[0]+','+value_RGB[1]+','+value_RGB[2]+','+segopacity+')';
						
						opadiv.appendChild(segopa);
						
					}
		//		}
	
	
		//	}
			// redraw the slider pointer
			

			if (THIS.opacity == 'undefined' || THIS.opacity == null)
			{
				valueElement.opacity = 1;
				THIS.opacity = 1;
			}
			
			var y = Math.round((1-THIS.opacity) * (jscolor.images.sldopa[1]-1));
			jscolor.picker.sldopaM.style.backgroundPosition = '0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
		}


		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}


		function blurTarget() {
			if(valueElement === target) {
				THIS.importColor();
			}
			if(THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}


		function blurValue() {
			if(valueElement !== target) {
				THIS.importColor();
			}
		}


		function setPad(e) {
			var mpos = jscolor.getRelMousePos(e);
			var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
				case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
			}
		}


		function setSld(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
				case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
			}
		}

		function setSldopa(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;

			THIS.fromOpacity( 1 - y/(jscolor.images.sldopa[1]-1));
		
//		alert (y+' '+( 1 - y/(jscolor.images.sldopa[1]-1)));
		}


		function dispatchImmediateChange() {
			if (THIS.onImmediateChange) {
				var callback;
				if (typeof THIS.onImmediateChange === 'string') {
					callback = new Function (THIS.onImmediateChange);
				} else {
					callback = THIS.onImmediateChange;
				}
				
				// alert ('3 : '+valueElement.opacity+' '+opacity+' '+valueElement.opacity)	;
				if (valueElement.opacity == null)
				{
					valueElement.opacity = 1;
					THIS.opacity = 1;
				}
				else
				{
	//				alert ('dispatch change : '+valueElement.opacity);
					THIS.opacity = valueElement.opacity;
				}
				callback.call(THIS);
			}
		}


		var THIS = this;
		var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
		var abortBlur = false;
		var
			valueElement = jscolor.fetchElement(this.valueElement),
			styleElement = jscolor.fetchElement(this.styleElement);
		var
			holdPad = false,
			holdSld = false,
			holdSldopa = false,
			
			touchOffset = {};
		var
			leaveValue = 1<<0,
			leaveStyle = 1<<1,
			leavePad = 1<<2,
//			leaveSldopa = 1<<3,
			leaveSld = 1<<3;
			

		// target
		jscolor.addEvent(target, 'focus', function() {
			if(THIS.pickerOnfocus) { THIS.showPicker(); }
		});
		jscolor.addEvent(target, 'blur', function() {
			if(!abortBlur) {
				window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if(valueElement) {
			var updateField = function() {
				THIS.fromString(valueElement.value, leaveValue);
				dispatchImmediateChange();
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if(styleElement) {
			styleElement.jscStyle = {
				backgroundImage : styleElement.style.backgroundImage,
				backgroundColor : styleElement.style.backgroundColor,
				color : styleElement.style.color
			};
		}

		// require images
		switch(modeID) {
			case 0: jscolor.requireImage('hs.png'); break;
			case 1: jscolor.requireImage('hv.png'); break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

};


jscolor.install();
