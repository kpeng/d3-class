$(function() {
  var data = [5, 2, 9, 7, 6, 1];
  var width = 760, height = 480, chunk = width / data.length;

  // Create the SVG element with the appropriate attributes and append it onto
  // the element with the visualization id
  var chart = d3.select('#visualization')
    .append('svg')
      // You see we can change the properties of the elements here
      .attr('class', 'chart')
      // SVG canvas width
      .attr('width', width)
      // SVG canvas height
      .attr('height', height)
    // Create a svg:g "group" element, everything under that group has the same
    // transformations applied
    .append('g')
      // Like this translation
      .attr('transform', 'translate(10, 15)');

  // Ordinal scale maps discrete domain onto continuous range
  var x = d3.scale.ordinal()
    .domain(data)
    .rangeBands([0, width]);

  // Linear scale maps continuous domain onto continuous range
  var y = d3.scale.linear()
    .domain([0, 10])
    .range([0, height]);

  chart.selectAll('rect')
    // Bind the data set
    .data(data)
    // Append rectangle elements
    .enter().append('rect')
      // x-coordinate position
      .attr('x', x)
      // y-coordinate position
      .attr('y', function(d) { return height - y(d); })
      // width attribute
      .attr('width', chunk)
      // height attribute
      .attr('height', y);

  // We do the same, except now we create SVG "text" elements
  chart.selectAll('text')
    .data(data)
    .enter().append('text')
      .attr('x', function(d) { return x(d) + x.rangeBand() / 2; } )
      .attr('y', function(d) { return height - y(d); })
      // A delta offset
      .attr('dy', '-.35em')
      // Middle-aligned
      .attr('text-anchor', 'middle')
      // The text() function takes a function to render the data
      .text(String);
});
