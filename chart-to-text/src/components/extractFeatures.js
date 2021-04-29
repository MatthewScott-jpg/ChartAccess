import {parse} from 'vega-parser';
import { View } from "vega-view";
import React, {useEffect, useState} from "react";

export function Extract(props){
    //const [legend, setLegend] = useState([]);
    const [text, setText] = useState("");
    const liteSpec = props.liteSpec;
    const vegaSpec = props.vegaSpec;

    useEffect(() => {
        var legend = []

        //Getter function for obtaining aspects of the final Vega spec
        async function getInfo(){
            console.log(liteSpec)
            console.log(vegaSpec)

            //extract from grouped bar: vegaSpec.marks[4].marks[0].style[0]
            //const mark = vegaSpec.marks[0].style[0]; 
            const mark = liteSpec.mark
            var xTitle = "";
            var yTitle = "";
            var style = "";

            //get view extracts information from legends
            //liteSpec.encoding.color.field === vegaSpec.legends[0].title
            if ("legends" in vegaSpec){
                await getView();
            }

            if ("title" in liteSpec.encoding.x){
                xTitle = liteSpec.encoding.x.title;
            }
            if ("title" in liteSpec.encoding.y){
                yTitle = liteSpec.encoding.y.title;
            }
            if ("column" in liteSpec.encoding && "field" in liteSpec.encoding.column){
                xTitle = liteSpec.encoding.column.field;
            }
            
            if ("title" in liteSpec.encoding.x){
                xTitle = liteSpec.encoding.x.title;
            }
            if ("title" in liteSpec.encoding.y){
                yTitle = liteSpec.encoding.y.title;
            }
            if ("column" in liteSpec.encoding && "field" in liteSpec.encoding.column){
                xTitle = liteSpec.encoding.column.field;
            }
            if (xTitle === ""){
                vegaSpec.axes.map(axe=>{
                    if (axe.scale === 'x' && 'title' in axe){
                        xTitle=axe.title;
                    }
                    return "";
                })
            }
            if (yTitle === ""){
                vegaSpec.axes.map(axe=>{
                    if (axe.scale === 'y' && 'title' in axe){
                        yTitle=axe.title;
                    }
                    return "";
                })
            }
            xTitle = xTitle.replace(/_/g, ' ');
            yTitle = yTitle.replace(/_/g, ' ');

            if (mark === "bar") style = getBarType();
            else if (mark === "point" | mark === "circle") style = getScatterType();
            else if (mark === "line") style = getLineType();

            //Builds text
            const sent1 = "This is a ".concat(style, ". ");
            const sent2 = "Its x axis is ".concat(xTitle, ". ");
            const sent3 = "Its y axis is ".concat(yTitle, ". ");
            var sent4 = "";
            
            if (style.includes("bar chart")){
                //note the use of quantites, could look into using x, y type here
                sent4 = "Its purpose is to compare different quantities of ".concat(yTitle, " for each type of ", xTitle, ". ");
            }
                else if (style.includes("histogram")){
                sent4 = "Its purpose is to compare ".concat(yTitle, " for intervals of ", xTitle, ". ");
            }
            if (legend.length > 0){
                sent4 += "It also contains a legend, whose values are ";
                var i;
                for (i = 0; i < legend.length-1; i++) {
                    sent4 += legend[i] + ", "
                }
                sent4 += legend[legend.length-1];
            }

            setText(sent1.concat(sent2,sent3, sent4));
        }
        async function getView(){
            const runtime = parse(vegaSpec);
            const view = await new View(runtime).runAsync();
            const intdata = view.data('data_0');
            const dist = liteSpec.encoding.color.field;
            var subvals = []
            for (var row of intdata){
                if (!subvals.includes(row[dist]) && row[dist] !== undefined){
                    subvals.push(row[dist]);
                }
            }
            legend = subvals;
        }
        
        //Differentiates bar chart and histogram
        function getBarType(){
            if (liteSpec.encoding.x.hasOwnProperty("bin")){
                if (liteSpec.encoding.x.bin === true){
                    return "histogram";
                }
            }
            else{
                //bar chart logic
                if ("aggregate" in liteSpec.encoding.y){
                    if (liteSpec.encoding.y.aggregate === "count"){
                    return "stacked bar chart"
                    }
                    else if (liteSpec.encoding.y.aggregate === "sum"){
                        //the grouped bar chart uses gender, not age as its x field
                        if (liteSpec.encoding.x.field === vegaSpec.legends[0].title){
                            return "grouped bar chart";
                        }
                        else{
                            return "layered bar chart";
                        }
                    }
                }
                return "bar chart";
            }
        }
            
        function getScatterType(){
            return "scatter plot";
        }
            
        function getLineType(){
            return "line chart";
        }
        getInfo();
    }, [liteSpec, vegaSpec])

    return(
        <div>{text}</div>
    );
}

export const MemoizedExtract = React.memo(Extract);