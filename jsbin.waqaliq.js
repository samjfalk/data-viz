d3.json("https://raw.githack.com/hvo/datasets/master/us-refugees.json")
  .then(function (rawData) {
  var data = rawData.map(row=> {
  return[row.Year,
        Object.entries(row)
         .filter(item=> (item[0]!='Year'))
        .reduce((total, item)=> (total+item[1]), 0)]
});
  createPlot(data);
});



function createPlot(data) {
  var svg = d3.select("#chart")
  .append('svg')
  .attr('width', 300)
  .attr('height', 1000);

svg.append('text')
  .attr('x', 20)
  .attr('y', 25)
  .text('Refugees');

var maxValue = d3.max(data, d => d[1]);

var x = d3.scaleLinear()
.domain([0, maxValue])
.rangeRound([0, 230])

var y = d3.scaleBand()
.domain(data.map(d => d[0]))
.rangeRound([50, 950])

var g = svg.append('g');

var tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip');

g.append("g")
.attr("class", "axis axis--y")
.attr("transform", "translate(55,0)")
.call(d3.axisLeft(y))
.append('text')
  .attr('class', "label")
  .attr('transform', 'rotate(-90)')
  .attr('x', -y.range()[1]*0.5)
  .attr('y', -40)
  .text('Year');


g.selectAll('.bar')
  .data(data)
  .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 60)
    .attr('y', (d,i) => y(d[0]))
    .attr('width', (d,i) => x(d[1]))
    .attr('height', y.bandwidth()-2)
  .on('mouseover', function (d) {
  d3.select(this)
  .transition().ease(d3.easeBounce).duration(500)
  .attr('x', 60-10)
  .attr('y', y(d[0])-2)
  .attr('width', x(d[1])+20)
  .attr('height', y.bandwidth()-2);
  tooltip.text(d[1]);
  tooltip.style('visibility', 'visible');

} )
.on('mousemove', function (d) {
  tooltip.style('top', (d3.event.pageY+20) +"px")
  .style('left', (d3.event.pageX+10) + "px");
} )

.on('mouseout', function (d) {
  d3.select(this)
    .transition().duration(300)
  .attr('x', 60)
  .attr('y', y(d[0]))
  .attr('width', x(d[1]))
  .attr('height', y.bandwidth()-2);
  tooltip.style('visibility', 'hidden')
} )
}