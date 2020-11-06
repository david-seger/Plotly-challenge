
console.log("Init")


let bellyButtonNames = [];
let bellyButtonMetadata = [];
let bellyButtonSamples = [];
let filteredBellyButtonSamples = [];
let filteredBellyButtonData = [];
let filteredBellyButtonMetadata = [];
let demoText = [];

// Read the Belly Button Sample JSON data

d3.json('./data/samples.json').then(bellyButtonData => {
  
  // Load the metadata array
  bellyButtonMetadata = bellyButtonData.metadata;
  console.log(bellyButtonMetadata);

  // Load the names array
  bellyButtonNames = bellyButtonData.names;
  console.log(bellyButtonNames);

  // Load the samples array
  bellyButtonSamples = bellyButtonData.samples;
  console.log(bellyButtonSamples);
    
}).then (a=>{
  
console.log("DefineDropDown")
// Drop down first selector will be message to "Select Subject"
let initialDropDownSelection = "Select Subject";

// Load the drop down dataset options with the belly button names
d3.select("#selDataset").append("option")
  .attr("value", initialDropDownSelection).html(initialDropDownSelection);
  console.log("bbNames")
  console.log(bellyButtonNames);
// Rest of drop down values come from the id of the subject
let dropdown = d3.select("#selDataset");
bellyButtonNames.forEach((item) => {
  let row = dropdown.append("option")
  .attr("value", item);
  row.text(item);
  console.log(item);
});

});

// This is executed when the a different belly button is selected from the drop down list
const optionChanged = () => {
  console.log("Drop Down");

  // Find the sample metadata (Demogrphics Info) and set the html to blanks so it won't repeat prior one
  let demographicsTable = d3.select("#sample-metadata");
  demographicsTable.html("");
  let inputElement = d3.select("#selDataset");
  let tableBody = demographicsTable.append("tbody");
  let selectedSubject = inputElement.property("value");
  console.log(selectedSubject);

  // Filter data based on the subject selected
  filteredBellyButtonData = bellyButtonMetadata.filter(item => item.id == selectedSubject);
  filteredBellyButtonSamples = bellyButtonSamples.filter(item => item.id == selectedSubject);
  console.log(filteredBellyButtonData)

  // Go through the belly button data and load the demogrphics table with proper values
  filteredBellyButtonData.forEach((item) => {
    let row = tableBody.append("tr");
    Object.entries(item).forEach(value => {
      let row = tableBody.append("tr");
      let cell = row.append("td");
      cell.text("");
      cell.text(`${value[0]}: ${value[1]}`);
    });
  });
  console.log(tableBody);

  // Get the top ten samples for the subject
  let slicedBellyButtonSampleValues = filteredBellyButtonSamples[0].sample_values.slice(0, 10).reverse();
  let slicedBellyButtonOTUs = filteredBellyButtonSamples[0].otu_ids.slice(0, 10).reverse().map(data => `OTU ` + data);
  let slicedBellyButtonLabels = filteredBellyButtonSamples[0].otu_labels.slice(0, 10).reverse();

  // Build the horizontal bar chart showing the sample data for the subject and use Plotly to draw the graph.
  let trace1 = {
    x: slicedBellyButtonSampleValues,
    y: slicedBellyButtonOTUs,
    text: slicedBellyButtonLabels,
    type: "bar",
    orientation: "h"
  };

  let bellyButtonBarData = [trace1];
  let bellyButtonBarLayout = {
    title: "Top 10 OTUs in Sample",
    xaxis: { title: "Prevalence in Sample" },
    yaxis: { title: "OTU ID Number" }
  };

  Plotly.newPlot("bar", bellyButtonBarData, bellyButtonBarLayout);

  // Using the samples draw a bubble chart in Plotly

  let size = filteredBellyButtonSamples[0].sample_values;

  let trace2 = {
    x: filteredBellyButtonSamples[0].otu_ids,
    y: filteredBellyButtonSamples[0].sample_values,
    text: filteredBellyButtonSamples[0].otu_labels,
    mode: 'markers',
    marker: {
      size: size,
      sizeref: .1,
      sizemode: 'area',
      color: filteredBellyButtonSamples[0].otu_ids,
    }
  };

  let bubbledata = [trace2];
  let bubblelayout = {
    title: "OTU Prevalence in Sample",
    xaxis: { title: 'OTU ID Number' },
    yaxis: { title: 'Prevalence in Sample' },
  };

  Plotly.newPlot("bubble", bubbledata, bubblelayout);

};