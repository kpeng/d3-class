$(function() {
  // Time is integral and monotonically increasing
  var time = 0;
  var data = [next(), next(), next(), next(), next(), next()];

  var width = 760, height = 480, chunk = width / data.length;

  // Returns a data point with a random value between 1 and 10 inclusive
  function next() {
    // Note that each data element is an object with time and value parameters
    return {
      time: ++time,
      value: Math.ceil(Math.random() * 10)
    }
  }

  // Periodic function for removing the initial data point in the array (i.e. the
  // lowest time) and pushing a new point and then calling the magic redraw() 
  setInterval(function() {
    data.shift();
    data.push(next());
    redraw();
  }, 1500);
  
  // This is similar to the static example
  var chart = d3.select('#visualization')
    .append('svg')
      .attr('class', 'chart')
      .attr('width', width)
      .attr('height', height + 40)
    .append('g')
      .attr('transform', 'translate(0, 40)');

  // This is a bit of a cheat, but with the scales, the domain and range calls
  // don't actually impose a restriction on your data.  This maps [0, 1] to
  // [0, chunk], which essentially draws a line between [0, 0], and [1, chunk].
  // Returns a function that represents this line, and if you call this on a
  // value of 2, then the result would be 2 * chunk.
  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, chunk]);

  // rangeRound() is useful for removing anti-aliasing artifacts in the results
  // by rounding the output values.
  var y = d3.scale.linear()
    .domain([0, 10])
    .rangeRound([0, height]);

  redraw();

  function redraw() {
    // Same as before, but note that the second parameter for data() is used now,
    // representing the key that d3.js should index the data on.  This is how
    // d3.js figures out whether data points are new, existing, or need to be
    // removed in the enter(), update(), and exit() transitions.
    var rect = chart.selectAll('rect')
      .data(data, function(d) { return d.time; });

    var labels = chart.selectAll('text')
      .data(data, function(d) { return d.time; });

    // This is the enter() selection, which represents all the elements that
    // exist in the data set you bind at this point, but not in the DOM (as
    // calculated by the indexing function provided before).
    rect.enter()
      .insert('rect', 'text')
        // We actually want the x-coordinate to start off as if the bar was one
        // index greater than it actually is.  This is for the transitioning
        // effect we'll specify later, to create the smooth movement "roll" from
        // the right side.
        .attr('x', function(d, i) { return x(i + 1) - .5; })
        .attr('y', function(d) { return height - y(d.value) - .5; })
        .attr('width', chunk)
        .attr('height', function(d) { return y(d.value); })
      // The transition parameters are duration (how long the transition should
      // last) and the eventual parameters that the SVG element should transition
      // to.  So the ending point is how the bar chart should look if it was
      // static.
      .transition()
        .duration(1000)
        .attr('x', function(d, i) { return x(i) - .5; });

    // Same thing for labels, but the coordinate offsets are slightly different
    // so the labels look properly aligned on top of the bars.
    labels.enter()
      .append('text')
        .attr('x', function(d, i) { return x(i + 1.5) - .5; })
        .attr('y', function(d) { return height - y(d.value) - .5; })
        .attr('dy', '-.35em')
        .attr('text-anchor', 'middle')
        .text(function(d) { return d.value; })
      .transition()
        .duration(1000)
        .attr('x', function(d, i) { return x(i + .5) - .5; });

    // The update() selection is implicit by the call on the element sets rect
    // and labels.  Since at each point each data point "shifts" to the left,
    // then the bars just move (via a similar transition) and only the
    // x-coordinate needs to be changed.
    rect.transition()
      .duration(1000)
      .attr('x', function(d, i) { return x(i) - .5; });

    labels.transition()
      .duration(1000)
      .attr('x', function(d, i) { return x(i + .5) - .5; });

    // The exit() selection is for the SVG elements that exist still in the DOM,
    // but don't exist in the bound data anymore.  Transition to move the bars
    // left and remove the SVG element afterwards.
    rect.exit().transition()
      .duration(1000)
      .attr('x', function(d, i) { return x(i - 1) - .5; })
      .remove();

    labels.exit().transition()
      .duration(1000)
      .attr('x', function(d, i) { return x(i - .5) - .5; })
      .remove();
  }
});
