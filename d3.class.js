$(function() {
  var data = [5, 2, 9, 7, 6, 1];
  var width = 760, height = 480, chunk = width / data.length;

  var chart = d3.select('#visualization')
    .append('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(10, 15)');

  var x = d3.scale.ordinal()
    .domain(data)
    .rangeBands([0, width]);

  var y = d3.scale.linear()
    .domain([0, 10])
    .range([0, height]);

  chart.selectAll('rect')
    .data(data)
    .enter().append('rect')
      .attr('x', x)
      .attr('y', function(d) { return height - y(d); })
      .attr('width', chunk)
      .attr('height', y);
});
