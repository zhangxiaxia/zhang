var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 980 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var color=d3.scale.category20();

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);
var y1=d3.scale.linear()
	.range([height,height-height/3]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");
	
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
	
var y1A=d3.svg.axis()
	.scale(y1)
	.orient("right");

var line = d3.svg.line()
	.interpolate("linear")
	.x(function(d,i){return x(d.Time);})
	.y(function(d){return y(d.Price);});
var line1 = d3.svg.line()
	.interpolate("linear")
	.x(function(d,i){return x(d.Time);})
	.y(function(d,i){return y1(d.Emotion);});	
	
var svg = d3.select("#zhexian").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/zhexian.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Time = parseDate(d.Time);
    d.Price = +d.Price;
    d.Emotion=+d.Emotion;
  });

  x.domain(d3.extent(data, function(d) { return d.Time; }));
  y.domain([2000, d3.max(data, function(d) { return d.Price; })]);
  y1.domain([-150,d3.max(data,function(d){return d.Emotion;})]);
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
//纵左边坐标
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price");
 //横右边坐标
  svg.append("g")
      .attr("class", "axis")
	    .attr("transform","translate("+width+ ",0)")
      .call(y1A)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -250)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Emotion");
  //上面折线
  svg.append("path")
       .data(data)
       .attr("class","path1")
      .attr("d", line(data));
  //下面折线
  svg.append("path")
       .data(data)
      .attr("class","path1")
      .attr("d", line1(data)); 
  //画圆上面折线
  svg.selectAll("svg")
	.data(data)
	.enter()
	.append("circle")
	.attr("id","c1")
	.attr("cx", function(d,i) {
	return x(d.Time);
	})
	.attr("cy", function(d) {
	return y(d.Price);
	})
	.attr("r",5)
	.attr("fill", function(d,i) {
	return color(i);
	})
	;
//画圆下面折线
svg.selectAll("svg")
	.data(data)
	.enter()
	.append("circle")
    .attr("id","c2")
	.attr("cx", function(d,i) {
	return x(d.Time);
	})
	.attr("cy", function(d) {
	return y1(d.Emotion);
	})
	.attr("r",5)
	.attr("fill", function(d,i) {
	return color(i);
	})
	;	
	//画线条
svg.selectAll("circle")
	.on("mouseover",function(d,i){

		var tx=parseFloat(d3.select(this).attr("cx")),
		    ty=parseFloat(d3.select(this).attr("cy"));
		d3.select(this)
			.transition()
			.duration(5000)
			.ease("elastic")
			.attr("stroke-width",4)
			.attr("stroke","red")
			.attr("fill","white")
			.attr("r",7);

		var tips=svg.append("g")
		.attr("id","tips");
        var tipRect=tips.append("rect")
                    .attr("x",tx+10)
                    .attr("y",ty+10)
                    .attr("width",140)
                    .attr("height",30)
                    .attr("fill","#FFF")
                    .attr("stroke-width",1)
                    .attr("stroke","blue");
                if(d3.select(this).attr("id")=="c1"){
                var tipText=tips.append("text")
                    .attr("class","tiptools")
                    tipText.text("Pr.:"+d.Price+",Em.:"+d.Emotion)
                    .attr("x",tx+20)
                    .attr("y",ty+30);}
                 else if(d3.select(this).attr("id")=="c2"){
                 	var tipText=tips.append("text")
                    .attr("class","tiptools")
                    tipText.text("Em.:"+d.Emotion+",Pr.:"+d.Price)
                    .attr("x",tx+20)
                    .attr("y",ty+30);}
                 
       var showLine=svg.append("g")
         .attr("id","sl");
       var tipline=showLine.append("line")
          .attr("x1",tx)
          .attr("x2",tx)
          .attr("y1",0)
          .attr("y2",450)
          .style("stroke","blue")
          .style("stroke-width",3);
	})
	.on("mouseout",function(d,i){
                d3.select("#tips").remove();
                d3.select("#sl").remove();
        
				d3.select(this)
					.transition()
					.attr("fill",function(d,i){
					return color(i);})
					.attr("r",5)
					.attr("stroke-width",0);
            });
});