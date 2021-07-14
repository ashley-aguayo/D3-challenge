// @TODO: YOUR CODE HERE!
//Set Margins
var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create SVG wrapper

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("fill", "black")

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);
    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    
    //create scales
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    //append axes 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)
    var yAxis = chartGroup.append("g")
    .call(leftAxis)
    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    //intialize tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
    return (`${d.state}`);
    });
    //create and call tooltip
    chartGroup.call(toolTip);

    //create event listener
    circlesGroup.on("click", function(data){
        toolTip.show(data,this);
    })
    //mouseout
    .on("mouseout", function(data,index){
        toolTip.hide(data);
    });

    //create labels for the axes
    chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .text("Healthcare");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class","axisText")
    .text("Poverty Percentage");
}).catch(function(error){
    console.log(error);
});