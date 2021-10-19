treeJSON_zf = d3.json("zebrafish.json", function(error, treeData) {

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1200 - margin.right - margin.left,
    height = 980 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#graph_zf").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData;
update(root);

// the code used to create the list of 20 timepoints 
var timepoint_names = ["hpf3.8", "hpf4.3", "hpf4.8", "hpf5.3", " hpf6", " hpf7", " hpf8", " hpf9", " hpf10", " hpf11", " hpf12", " hpf14", " hpf18", " hpf24"];

var ul = d3.select("#graph_zf").append('ul')
    .style("list-style-type", "none")

ul.selectAll('li')
    .data(timepoint_names)
    .enter()
    .append('li')
    .style("float", "left")
    .style("padding-left", "33.5px")
    .html(String);
// done

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 68.5; });
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
        .attr("data-target", "#NodeModal_zf").style("cursor", "pointer") // display the bootstrap dialog
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
        .attr("data-target", "#EdgeModal_zf").style("cursor", "pointer") // display the bootstrap dialog

    // the real figure legend, corresponding to the germ layers
    legendGermlayer = svg.append("g")
        .attr("class","legend")
        .style("font-size","20px")
        .attr("transform","translate(75,100)")
        .attr("data-style-padding",10)
        .call(d3.legendGermlayer_zf)
    // done

    // a fake legend to generate the cell type list showed on the right side
    legendCelltype = svg.append("g")
        .attr("class","legend")
        .style("font-size","10px")
        .attr("transform","translate(960,17)")
        .attr("data-style-padding",1)
        .call(d3.legendCelltype_zf)
    // done

    //Init NodeTable_zf
    d3.select("#NodeTable_zf")
       .append("table")
    // done

    // To click a node
    function clickNode(node_id) {

        // remove the original table/plots
        d3.select("#NodeTable_zf")
            .select("table")
            .remove();
        // done

        // update the NodeTable_zf
        d3.tsv("NodeTable_zf.tsv", function(error, NodeData) {
            
            NodeArray = [];
            NodeData.forEach(function(d, i){// update the NodeTable_zf
                NodeArray.push([d.key, d[node_id]]);
            });
            // update the title of NodePage as well
            d3.select("#NodeTitle_zf")
                .text(NodeArray[0][1].replace(':', ' : '));

            //Add a new (updated) NodeTable_zf
            d3.select("#NodeTable_zf")
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
    }

    //Init EdgeTable_zf
    d3.select("#EdgeTable_zf")
        .append("table")
    // done

    // To click a edge
    function clickLink(d) {

        var source_node_id = d.source.node_id;
        var target_node_id = d.target.node_id;
        var edge_id = source_node_id + '_' + target_node_id;

        // remove the original table/plots
        d3.select("#EdgeTable_zf")
            .select("table")
            .remove();
        // done

        //Load in contents of CSV file, and do things to the data.
        d3.tsv("EdgeTable_zf.tsv", function(error, EdgeDataOrg) {

            var EdgeArray = [];
            EdgeDataOrg.forEach(function(d, i){
                EdgeArray.push([d.key, d[edge_id]]);
            });

            d3.select("#EdgeTitle_zf")
                .text('Edge: ' + source_node_id + ' to ' + target_node_id);

            //Add a new (updated) EdgeTable_zf
            d3.select("#EdgeTable_zf")
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
              .attr("data-target", "#NodeModal_zf").style("cursor", "pointer") // display the bootstrap dialog
              .on("click", function(){
                  var touch_id = d3.select(this).attr('id');
                  clickNode(touch_id);
                  $("#EdgeModal_zf").modal('toggle');
              });
        });
    }

}
});



