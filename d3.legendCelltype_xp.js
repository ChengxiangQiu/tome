
(function() {
d3.legendCelltype_xp = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        //lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    //lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legendCelltype]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legendCelltype")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    let myMap_3 = new Map()
        myMap_3.set("1", "chordal neural crest")
        myMap_3.set("2", "cranial neural crest")
        myMap_3.set("3", "neural crest")
        myMap_3.set("4", "neural plate anterior (fezf1+)")
        myMap_3.set("5", "neural plate anterior")
        myMap_3.set("6", "eye primordium")
        myMap_3.set("7", "optic neuron")
        myMap_3.set("8", "optic vesicle")
        myMap_3.set("9", "neuroectoderm")
        myMap_3.set("10", "early neuron")
        myMap_3.set("11", "neuron - ina")
        myMap_3.set("12", "Rohon-beard neuron")
        myMap_3.set("13", "placodal neuron")
        myMap_3.set("14", "neuroendocrine cell")
        myMap_3.set("15", "neural plate posterior (nkx2-1+)")
        myMap_3.set("16", "neural plate posterior")
        myMap_3.set("17", "notoplate")
        myMap_3.set("18", "chordal neural plate border")
        myMap_3.set("19", "hindbrain")
        myMap_3.set("20", "spinal cord")
        myMap_3.set("21", "ectoderm")
        myMap_3.set("22", "ionocyte")
        myMap_3.set("23", "epibranchial and lateral line placode")
        myMap_3.set("24", "alpha ionocyte")
        myMap_3.set("25", "beta ionocyte")
        myMap_3.set("26", "otic placode")
        myMap_3.set("27", "posterior placodal area")
        myMap_3.set("28", "placodal area")
        myMap_3.set("29", "anterior placodal area")
        myMap_3.set("30", "lens placode")
        myMap_3.set("31", "olfactory placode")
        myMap_3.set("32", "adenohypophyseal placode")
        myMap_3.set("33", "surface ectoderm")
        myMap_3.set("34", "epidermal")
        myMap_3.set("35", "small secretory cells")
        myMap_3.set("36", "goblet cell")
        myMap_3.set("37", "cement gland primordium")
        myMap_3.set("38", "hatching gland")
        myMap_3.set("39", "ciliated epidermal progenitor")
        myMap_3.set("40", "blastula")
        myMap_3.set("41", "germ cell")
        myMap_3.set("42", "tail bud")
        myMap_3.set("43", "notochord")
        myMap_3.set("44", "gut")
        myMap_3.set("45", "endoderm")
        myMap_3.set("46", "marginal zone")
        myMap_3.set("47", "presomitic mesoderm")
        myMap_3.set("48", "somite")
        myMap_3.set("49", "dorsal marginal zone")
        myMap_3.set("50", "pronephric mesenchyme")
        myMap_3.set("51", "intermediate mesoderm (ssg1+)")
        myMap_3.set("52", "intermediate mesoderm")
        myMap_3.set("53", "dorsal lateral plate region")
        myMap_3.set("54", "endothelial hemangioblast progenitor")
        myMap_3.set("55", "migrating myeloid progenitor")
        myMap_3.set("56", "involuted ventral mesoderm")
        myMap_3.set("57", "cardiac mesoderm")
        myMap_3.set("58", "lateral plate mesoderm")
        myMap_3.set("59", "ventral blood island")
        myMap_3.set("60", "blood")

    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i*1.501+"em"})
        .attr("x","1em")
        //.text(function(d) { return d.key})
        .text(function(d) { return myMap_3.get(d.key)})
    
  
    
    // Reposition and resize the box
   // var lbbox = li[0][0].getBBox()  
    //lb.attr("x",(lbbox.x-legendPadding))
    //    .attr("y",(lbbox.y-legendPadding))
    //    .attr("height",(lbbox.height+2*legendPadding))
     //   .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()