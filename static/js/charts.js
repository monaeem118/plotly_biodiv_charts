function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Initialize the dashboard 
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;


    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filt_sample = samples_array.filter(f => f.id == sample)

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = filt_sample[0].sample_values[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filt_sample[0].otu_ids;
    var otu_labels = filt_sample[0].otu_labels;
    var sample_values = filt_sample[0].sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top_ten_otu_ids = otu_ids.slice(0,10);
    var top_ten_sample_values = sample_values.slice(0,10);
    var sorted_values = top_ten_sample_values.sort((a,b) => b-a);

    var yticks = top_ten_otu_ids.map(d => `otu${d}`);
    var hover_text = otu_labels.slice(0,10);
   

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sorted_values.reverse(),
      y: yticks.reverse(),
      type: "bar",
      orientation: "h",
      text: hover_text.reverse(),
    }]; 


    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      orientation: "h",
    };


    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    //Deliverable 2 - Bubble Chart
    colors = [
      '#1f77b4',  //muted blue
      '#ff7f0e',  //safety orange
      '#2ca02c',  //cooked asparagus green
      '#d62728',  //brick red
      '#9467bd',  //muted purple
      '#8c564b',  //chestnut brown
      '#e377c2',  //raspberry yogurt pink
      '#7f7f7f',  //middle gray
      '#bcbd22',  //curry yellow-green
      '#17becf'   //blue-teal
  ]

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: colors,
        // opacity: [1, 0.8, 0.6, 0.4],
        size: sample_values
      },
      text: otu_labels
    }]; 

    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Deliverable 3 - Guage Chart
    var washing_freq = data.metadata.filter(w => w.id == sample);
    console.log(parseFloat(washing_freq[0].wfreq));

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(washing_freq[0].wfreq),
        title: { text: "Scrubs per Week" },
        type: "indicator",
        ticker: { showticker: true },
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "Lightgreen" },
            { range: [8, 10], color: "Darkgreen" }
          ],
     
          
        },
        
      }
    ];
    
    var layout = { width: 481, height: 300, margin: { t: 30, b: 50}, showlegend: true };
    Plotly.newPlot('gauge', gaugeData, layout);

    
  });
}

