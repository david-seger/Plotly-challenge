
console.log("Init")

// Read the Sample JSON data

let bellyButtonNames = [];
let bellyButtonMetadata = [];
let bellyButtonSamples = [];
let filteredBellyButtonSamples = [];
let filteredBellyButtonData = [];
let filteredBellyButtonMetadata = [];
let demoText = [];

d3.json('samples.json').then(bellyButtonData => {
    
  bellyButtonMetadata = bellyButtonData.metadata;
  console.log(bellyButtonMetadata);

  bellyButtonNames = bellyButtonData.names;
  console.log(bellyButtonNames);

  bellyButtonSamples = bellyButtonData.samples;
  console.log(bellyButtonSamples);
    
}).then (a=>{
  // Drop down first selector will be message to "Select Subject"
console.log("DefineDropDown")

let initialDropDownSelection = "Select Subject";

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

const optionChanged = () => {
  console.log("Drop Down");
  let demographicsTable = d3.select("#sample-metadata");

  demographicsTable.html("");
  let inputElement = d3.select("#selDataset");
  let tableBody = demographicsTable.append("tbody");
  let selectedSubject = inputElement.property("value");

  console.log(selectedSubject);
  filteredBellyButtonData = bellyButtonMetadata.filter(item => item.id == selectedSubject);
  filteredBellyButtonSamples = bellyButtonSamples.filter(item => item.id == selectedSubject);

  console.log(filteredBellyButtonData)
  
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

  let slicedBellyButtonSampleValues = filteredBellyButtonSamples[0].sample_values.slice(0, 10).reverse();
  let slicedBellyButtonOTUs = filteredBellyButtonSamples[0].otu_ids.slice(0, 10).reverse().map(data => `OTU ` + data);
  let slicedBellyButtonLabels = filteredBellyButtonSamples[0].otu_labels.slice(0, 10).reverse();

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
