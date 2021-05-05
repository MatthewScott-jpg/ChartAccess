# Chart to Text by Matthew Scott

This project takes vega-lite json files as inputs and generates\
both a visualization and an explaination of key elements.

To use, simply drag and drop a vega-lite file and the classifier\
will create an output that contains relevant information of the chart

The examples folder contains sample vega-lite files whose differences\
formed the base of the logic in the classifier.

The extractFeatures component has logic for extracting information\
and classifying a number of different chart types.

Currently, it will extract and present x and y axis labels, the type\
of chart, and, if a legend is present, the values it contains.

The chart types that can be classified so far are as follows:

*Bar Chart
*Stacked Bar Chart
*Layered Bar Chart
*Grouped Bar Chart
*Histogram
*Scatterplot
*Multi-Category Scatterplot
*Line Chart
*Multi-Series Line Chart
*Area Chart
*Stacked Area Chart
*Density Plot