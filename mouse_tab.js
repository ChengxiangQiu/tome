treeJSON = d3.json("mouse.json", function(error, treeData) {

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1200 - margin.right - margin.left,
    height = 1475 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData;
update(root);

// the code used to create the list of 20 timepoints 
var timepoint_names = ['E3.50', 'E4.50', 'E5.25', 'E5.50', 'E6.25', 'E6.50', 'E6.75', 'E7.00', 'E7.25', 'E7.50', 'E7.75', 'E8.00', 'E8.25', 'E8.5a', 'E8.5b', 'E9.50', 'E10.5', 'E11.5', 'E12.5', 'E13.5'];

var ul = d3.select("#graph").append('ul')
    .style("list-style-type", "none")

ul.selectAll('li')
    .data(timepoint_names)
    .enter()
    .append('li')
    .style("float", "left")
    .style("padding", "6.5px")
    .html(String);
// done

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 48; });
    nodes.forEach(function(d) { d.x = d.fx * 15; });

    // Declare the nodes
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    let myMap = new Map()
        myMap.set("neuroectoderm", "#145A32")
        myMap.set("surface_ectoderm", "#78281F")
        myMap.set("endoderm", "#9A7D0A")
        myMap.set("mesoderm", "#2471A3")
        myMap.set("exe_germ", "#E67E22")
        myMap.set("other", "#000000")

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .attr("data-legendGermlayer",function(d) { return d.node_group}) // real legend - germ layers
        .attr("data-legendCelltype",function(d) { return d.fx})        // fake legend - the list of cell type name on the right side
        .on("click", function(d){
            var node_id = d.node_id;
            clickNode(node_id);
            })       // utilize the D3 function to update information in the bootstrap dialog
        .attr("data-toggle", "modal") // display the bootstrap dialog
        .attr("data-target", "#NodeModal").style("cursor", "pointer") // display the bootstrap dialog
        .on("mouseover", function(d) {

            // set all the other nodes/links/legendCelltype to vaguely visulization, except the current node
            link.style("opacity", 0.2);
            legendCelltype.style("opacity", 0.2);
            var selectedMethod = d.name;
            node.style("opacity",
                function(e){
                    return (e.name === selectedMethod)? 1.0:0.2;
                });
            // done

            var g = d3.select(this); // The node
            // The class is used to remove the additional text later
            var info = g.select('text')
                .attr("dx", -80)
                .attr("dy", -10)
                .attr("fill", "blue")
                .style("font-size", "20px")
                .style("font-weight", "bold")
                .style("fill-opacity", 1);

        })
        .on("mouseout", function() {
            // Remove the info text on mouse out.
            // change everything back when mouseout
            link.style("opacity", function(d){
                return d.target.edge_weight;
            });
            node.style("opacity", 1);
            legendCelltype.style("opacity", 1);

            d3.select(this).select('text')
                .attr("dx", -10)
                .attr("dy", 10)
                .attr("fill", "white")
                .style("font-size", "1px")
                .style("fill-opacity", 0)
        });

    nodeEnter.append("circle")
        .attr("r", 6)
        .style("z-index", function(d) {return d.zindex})
        .style("fill", function(d){return myMap.get(d.node_group)})
        .style("stroke", function(d){return myMap.get(d.node_group)});

    nodeEnter.append("text")
        .attr("dx", -10)
        .attr("dy", 10)
        .attr('class', 'nodeText')
        .attr("text-anchor", 'start')
        .text(function(d) {
            return d.display_name;
        })
        .style("font-size", "1px")
        .style("fill-opacity", 0);

    // Declare the links
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal)
        .on("click", clickLink) 
        .attr("opacity", function(d){
            return d.target.edge_weight;})
        .attr("data-toggle", "modal") // display the bootstrap dialog
        .attr("data-target", "#EdgeModal").style("cursor", "pointer") // display the bootstrap dialog

    // the real figure legend, corresponding to the germ layers
    legendGermlayer = svg.append("g")
        .attr("class","legend")
        .style("font-size","20px")
        .attr("transform","translate(75,100)")
        .attr("data-style-padding",10)
        .call(d3.legendGermlayer)
    // done

    // a fake legend to generate the cell type list showed on the right side
    legendCelltype = svg.append("g")
        .attr("class","legend")
        .style("font-size","10px")
        .attr("transform","translate(960,17)")
        .attr("data-style-padding",1)
        .call(d3.legendCelltype)
    // done

    //Init NodeTable
    d3.select("#NodeTable")
       .append("table")
    // done

    // Init NodeVelocityPlot
    d3.select("#NodeVelocityPlot1")
        .append("image");
    d3.select("#NodeVelocityPlot2")
        .append("image");
    // done

    // Init NodeScatterPlot
    d3.select("#NodeScatterPlotSelection")
        .append("select");
    d3.select("#NodeScatterPlotVis")
        .append("svg");
    // done

    // To click a node
    function clickNode(node_id) {

        // remove the original table/plots
        d3.select("#NodeTable")
            .select("table")
            .remove();
        d3.select("#NodeVelocityPlot1")
            .select("image")
            .remove();
        d3.select("#NodeVelocityPlot2")
            .select("image")
            .remove();
        d3.select("#NodeScatterPlotSelection")
            .select("select")
            .remove();
        d3.select("#NodeScatterPlotVis")
            .select("svg")
            .remove();
        // done

        // update the NodeTable
        d3.tsv("NodeTable.tsv", function(error, NodeData) {
            
            NodeArray = [];
            NodeData.forEach(function(d, i){// update the NodeTable
                NodeArray.push([d.key, d[node_id]]);
            });
            // update the title of NodePage as well
            d3.select("#NodeTitle")
                .text(NodeArray[0][1].replace(':', ' : '));

            //Add a new (updated) NodeTable
            d3.select("#NodeTable")
                .append("table")
                .attr("style", "font-size: 15px")
                .append("tbody")
                .selectAll("tr")
                .data(NodeArray)
                .enter()
                .append("tr")
                .selectAll("td")
                .data(function(d) {return d;})
                .enter()
                .append("td")
                .html(function(d) {return d;})
                .selectAll(".fake-link")
                .on("click", function(){
                    var touch_id = d3.select(this).attr('id');
                    clickNode(touch_id);
                });

        });
        // done


        // update the NodeVelocityPlot
        if(vcplot.has(node_id)){

            d3.select("#NodeVelocityPlot1")
                .append("image")
                .attr("xlink:href",vcplot.get(node_id))
                .attr("width", '400px')
                .attr("height", '400px')

            d3.select("#NodeVelocityPlot2")
                .append("image")
                .attr("xlink:href",vcplot_day.get(node_id))
                .attr("width", '430px')
                .attr("height", '430px')

            d3.select('#NodeVelocityPlot')
                .select('h4')
                .text('RNA velocity clarifies relationships between cell states.')

        } else {
            d3.select('#NodeVelocityPlot')
                .select('h4')
                .text('Sorry, no RNA velocity results are available for the current cell state.')
        }
        // done

        // update the NodeScatterPlot

        d3.tsv('BestPath.tsv', function(error, BestPathDataOrg){
    
            var BestPathData = BestPathDataOrg.filter(function(d) { 
                return d['node_id'] == node_id
            });

            // address those states which don't have ExpState
            if(BestPathData.length === 0){
                d3.select('#NodeScatterPlot')
                    .select('h4')
                    .text('');
                d3.select('#NodeScatterPlot')
                    .select('p')
                    .text('');
            } else {
                var BestPathState = BestPathData[0]['best_path'].split(",");
                var BestPathGene = BestPathData[0]['gene_use'].split(",");

                d3.tsv('ExpState.tsv', function(error, ExpStateDataOrg) {

                    // select ExpStateData which are included in BestPathKeepState
                    var ExpStateData = ExpStateDataOrg.filter(function(d) { 
                        return BestPathState.indexOf(d.state) >= 0
                    });

                    var NodeMargin = {top: 20, right: 200, bottom: 100, left: 100},
                        NodeWidth = 800 - NodeMargin.left - NodeMargin.right,
                        NodeHeight = 400 - NodeMargin.top - NodeMargin.bottom;

                    var NodeScatterPlotSelect = d3.select("#NodeScatterPlotSelection")
                        .append('select')
                        .attr('class','select')
                        .on('change', NodeOnChange)

                    var NodeScatterPlotOptions = NodeScatterPlotSelect
                        .selectAll('option')
                        .data(BestPathGene).enter()
                        .append('option')
                        .text(function (d) { return d; });

                    function NodeOnChange() {

                        $('#node_scatter_plot').remove();
                        var node_gene_id = d3.select("#NodeScatterPlotSelection")
                            .select('select')
                            .property('value');

                        // setup x 
                        var NodexValue = function(d) { return d.pseudotime;}, // data -> value
                            NodexScale = d3.scale.linear().range([0, NodeWidth]), // value -> display
                            NodexMap = function(d) { return NodexScale(NodexValue(d));}, // data -> display
                            NodexAxis = d3.svg.axis().scale(NodexScale).orient("bottom");

                        // setup y
                        var NodeyValue = function(d) { return d[node_gene_id];}, // data -> value
                            NodeyScale = d3.scale.linear().range([NodeHeight, 0]), // value -> display
                            NodeyMap = function(d) { return NodeyScale(NodeyValue(d));}, // data -> display
                            NodeyAxis = d3.svg.axis().scale(NodeyScale).orient("left");

                        // setup fill color
                        var NodecValue = function(d) { return d.celltype;},
                            color = d3.scale.category10();

                        // append the svg object to the body of the page
                        var Nodesvg = d3.select("#NodeScatterPlotVis").append("svg")
                            .attr("id", 'node_scatter_plot')
                            .attr("width", NodeWidth + NodeMargin.left + NodeMargin.right)
                            .attr("height", NodeHeight + NodeMargin.top + NodeMargin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + NodeMargin.left + "," + NodeMargin.top + ")");

                        // change string (from CSV) into number format
                        ExpStateData.forEach(function(d) {
                            d.pseudotime = +d.pseudotime;
                            d[node_gene_id] = +d[node_gene_id];
                        });

                        // don't want dots overlapping axis, so add in buffer to data domain
                        NodexScale.domain([d3.min(ExpStateData, NodexValue)-1, d3.max(ExpStateData, NodexValue)+1]);
                        NodeyScale.domain([d3.min(ExpStateData, NodeyValue)-1, d3.max(ExpStateData, NodeyValue)+1]);

                        // x-axis
                        Nodesvg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + NodeHeight + ")")
                            .call(NodexAxis)
                            .append("text")
                            .attr("class", "label")
                            .attr("x", NodeWidth)
                            .attr("y", 40)
                            .style("text-anchor", "end")
                            .text("Pseudotime")
                            .style("font-size", "15px");

                        // y-axis
                        Nodesvg.append("g")
                            .attr("class", "y axis")
                            .call(NodeyAxis)
                            .append("text")
                            .attr("class", "label")
                            .attr("transform", "rotate(-90)")
                            .attr("y", -55)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("Log(normalized expression of " + node_gene_id +")")
                            .style("font-size", "15px");

                        // draw dots
                        Nodesvg.selectAll(".dot")
                            .data(ExpStateData)
                            .enter().append("circle")
                            .attr("class", "dot")
                            .attr("r", 3.5)
                            .attr("cx", NodexMap)
                            .attr("cy", NodeyMap)
                            .style("fill", function(d) { return color(NodecValue(d));}); 

                        // draw legend
                        var legendNodeScatterPlot = Nodesvg.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                        // draw legend colored rectangles
                        legendNodeScatterPlot.append("rect")
                            .attr("x", NodeWidth + 20)
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", color);

                        // draw legend text
                        legendNodeScatterPlot.append("text")
                            .attr("x", NodeWidth + 40)
                            .attr("y", 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "start")
                            .text(function(d) { return d;})
                    };
                });
            }
        });
    }

    //Init EdgeTable
    d3.select("#EdgeTable")
        .append("table")
    // done

    // Init EdgeScatterPlot
    d3.select("#EdgeScatterPlotSelection")
        .append("select");
    d3.select("#EdgeScatterPlotVis1")
        .append("svg");
    d3.select("#EdgeScatterPlotVis2")
        .append("svg");
    // done

    // To click a edge
    function clickLink(d) {

        var source_node_id = d.source.node_id;
        var target_node_id = d.target.node_id;
        var edge_id = source_node_id + '_' + target_node_id;

        // remove the original table/plots
        d3.select("#EdgeTable")
            .select("table")
            .remove();
        d3.select("#EdgeScatterPlotSelection")
            .select("select")
            .remove();
        d3.select("#EdgeScatterPlotVis1")
            .select("svg")
            .remove();
        d3.select("#EdgeScatterPlotVis2")
            .select("svg")
            .remove();
        // done

        //Load in contents of CSV file, and do things to the data.
        d3.tsv("EdgeTable.tsv", function(error, EdgeDataOrg) {

            var EdgeArray = [];
            EdgeDataOrg.forEach(function(d, i){
                EdgeArray.push([d.key, d[edge_id]]);
            });

            d3.select("#EdgeTitle")
                .text('Edge: ' + source_node_id + ' to ' + target_node_id);

            //Add a new (updated) NodeTable
            d3.select("#EdgeTable")
              .append("table")
              .attr("style", "font-size: 15px")
              .append("tbody")
              .selectAll("tr")
              .data(EdgeArray)
              .enter()
              .append("tr")
              .selectAll("td")
              .data(function(d) {return d;})
              .enter()
              .append("td")
              .html(function(d) {return d;})
              .selectAll(".fake-link")
              .attr("data-toggle", "modal") // display the bootstrap dialog
              .attr("data-target", "#NodeModal").style("cursor", "pointer") // display the bootstrap dialog
              .on("click", function(){
                  var touch_id = d3.select(this).attr('id');
                  clickNode(touch_id);
                  $("#EdgeModal").modal('toggle');
              });
        });

        // make the two UMAP plots
        // change local to https://tome.gs.washington.edu/
        d3.tsv('https://tome.gs.washington.edu/exp/' + target_node_id + '_' + source_node_id + '.tsv', function(error, EdgeExpDataOrg) {

            if (error) {
                d3.select('#EdgeScatterPlot')
                .select('h4')
                .text('');
            d3.select('#EdgeScatterPlot')
                .select('p')
                .text('');
            }

            var EdgeMargin = {top: 20, right: 200, bottom: 100, left: 100},
                EdgeWidth = 500 - EdgeMargin.left - EdgeMargin.right,
                EdgeHeight = 400 - EdgeMargin.top - EdgeMargin.bottom;

            // setup x 
            var EdgexValue = function(d) { return d.UMAP_1;}, // data -> value
                EdgexScale = d3.scale.linear().range([0, EdgeWidth]), // value -> display
                EdgexMap = function(d) { return EdgexScale(EdgexValue(d));}, // data -> display
                EdgexAxis = d3.svg.axis().scale(EdgexScale).orient("bottom");

            // setup y
            var EdgeyValue = function(d) { return d.UMAP_2;}, // data -> value
                EdgeyScale = d3.scale.linear().range([EdgeHeight, 0]), // value -> display
                EdgeyMap = function(d) { return EdgeyScale(EdgeyValue(d));}, // data -> display
                EdgeyAxis = d3.svg.axis().scale(EdgeyScale).orient("left");

            // setup fill color
            var cValue_1 = function(d) { return d.Anno;},
                color_1 = d3.scale.category10();

            // the first scatter plot used to show the cell type (state)
            var Edgesvg_1 = d3.select("#EdgeScatterPlotVis1").append("svg")
                .attr("width", EdgeWidth + EdgeMargin.left + EdgeMargin.right)
                .attr("height", EdgeHeight + EdgeMargin.top + EdgeMargin.bottom)
                .append("g")
                .attr("transform", "translate(" + EdgeMargin.left + "," + EdgeMargin.top + ")");

            // change string (from CSV) into number format
            EdgeExpDataOrg.forEach(function(d) {
                d.UMAP_1 = +d.UMAP_1;
                d.UMAP_2 = +d.UMAP_2;
            });

            // don't want dots overlapping axis, so add in buffer to data domain
            EdgexScale.domain([d3.min(EdgeExpDataOrg, EdgexValue)-1, d3.max(EdgeExpDataOrg, EdgexValue)+1]);
            EdgeyScale.domain([d3.min(EdgeExpDataOrg, EdgeyValue)-1, d3.max(EdgeExpDataOrg, EdgeyValue)+1]);

            // x-axis
            Edgesvg_1.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + EdgeHeight + ")")
                .call(EdgexAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", EdgeWidth)
                .attr("y", 40)
                .style("text-anchor", "end")
                .text("UMAP_1");

            // y-axis
            Edgesvg_1.append("g")
                .attr("class", "y axis")
                .call(EdgeyAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", -30)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("UMAP_2");

            // draw dots
            Edgesvg_1.selectAll(".dot")
                .data(EdgeExpDataOrg)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 2.5)
                .attr("stroke", '#000')
                .attr("cx", EdgexMap)
                .attr("cy", EdgeyMap)
                .style("fill", function(d) { return color_1(cValue_1(d));});

            // draw legend
            var EdgeLegend_1 = Edgesvg_1.selectAll(".legend")
                .data(color_1.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            // draw legend colored rectangles
            EdgeLegend_1.append("rect")
                .attr("x", EdgeWidth - 20)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color_1);

            // draw legend text
            EdgeLegend_1.append("text")
                .attr("x", EdgeWidth - 0)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d) { return d;})

            var edge_gene_list = d3.keys(EdgeExpDataOrg[0]);
                edge_gene_list.shift();
                edge_gene_list.shift();
                edge_gene_list.shift();
                edge_gene_list.shift();
                edge_gene_list.shift();

            var EdgeScatterPlotSelect = d3.select("#EdgeScatterPlotSelection")
                .append('select')
                .attr('class','select')
                .on('change', EdgeOnChange)

            var EdgeScatterPlotOptions = EdgeScatterPlotSelect
                .selectAll('option')
                .data(edge_gene_list).enter()
                .append('option')
                .text(function (d) { return d; });

            function EdgeOnChange() {
                $('#edge_scatter_plot').remove();
                var edge_gene_id = d3.select('#EdgeScatterPlotSelection')
                    .select('select')
                    .property('value');

                var domain_max =  d3.max(EdgeExpDataOrg, function(d) { return d[edge_gene_id];});
                var domain_min =  d3.min(EdgeExpDataOrg, function(d) { return d[edge_gene_id];});

                // setup fill color
                var cValue_2 = function(d) { return d[edge_gene_id];},
                    color_2 = d3.scale.linear().domain([domain_min, domain_max]).range(['beige', 'red']);

                // append the svg object to the body of the page
                var Edgesvg_2 = d3.select("#EdgeScatterPlotVis2").append("svg")
                    .attr("id", 'edge_scatter_plot')
                    .attr("width", EdgeWidth + EdgeMargin.left + EdgeMargin.right)
                    .attr("height", EdgeHeight + EdgeMargin.top + EdgeMargin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + EdgeMargin.left + "," + EdgeMargin.top + ")");

                // don't want dots overlapping axis, so add in buffer to data domain
                EdgexScale.domain([d3.min(EdgeExpDataOrg, EdgexValue)-1, d3.max(EdgeExpDataOrg, EdgexValue)+1]);
                EdgeyScale.domain([d3.min(EdgeExpDataOrg, EdgeyValue)-1, d3.max(EdgeExpDataOrg, EdgeyValue)+1]);

                // x-axis
                Edgesvg_2.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + EdgeHeight + ")")
                    .call(EdgexAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", EdgeWidth)
                    .attr("y", 40)
                    .style("text-anchor", "end")
                    .text("UMAP_1");

                // y-axis
                Edgesvg_2.append("g")
                    .attr("class", "y axis")
                    .call(EdgeyAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -30)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("UMAP_2");

                // draw dots
                Edgesvg_2.selectAll(".dot")
                    .data(EdgeExpDataOrg)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 2.5)
                    .attr("cx", EdgexMap)
                    .attr("cy", EdgeyMap)
                    .style("fill", function(d) { return color_2(cValue_2(d));});

                Edgesvg_2.append("text")
                    .attr("x", 10)             
                    .attr("y", -5)
                    .attr("text-anchor", "bottom")  
                    .style("font-size", "15px") 
                    .text("Log(normalized expression of " + edge_gene_id +")");

                // add the legend now
                var legendFullHeight = 120;
                var legendFullWidth = 15;

                var legendMargin = { top: 10, bottom: 10, left: 5, right: 0 };

                // use same margins as main plot
                var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right;
                var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;

                var legendSvg = Edgesvg_2.append("g")
                    .attr("class", "legend")
                    .attr('width', legendFullWidth)
                    .attr('height', legendFullHeight)
                    .attr('transform', 'translate(' + legendMargin.left + ',' +
                    legendMargin.top + ')');

                updateColourScale(['beige', 'red']);

                function updateColourScale(scale) {
                    // create colour scale
                    var colorScale = d3.scale.linear()
                        .domain(linspace(domain_min, domain_max, scale.length))
                        .range(scale);

                    // clear current legend
                    legendSvg.selectAll('*').remove();

                    // append gradient bar
                    var gradient = legendSvg.append('defs')
                        .append('linearGradient')
                        .attr('id', 'gradient')
                        .attr('x1', '0%') // bottom
                        .attr('y1', '100%')
                        .attr('x2', '0%') // to top
                        .attr('y2', '0%')
                        .attr('spreadMethod', 'pad');

                    // programatically generate the gradient for the legend
                    // this creates an array of [pct, colour] pairs as stop
                    // values for legend
                    var pct = linspace(0, 100, scale.length).map(function(d) {
                        return Math.round(d) + '%';
                    });

                    var colourPct = d3.zip(pct, scale);

                    colourPct.forEach(function(d) {
                        gradient.append('stop')
                            .attr('offset', d[0])
                            .attr('stop-color', d[1])
                            .attr('stop-opacity', 1);
                    });

                    legendSvg.append('rect')
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('width', legendWidth)
                        .attr('height', legendHeight)
                        .style('fill', 'url(#gradient)');

                    // create a scale and axis for the legend
                    var legendScale = d3.scale.linear()
                        .domain([domain_min, domain_max])
                        .range([legendHeight, 0]);

                    var legendAxis = d3.svg.axis()
                        .scale(legendScale)
                        .orient("right")
                        .tickValues(d3.range(domain_min, domain_max))
                        .tickFormat(d3.format("d"));

                    legendSvg.append("g")
                        .attr("class", "legend axis")
                        .attr("transform", "translate(" + legendWidth + ", 0)")
                        .call(legendAxis);
                }

                function linspace(start, end, n) {
                    var out = [];
                    var delta = (end - start) / (n - 1);

                    var i = 0;
                    while(i < (n - 1)) {
                        out.push(start + (i * delta));
                        i++;
                    }

                    out.push(end);
                    return out;
                }

            };

        });

    }


}
});



