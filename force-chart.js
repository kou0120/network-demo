var rmargin = 200;
var tmargin = 50;
var height = 680 + tmargin;
var width = height + rmargin;

function chart(data, ncolor, ecolor, mtitle, ltitle, lltitle, topn){

  var ncount = data.nodes.length;

  /* 节点颜色 */
  const color = d3.scaleOrdinal(ncolor);

  /* 联线颜色 */
  const colorplinks = d3.interpolate(ecolor[1], ecolor[0]);
  const colornlinks = d3.interpolate(ecolor[1], ecolor[2]);

  //const nodeCount = d3.selectselectAll("nodes").size();

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-(10000 / ncount)))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3.create("svg")
    .attr("viewBox", [(-width + rmargin) / 2, -(height + tmargin) / 2, width, height]);

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke", function(d) { 
      if(d.value > 0){
        var colorlinks = colorplinks(Math.abs(d.value));
      }else{
        var colorlinks = colornlinks(Math.abs(d.value));
      }
      return colorlinks; })
    .attr("stroke-opacity", d => Math.abs(d.value))
    .attr("stroke-width", 0.3);

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.each(function (d) {
    var radius = d.value;
    var halfRadius = radius / 2;
    var halfCircumference = 2 * Math.PI * halfRadius;

    d3.select(this).insert("circle")
      .attr("id", "parent-pie")
      .attr("r", radius)
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    if (d.group && d.sort <= topn) {
      d3.select(this)
      .attr("fill", color(d.group))
    } else {
      d3.select(this)
      .attr("fill", "#bdbdbd") // 默认颜色
    }

    if (d.pieChart)
      var percentToDraw = 0;
      for (var p in d.pieChart) {
        percentToDraw += d.pieChart[p].percent;

        d3.select(this).insert('circle', '#parent-pie + *')
          .attr("r", halfRadius)
          .attr("fill", 'transparent')
          .style('stroke', color(d.pieChart[p].color))
          .style('stroke-width', radius)
          .style('stroke-dasharray',
            halfCircumference * percentToDraw / 100
              + ' '
              + halfCircumference);
      };
  });

  node.append("title").text(d => d.id);

  simulation
    .nodes(data.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(data.links);

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;})
      .attr("y1", function (d) {
        return d.source.y;})
      .attr("x2", function (d) {
        return d.target.x;})
      .attr("y2", function (d) {
        return d.target.y;});

    d3.selectAll("circle")
      .attr("cx", function (d) {
        return d.x;})
      .attr("cy", function (d) {
        return d.y;});
  };

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = d.x;
    d.fy = d.y;
  };

  /* 节点图例 */
  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", (width - rmargin) / 2)
    .attr("y", -(height - tmargin) / 2 + 9)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", (width - rmargin) / 2 + 24)
    .attr("y", -(height - tmargin) / 2 + 16)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; });

  /* 连线图例 */
  const linklegend = svg.selectAll(".linklegend")
    .data(['-1.0', '-0.9', '-0.8', '-0.7', '0.7', '0.8', '0.9', '1.0'])
    .enter().append("g")
    .attr("class", "linklegend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  linklegend.append("line")
    .attr("x1", (width - rmargin) / 2)
    .attr("x2", (width - rmargin) / 2 + 18)
    .attr("y1", (height - tmargin) / 2 - 180 + 1)
    .attr("y2", (height - tmargin) / 2 - 180 + 1)
    .style("stroke-array","5,5")
    .style("stroke", function(d) { 
      if(d > 0){
        var colorlinks = colorplinks(Math.abs(d));
      }else{
        var colorlinks = colornlinks(Math.abs(d));
      }
      return colorlinks; })
    .attr("stroke-opacity", d => Math.abs(Number(d)))
    .attr("stroke-width", 2);

  linklegend.append("text")
    .attr("x", (width - rmargin) / 2 + 24)
    .attr("y", (height - tmargin) / 2 - 180)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; });

  /* 主标题 */
  const title = svg.append("g")
    .attr("class", "title");

  title.append("text")
    .attr("x", 0)             
    .attr("y", -(height - tmargin / 2) / 2)
    .attr("text-anchor", "middle")  
    .text(mtitle);

  /* 节点图例标题 */
  const legend_title = svg.append("g")
    .attr("class", "legend_title");

  legend_title.append("text")
    .attr("x", (width - rmargin) / 2)             
    .attr("y", -(height - tmargin) / 2)
    .attr("text-anchor", "start")  
    .text(ltitle);

  /* 连线图例标题 */
  const linklegend_title = svg.append("g")
    .attr("class", "linklegend_title");

  linklegend_title.append("text")
    .attr("x", (width - rmargin) / 2)             
    .attr("y", (height - tmargin) / 2 - 180 - 16)
    .attr("text-anchor", "start")  
    .text(lltitle);

  return svg.node();
};

