app.controller("tController", function($scope){});

app.controller("tHome", function($scope){document.title="Home";});
app.controller("tContact", function($scope){document.title="Contact";});

app.controller("tCatalogue", function($scope, $http, $interval){
	$scope.items=[];
	$scope.FuzzySearch=function FuzzySearch(os,c,$=this,z={},f=(_,$)=>_.forEach($)){f(c.keys,d=>z[d.name]={});for(let i=os.length;i;){i--;f(c.keys,(k)=>{let x=k.name;x in os[i]?f(os[i][x].split(c.delimiter),k=>(k=c.lowerCase?k.toLowerCase():k)&"characterWhiteList"in c?k=k.split("").filter(x=>c.characterWhiteList.has(x)).join(""):0&!k||k.length<c.minWordLength?0:(k in z[x]?1:z[x][k]=[])&z[x][k].push(i)):0})}$.search=(t,r={},q=t.split(c.delimiter),s,i,x)=>{f(c.keys,k=>f(Object.keys(z[k.name]),x=>{s=0;f(q,q=>{for(i=x.length;i;)q.charAt(--i)==x.charAt(i)?s++:0});s?f(z[k.name][x],i=>r[i]=(i in r?r[i]:0)+s*k.weight):0}));x=[];f(Object.keys(r),k=>x.push({result:os[k],score:r[k]}));return x.sort((a,b)=>{return b.score-a.score})}};
	$scope.fuzzyConfig={keys:[{name:"name",weight:7},{name:"description",weight:1}],delimiter:" ",lowerCase:true,minWordLength:0};
	let nGrams=function nGrams(c,o,g={},x=this,y=(_,$,a)=>_.substring($,a),q=_=>Math.random()*_|0,h=_=>_.length,_=(_,i=0,r)=>{_=y(c,_,h(c)-_);for(;i<h(_)-o;i++){r=y(_,i,i+o);r in g?0:g[r]=[];g[r].push(_.charAt(i+o))}}){x.generateOutput=(_,$=q(h(c)),i=0,p,a=y(c,$,$+o))=>{for(;i<_-o;i++)(p=g[y(a,i,i+o)])&(p?a+=p[q(h(p))]:i=_);return a},x.appendToCorpus=t=>(c+=t)&_(h(c)),x.reset=r=>{c="",g={}};_(0)};
	//
	
	$http.get("./corpus.txt").then(function(res){
		$scope.corpus=res.data;
		$http.get("./catalogueItems/info.json").then(function(res){
			$scope.items=res.data;
			$scope.visibleItems=$scope.items;
			$scope.search=new $scope.FuzzySearch($scope.items,$scope.fuzzyConfig);
			$scope.categoriesSet=new Set(["All"]);
			let gram=new nGrams($scope.corpus,6);
			$scope.items.forEach(w=>{w.category?$scope.categoriesSet.add(w.category):0;w.image="./catalogueItems/"+w.image;w.description?0:w.description=gram.generateOutput(200)});
			$scope.categories=Array.from($scope.categoriesSet);
			$scope.category=$scope.categories[0];
		});
	});
	
	
	// Stolen from WilliamSandyToes
	document.title="Catalogue";
	$interval(function(){
		if($scope.oFez==$scope.fez&&$scope.oCategory==$scope.category)return;$scope.visibleItems=[];
		if(!$scope.fez)$scope.items.forEach(w=>w.category==$scope.category||$scope.category=="All"?$scope.visibleItems.push(w):0);
		else $scope.search.search($scope.fez.toLowerCase()).forEach(w=>w.result.category==$scope.category||$scope.category=="All"?$scope.visibleItems.push(w.result):0);
		$scope.oFez=$scope.fez;$scope.oCategory=$scope.category;},50);
		
	$scope.bigImage = function(imageSrc){
		document.getElementById('bigImage').style.display='block';
		let i=document.getElementById('bigImageImage');
		i.src=imageSrc;
		if(i.naturalHeight>i.naturalWidth)i.height=window.innerHeight*0.8,i.width=(i.height/i.naturalHeight)*i.naturalWidth;else i.width=window.innerWidth*0.65,i.height=(i.width/i.naturalWidth)*i.naturalHeight;
	};
});