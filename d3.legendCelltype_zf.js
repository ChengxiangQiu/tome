
(function() {
d3.legendCelltype_zf = function(g) {
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
        myMap_3.set("1","xanthoblast")
        myMap_3.set("2","melanoblast")
        myMap_3.set("3","neural crest")
        myMap_3.set("4","roofplate")
        myMap_3.set("5","midbrain ventral")
        myMap_3.set("6","midbrain")
        myMap_3.set("7","diencephalon")
        myMap_3.set("8","neural plate anterior")
        myMap_3.set("9","telencephalon")
        myMap_3.set("10","neural anterior")
        myMap_3.set("11","optic primordium")
        myMap_3.set("12","optic cup")
        myMap_3.set("13","retina pigmented epithelium")
        myMap_3.set("14","epiblast")
        myMap_3.set("15","differentiating neurons")
        myMap_3.set("16","differentiating neurons (rohon beard)")
        myMap_3.set("17","differentiating neurons (dlx1a+)")
        myMap_3.set("18","differentiating neurons (eomesa+)")
        myMap_3.set("19","diencephalon (aplnr2+)")
        myMap_3.set("20","floorplate")
        myMap_3.set("21","hindbrain dorsal")
        myMap_3.set("22","hindbrain ventral")
        myMap_3.set("23","hindbrain")
        myMap_3.set("24","neural plate posterior")
        myMap_3.set("25","anterior neural ridge")
        myMap_3.set("26","lateral line primordium")
        myMap_3.set("27","lens placode")
        myMap_3.set("28","olfactory placode")
        myMap_3.set("29","otic placode")
        myMap_3.set("30","epidermal (gbx2+)")
        myMap_3.set("31","epidermal")
        myMap_3.set("32","epidermal (foxi3a+)")
        myMap_3.set("33","ionocyte")
        myMap_3.set("34","apoptotic like")
        myMap_3.set("35","germline")
        myMap_3.set("36","DEL")
        myMap_3.set("37","prechordal plate")
        myMap_3.set("38","hatching gland")
        myMap_3.set("39","dorsal margin involuted")
        myMap_3.set("40","notochord")
        myMap_3.set("41","margin")
        myMap_3.set("42","tailbud spinal cord")
        myMap_3.set("43","endoderm")
        myMap_3.set("44","gut")
        myMap_3.set("45","mesoderm adaxial cells")
        myMap_3.set("46","non dorsal margin involuted")
        myMap_3.set("47","tailbud mesoderm")
        myMap_3.set("48","myotome")
        myMap_3.set("49","pharyngeal arch")
        myMap_3.set("50","mesoderm lateral plate (tbx1+)")
        myMap_3.set("51","mesoderm lateral plate")
        myMap_3.set("52","heart")
        myMap_3.set("53","pectoral fin field")
        myMap_3.set("54","macrophage")
        myMap_3.set("55","endothelial")
        myMap_3.set("56","pronephric duct")
        myMap_3.set("57","mesoderm lateral plate (fli1a+)")
        myMap_3.set("58","blood island")
        myMap_3.set("59","erythroid")
        myMap_3.set("60","blastomere")
        myMap_3.set("61","forerunner cells")
        myMap_3.set("62","EVL")
        myMap_3.set("63","periderm")

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