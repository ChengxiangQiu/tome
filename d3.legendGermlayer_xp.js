// d3.legend.js 
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
d3.legendGermlayer_xp = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legendGermlayer]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legendGermlayer")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    let myMap_1 = new Map()
      myMap_1.set("neuroectoderm", "Frog: Neuroectoderm")
      myMap_1.set("surface_ectoderm", "Frog: Other")
      myMap_1.set("endoderm", "Frog: Endoderm")
      myMap_1.set("mesoderm", "Frog: Mesoderm")
//      myMap_1.set("exe_germ", "Frog: Neuroectoderm")
      myMap_1.set("other", "Frog: Surface ectoderm")

    let myMap_2 = new Map()
      myMap_2.set("neuroectoderm", "#145A32")
      myMap_2.set("surface_ectoderm", "#000000")
      myMap_2.set("endoderm", "#9A7D0A")
      myMap_2.set("mesoderm", "#2471A3")
//      myMap_2.set("exe_germ", "#E67E22")
      myMap_2.set("other", "#78281F")
    
    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i*1.5+"em"})
        .attr("x","1em")
        .text(function(d) { return myMap_1.get(d.key)})
    
    li.selectAll("circle")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return (i-0.25)*1.5+"em"})
        .attr("cx",0)
        .attr("r","0.3em")
        .style("fill",function(d) { return myMap_2.get(d.key)})  
    
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()  
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()


