var DataContextContainer, GraphContainer, activeView, arc, bln, blnChange, changeChronologicalData, changeData, changePackData, checkedList, circlePack, color, convertToNumber, data, dataAt, firstGraphTitle, flow, focus, format, generateDataId, getCheckedInput, getCheckedList, getLabel, height, labelArc, labelAt, marginRight3rd, marginTop3rd, nodePack, pack, packData, pakData, pie, ptChange, ptContext, ptIndex, radius, removePrevGraph, render, secondGraphBackgroundElement, secondGraphDiameter, secondGraphDisplayedText, secondGraphMargin, setFirstTitle, svg, thirdColor, thn, thn2, thn2Change, thnChange, tooltip, view, viewContext, width, width3rd, zoom, zoomTo, zoomin;

flow = Q.defer();

data = null;

pakData = null;

packData = null;

arc = d3.arc();

format = d3.format(",d");

width = height = 800;

width3rd = 1000;

marginTop3rd = 50;

marginRight3rd = 75;

radius = 350;

secondGraphMargin = 20;

secondGraphDiameter = 800;

secondGraphBackgroundElement = null;

secondGraphDisplayedText = null;

firstGraphTitle = null;

labelArc = null;

pie = null;

pack = null;

view = null;

focus = null;

GraphContainer = [];

DataContextContainer = [];

svg = [];

nodePack = null;

circlePack = null;

tooltip = null;

viewContext = null;


/*
  depend on changeData call
  Array of string, contain coor on csv row, col
 */

activeView = [];

ptIndex = null;

bln = null;

thn = null;

thn2 = null;

checkedList = null;

ptContext = ["Tidak/ belum pernah sekolah", "Tidak/ belum tamat SD", "SD", "SLTP", "SMU", "SMK", "Akademi/ Diploma", "Universitas"];

color = d3.scaleOrdinal(d3.schemeCategory20);

thirdColor = d3.scaleOrdinal(d3.schemeCategory10);

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    // firstGraphTitle = document.querySelector('figure.fig1>figcaption');
    console.log('readyState now complete');
    // return setFirstTitle();
  }
};

convertToNumber = function(input) {
  input = input.trim();
  while (input.indexOf(',') > -1) {
    input = input.replace(',', '');
  }
  if (input === '-') {
    input = 0;
  }
  return +input;
};

setFirstTitle = function() {
  // console.log('bug textContent', firstGraphTitle);
  return firstGraphTitle.textContent = "Perbandingan " + viewContext + " dengan pendidikan terakhir " + ptContext[ptIndex] + " " + bln + " " + thn;
};

d3.csv('/static/data/bps.csv').row(function(r) {
  return r;
}).get(function(err, csvData) {
  console.log('callback on cvs', err);
  if (err) {
    flow.reject(err);
  }
  return flow.resolve(csvData);
});
// console.log('request cvs have been made');
flow.promise.then(function(d) {
  console.log('data cvs resolved');
  ptIndex = '0';
  bln = 'February';
  thn = '2008';
  thn2 = '2008';
  viewContext = "AK dan BAK";
  firstGraphTitle = document.querySelector('figure.fig1>figcaption');
  // console.log('now firstGraphTitle: ', firstGraphTitle);
  data = d;
  render();
  // console.log('about rendering the first');
  render(0);
  render(1);
  return render(2);
}, function err(error) {
  console.log('error');
});
flow.promise.catch(function (r) {
  console.log('error promise rejected :', r);
});

/*
  only for first graph
 */

zoomin = function(dat) {
  var baseData, changer, countBack, definedData, i, isAK, join, l, len, newGraphs, newGraphsContext;
  isAK = false;
  changer;
  if (dat.data.label === data[2][1]) {
    changer = activeView[0];
    definedData = [
      {
        label: data[3][1],
        value: data[4][1]
      }, {
        label: data[3][2],
        value: data[4][2]
      }
    ];
  } else if (dat.data.label === data[2][5]) {
    changer = activeView[1];
    definedData = [
      {
        label: data[3][5],
        value: data[4][5]
      }, {
        label: data[3][6],
        value: data[4][6]
      }, {
        label: data[3][7],
        value: data[4][7]
      }
    ];
  }
  for (i = l = 0, len = definedData.length; l < len; i = ++l) {
    baseData = definedData[i];
    countBack = Number(changer.split(',')[1]) - i - 1;
    definedData[i].value = data[+changer.split(',')[0]][countBack];
    definedData[i].label = data[3][countBack];
  }
  removePrevGraph(0);
  join = GraphContainer[0].selectAll('.arc').data(pie(definedData));
  newGraphsContext = DataContextContainer[0].selectAll('text.data-context').data(pie(definedData)).enter().append('text').attr('transform', function(d) {
    return "translate(" + (labelArc.centroid(d)) + ")";
  }).attr('dy', '.35em').attr('class', 'view-context').text(getLabel);
  newGraphs = join.enter().append('g').attr('class', 'zoom1 arc');
  newGraphs.append('path').attr('d', arc).style('fill', function(d) {
    // console.log("order d.value", d.value);
    return color(d.index);
  });
  newGraphs.on('click', function(d) {
    return render(0);
  });
  newGraphs.on('mouseover', function(d) {
    return tooltip.style('display', null).text("data: " + d.data.value + " orang");
  });
  return newGraphs.on('mouseout', function() {
    return tooltip.style('display', 'none');
  });
};


/*
  zoom for second graph
 */

zoom = function(d) {
  var focus0, secondPackQuery, transition;
  // console.log('zoom called with ', d);
  focus0 = focus;
  focus = d;
  transition = d3.transition().duration(function() {
    if (d3.event.altKey) {
      return 7500;
    } else {
      return 750;
    }
  }).tween('zoom', function(d) {
    var i;
    i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + secondGraphMargin]);
    return function(t) {
      return zoomTo(i(t));
    };
  });
  secondPackQuery = 'figure.fig2>svg>g.pack-container-2';
  secondGraphDisplayedText = transition.selectAll(secondPackQuery + ">g").filter(function(d) {
    if (d == null) {
      return false;
    }
    return focus === d.parent;
  });
  // console.log("zoom secondGraphDisplayedText.size()", secondGraphDisplayedText.size());
  // console.log('current focus is ', focus.data.name);
  secondGraphDisplayedText.each(function(d, i) {
    // return console.log("should displayed " + i + ": ", d.data.name);
  });
  secondGraphDisplayedText.each(function(d, i) {
    if (!this.childNodes[2]) {
      // return console.log('childNodes[2] not exist: ', this.childNodes);
    } else {
      return GraphContainer[1].node().appendChild(this.childNodes[2]);
    }
  });
  d3.selectAll(secondPackQuery + ">text").each(function(d, i) {
    return d3.select(this).style('display', function(d) {
      if (focus === d.parent) {
        return 'inline';
      } else {
        return 'none';
      }
    });
  });
  return true;
};


/*
 will be called multyple times,
 possibly each data or element
 */

zoomTo = function(v) {
  var k;
  k = secondGraphDiameter / v[2];
  view = v;
  nodePack = svg[1].selectAll('circle,text');
  nodePack.attr('transform', function(d) {
    return "translate(" + ((d.x - v[0]) * k) + ", " + ((d.y - v[1]) * k) + ")";
  });
  return circlePack.attr('r', function(d) {
    return d.r * k;
  });
};

ptChange = function() {
  var l, len, rb, ref;
  ref = document.getElementsByName('pt');
  for (l = 0, len = ref.length; l < len; l++) {
    rb = ref[l];
    if (rb.checked) {
      ptIndex = rb.value;
      render(0);
      return;
    }
  }
};

blnChange = function() {
  var inputBln, l, len, ref;
  ref = document.getElementsByName('bulan');
  for (l = 0, len = ref.length; l < len; l++) {
    inputBln = ref[l];
    if (inputBln.checked) {
      bln = inputBln.value;
      render(0);
      return;
    }
  }
};

thnChange = function() {
  var l, len, ref;
  ref = document.getElementsByName('tahun');
  for (l = 0, len = ref.length; l < len; l++) {
    thn = ref[l];
    if (thn.checked) {
      thn = thn.value;
      render(0);
      return;
    }
  }
};

thn2Change = function() {
  var l, len, ref;
  ref = document.getElementsByName('tahun2');
  for (l = 0, len = ref.length; l < len; l++) {
    thn2 = ref[l];
    if (thn2.checked) {
      thn2 = thn2.value;
      render(1);
      return;
    }
  }
};


/*
Query the DOM only
 */

getCheckedInput = function() {
  var groupData, i, inputLeafData, inputNode, inputTopData, l, leafData, len, len1, len2, m, n, topData;
  inputTopData = document.querySelectorAll('fieldset.thirdForm input[name=top]:checked');
  inputLeafData = [];
  inputLeafData[0] = document.querySelectorAll("fieldset.ak"+
  " fieldset.bekerja input:checked");
  inputLeafData[1] = document.querySelectorAll("fieldset.ak"+
  " fieldset.pengangguran input:checked");
  inputLeafData[2] = document.querySelectorAll("fieldset.bak"+
  " fieldset.sekolah input:checked");
  inputLeafData[3] = document.querySelectorAll("fieldset.bak"+
  " fieldset.mengurus input:checked");
  inputLeafData[4] = document.querySelectorAll("fieldset.bak"+
  " fieldset.lainnya input:checked");
  // console.log('debug inputLeafData: ', inputLeafData);
  leafData = [];
  topData = [];
  for (i = l = 0, len = inputLeafData.length; l < len; i = ++l) {
    groupData = inputLeafData[i];
    leafData[i] = [];
    for (m = 0, len1 = groupData.length; m < len1; m++) {
      inputNode = groupData[m];
      leafData[i].push(inputNode.value);
    }
  }
  for (n = 0, len2 = inputTopData.length; n < len2; n++) {
    groupData = inputTopData[n];
    topData.push(groupData.value);
  }
  return checkedList = {
    top: topData,
    leaf: leafData
  };
};


/*
  listener for input chart number 3
 */

getCheckedList = function() {
  // console.log('debug : checked input-> ', );
  getCheckedInput()
  changeChronologicalData();
  return render(2);
};


/*
  render veiw based on interaction
  handle 3 graphs
 */

render = function(graphToRender) {
  // console.log('render called', graphToRender== null);
  var dataContainer, dataLabel, dataLegend, dataSerie, dataToRender, endDate, graphText, graphs, highestY, j, labelPadding, legendCounter, line, secondGraphData, startDate, thirdGraph, x, xAxis, y, yAxis;
  if (graphToRender == null) {
    graphToRender = null;
    // console.log('graphToRender', graphToRender);
  }
  setFirstTitle();
  // console.log('after calling setFirstTitle');
  dataToRender = changeData();
  // console.log('dataToRender', dataToRender);
  if (graphToRender === null) {
    svg[0] = d3.select('figure.fig1').append('svg').attr('width', width).attr('height', height);
    GraphContainer[0] = svg[0].append('g').attr('transform', "translate(" + (width / 2) + ", " + (height / 2) + ")").attr('class', 'arc-container-1');
    DataContextContainer[0] = svg[0].append('g').attr('transform', "translate(" + (width / 2) + ", " + (height / 2) + ")").attr('class', 'data-context');
    svg[1] = d3.select('figure.fig2').append('svg').attr('width', secondGraphDiameter).attr('height', secondGraphDiameter);
    secondGraphBackgroundElement = svg[1].append('rect').attr('width', secondGraphDiameter).attr('height', secondGraphDiameter);
    DataContextContainer[1] = svg[1].append('g').attr('transform', "translate(" + (secondGraphDiameter / 2) + ", " + (secondGraphDiameter / 2) + ")").attr('class', 'data-2-context');
    GraphContainer[1] = svg[1].append('g').attr('transform', "translate(" + (secondGraphDiameter / 2) + ", " + (secondGraphDiameter / 2) + ")").attr('class', 'pack-container-2');
    pie = d3.pie().value(function(d) {
      if (typeof d.value !== 'number') {
        d.value = convertToNumber(d.value);
      }
      return d.value;
    }).sort(d3.ascending);
    pack = d3.pack().size([secondGraphDiameter - secondGraphMargin, secondGraphDiameter - secondGraphMargin]).padding(2);
    svg[2] = d3.select('figure.fig3').append('svg').attr('width', width3rd).attr('height', height);
    GraphContainer[2] = svg[2].append('g').attr('transform', "translate(" + marginRight3rd + ", " + marginTop3rd + ")").attr('class', 'container-3-rd');
    DataContextContainer[2] = svg[2].append('g').attr('transform', "translate(" + marginRight3rd + ", " + marginTop3rd + ")").attr('class', 'data-3-context');
    svg[3] = d3.select('figure.fig3-legend').append('svg').attr('width', width3rd).attr('height', height / 4);
    GraphContainer[3] = svg[3].append('g').attr('transform', "translate(" + (marginRight3rd - 50) + ", " + marginTop3rd + ")").attr('class', 'data-3-legends');
    labelPadding = 3;
  } else {
    removePrevGraph(graphToRender);
  }
  if (tooltip == null) {
    tooltip = d3.select('figure.fig1>svg').append('text').attr('transform', "translate(350, 20)").style('color', 'black').attr('font-size', '17px').attr('class', 'title');
  }
  switch (graphToRender) {
    case 0:
      labelArc = d3.arc().outerRadius(radius).innerRadius(0);
      arc.outerRadius(radius - 20).innerRadius(0);
      graphs = GraphContainer[0].selectAll('.arc').data(pie(dataToRender)).enter().append('g').attr('class', 'arc');
      graphs.append('path').attr('d', arc).style('fill', function(d) {
        return color(d.index);
      });
      graphText = DataContextContainer[0].selectAll('.view-context').data(pie(dataToRender)).enter().append('text').attr('class', 'view-context').attr('transform', function(d) {
        return "translate(" + (labelArc.centroid(d)) + ")";
      }).attr('dy', '.35em').text(getLabel);
      arc.outerRadius(radius - 20).innerRadius(0);
      graphs.on('click', function(d) {
        return zoomin(d);
      });
      graphs.on('mouseover', function(d) {
        return tooltip.style('display', null).style('fill', 'black').text("data : " + d.data.value + " orang");
      });
      graphs.on('mouseout', function() {
        return tooltip.style('display', 'none');
      });
      break;
    case 1:
      secondGraphData = changePackData();
      // console.log('secondGraphData', secondGraphData);
      secondGraphData = d3.hierarchy(secondGraphData).sum(function(d) {
        return d.size;
      });
      pack(secondGraphData);
      focus = secondGraphData;
      // console.log('focus', focus);
      // console.log('GraphContainer[1]', GraphContainer[1]);
      secondGraphBackgroundElement.attr('fill', color(-2)).on('click', function() {
        return zoom(secondGraphData);
      });
      dataContainer = GraphContainer[1].selectAll('g').data(secondGraphData.descendants()).enter().append('g').attr('id', function(d) {
        return generateDataId(d);
      });
      // console.log('dataContainer: ', dataContainer);
      circlePack = dataContainer.append('circle').attr('class', function(d) {
        if (d.parent) {
          if (d.children) {
            return 'node';
          } else {
            return 'node node--leaf';
          }
        } else {
          return 'node node--root';
        }
      }).style('fill', function(d) {
        if (d.children) {
          return color(d.depth);
        } else {
          return null;
        }
      }).on('click', function(d) {
        if (focus !== d) {
          zoom(d);
        } else {
          zoom(secondGraphData);
        }
        return d3.event.stopPropagation();
      });
      dataContainer.append('title').text(function(d) {
        var id;
        id = generateDataId(d);
        while (id.indexOf('_') > -1) {
          id = id.replace('_', ' ');
        }
        return id + "\nData : " + (format(d.data.size)) + " orang";
      });
      dataContainer.append('text').attr('class', 'label-2').style('display', function(d) {
        if (focus === d.parent) {
          // console.log("shown data: " + d.data.name + " ", focus === d.parent);
          return 'inline';
        } else {
          return 'none';
        }
      }).text(function(d) {
        return d.data.name;
      });
      secondGraphDisplayedText = dataContainer.filter(function(d) {
        if (focus === d.parent) {
          return true;
        } else {
          return false;
        }
      });
      secondGraphDisplayedText.each(function(d, i) {
        return GraphContainer[1].node().appendChild(this.childNodes[2]);
      });
      zoomTo([focus.x, focus.y, focus.r * 2 + secondGraphMargin]);
      break;
    case 2:
      getCheckedInput();
      thirdGraph = changeChronologicalData();
      // console.log('thirdGraph: ', thirdGraph);
      startDate = thirdGraph[0][0].date;
      endDate = thirdGraph[0][thirdGraph[0].length - 1].date;
      endDate.setMonth(endDate.getMonth() + 1);
      x = d3.scaleTime().domain([startDate, endDate]).range([0, width3rd - marginRight3rd * 2]);
      y = d3.scaleLinear().domain([
        0, d3.max(thirdGraph, function(s) {
          var maxDataKind;
          maxDataKind = d3.max(s, function(d) {
            return d.value;
          });
          return maxDataKind;
        })
      ]).range([height - (marginTop3rd * 2), 0]);
      xAxis = d3.axisBottom(x).ticks(d3.timeMonth.filter(function(xDate) {
        if (xDate.getMonth() === 1 || xDate.getMonth() === 7) {
          return true;
        } else {
          return false;
        }
      })).tickFormat(d3.timeFormat('%b %Y'));
      yAxis = d3.axisLeft(y);
      GraphContainer[2].append('g').attr('class', 'axis axis--x').attr('transform', "translate(0, " + (height - marginTop3rd * 2) + ")").call(xAxis);
      GraphContainer[2].append('g').attr('class', 'axis axis--y').attr('transform', "translate(0, 0)").call(yAxis);
      j = GraphContainer[2].selectAll('.serie').data(thirdGraph);
      j.exit().remove();
      dataSerie = j.enter().append('g').attr('class', 'serie');
      line = d3.line().x(function(d) {
        return x(d.date);
      }).y(function(d) {
        return y(d.value);
      });
      dataSerie.append('path').attr('class', 'line').style('stroke', function(d) {
        return thirdColor(d[0].key);
      }).attr('d', function(d) {
        return line(d);
      });
      dataLabel = dataSerie.selectAll('.label-3').data(function(d) {
        return d;
      }).enter().append('g').attr('class', 'label-3').attr('transform', function(d) {
        return "translate(" + (x(d.date)) + ", " + (y(d.value)) + ")";
      });
      dataLegend = dataLabel.append('text').attr('dy', '.35em').text(function(d) {
        return d.value + " orang";
      }).filter(function(d, i) {
        return i === thirdGraph.length - 1;
      });
      highestY = 0;
      legendCounter = 0;
      dataLegend.each(function(d, i) {
        var legends, xLegend, yLegend;
        xLegend = (legendCounter % 5) * 250;
        yLegend = Math.floor(legendCounter / 5) * 100;
        highestY = yLegend;
        legends = GraphContainer[3].append('g').attr('transform', "translate(" + xLegend + ", " + yLegend + ")").attr('class', 'data-3-legend');
        legends.append('rect').attr('width', 240).attr('height', 12).style('fill', thirdColor(d.key));
        legends.append('text').attr('dy', '.35em').attr('y', 25).text("" + d.key);
        return legendCounter++;
      });
      svg[3].attr('height', 150 + highestY);
      break;
  }
  // return console.log('end?');
};

changeData = function() {
  var agregateYear, baseAK, baseBAK, baseCol, baseData, baseRow, dataVal, debugHelp, flowData, graphData, i, l, labelPos, len, len1, len2, len3, m, n, o, viewData;
  baseData = ['4,3', '4,8'];
  baseAK = ['4,1', '4,2'];
  baseBAK = ['4,5', '4,6', '4,7'];
  flowData = null;
  debugHelp = '';
  labelPos = null;
  switch (viewContext) {
    case "AK dan BAK":
      labelPos = ['2,1', '2,5'];
      flowData = baseData;
      break;
    case data[2][1]:
      labelPos = ['3,1', '3,2'];
      flowData = baseAK;
      break;
    case data[2][5]:
      labelPos = ['3,5', '3,6', '3,7'];
      flowData = baseBAK;
      break;
    default:
      console.log('typo? different data type?', viewContext);
  }
  debugHelp += "viewContext(" + (flowData.toString()) + ")";
  for (i = l = 0, len = flowData.length; l < len; i = ++l) {
    dataVal = flowData[i];
    baseRow = Number(dataVal.split(',')[0]);
    baseRow += +ptIndex;
    flowData[i] = dataVal.replace(dataVal.split(',')[0], baseRow.toString());
  }
  if (bln === 'Agustus') {
    for (i = m = 0, len1 = flowData.length; m < len1; i = ++m) {
      dataVal = flowData[i];
      baseCol = Number(dataVal.split(',')[1]);
      baseCol += 10;
      flowData[i] = dataVal.replace(dataVal.split(',')[1], baseCol.toString());
    }
    debugHelp += "Agustus";
  } else {
    debugHelp += "February";
  }
  if (thn !== '2008') {
    agregateYear = Number(thn) - 2008;
    for (i = n = 0, len2 = flowData.length; n < len2; i = ++n) {
      dataVal = flowData[i];
      baseRow = Number(dataVal.split(',')[0]);
      baseRow += agregateYear * 14;
      flowData[i] = dataVal.replace(dataVal.split(',')[0], baseRow.toString());
    }
    debugHelp += " increment row: (" + (agregateYear * 14) + ")";
  }
  // console.log("input data like so: " + ptIndex + ", " + bln + ", " + thn);
  // console.log('constructed flowData: ', flowData.toString());
  activeView = flowData;
  graphData = [];
  for (i = o = 0, len3 = flowData.length; o < len3; i = ++o) {
    viewData = flowData[i];
    graphData.push({
      label: data[+labelPos[i].split(',')[0]][+labelPos[i].split(',')[1]],
      value: data[+viewData.split(',')[0]][+viewData.split(',')[1]]
    });
  }
  // console.log('graphData', graphData);
  return graphData;
};


/*
  change pack data
 */

changePackData = function() {
  var basePackData, basePtLabel, i, incrementCol, incrementRow, indexAk, l, len, len1, len2, len3, len4, len5, m, n, o, p, q, ref, ref1, ref2, semesterView, z2, z3, z4, z4AggregateCol, zoom1, zoom2, zoom3;
  basePtLabel = ['4,0', '5,0', '6,0', '7,0', '8,0', '9,0', '10,0', '11,0'];
  basePackData = [
    {
      'AK': {
        name: '2,1',
        size: '13,3',
        children: [
          {
            name: '3,1',
            size: '13,1'
          }, {
            name: '3,2',
            size: '13,2'
          }
        ]
      }
    }, {
      'BAK': {
        name: '2,5',
        size: '13,8',
        children: [
          {
            name: '3,5',
            size: '13,5'
          }, {
            name: '3,6',
            size: '13,6'
          }, {
            name: '3,7',
            size: '13,7'
          }
        ]
      }
    }
  ];
  packData = {};
  packData.name = 'rebornKidz';
  packData.children = [];
  incrementRow = 0;
  incrementRow = (Number(thn2) - 2008) * 14;
  ref = ['Februari', 'Agustus'];
  for (l = 0, len = ref.length; l < len; l++) {
    semesterView = ref[l];
    zoom1 = {};
    zoom1.name = semesterView;
    zoom1.size = convertToNumber(data[13 + incrementRow][9]);
    if (semesterView === 'Agustus') {
      zoom1.size = convertToNumber(data[13 + incrementRow][19]);
    }
    zoom1.children = [];
    for (i = m = 0, len1 = basePackData.length; m < len1; i = ++m) {
      z2 = basePackData[i];
      incrementCol = 0;
      if (semesterView === 'Agustus') {
        incrementCol += 10;
      }
      zoom2 = {};
      if (i === 0) {
        zoom2.name = labelAt(z2.AK.name);
        zoom2.size = dataAt(z2.AK.size, incrementRow, incrementCol);
        zoom2.children = [];
        zoom3 = {};
        ref1 = z2.AK.children;
        for (indexAk = n = 0, len2 = ref1.length; n < len2; indexAk = ++n) {
          z3 = ref1[indexAk];
          z4AggregateCol = indexAk + 1;
          zoom3 = {
            name: labelAt(z3.name),
            size: dataAt(z3.size, incrementRow, incrementCol),
            children: []
          };
          for (o = 0, len3 = basePtLabel.length; o < len3; o++) {
            z4 = basePtLabel[o];
            zoom3.children.push({
              name: labelAt(z4),
              size: dataAt(z4, incrementRow, incrementCol + z4AggregateCol)
            });
          }
          zoom2.children.push(zoom3);
        }
      } else {
        zoom2.name = labelAt(z2.BAK.name);
        zoom2.size = dataAt(z2.BAK.size, incrementRow, incrementCol);
        zoom2.children = [];
        ref2 = z2.BAK.children;
        for (indexAk = p = 0, len4 = ref2.length; p < len4; indexAk = ++p) {
          z3 = ref2[indexAk];
          z4AggregateCol = indexAk + 5;
          zoom3 = {
            name: labelAt(z3.name),
            size: dataAt(z3.size, incrementRow, incrementCol),
            children: []
          };
          for (q = 0, len5 = basePtLabel.length; q < len5; q++) {
            z4 = basePtLabel[q];
            zoom3.children.push({
              name: labelAt(z4),
              size: dataAt(z4, incrementRow, incrementCol + z4AggregateCol)
            });
          }
          zoom2.children.push(zoom3);
        }
      }
      zoom1.children.push(zoom2);
    }
    packData.children.push(zoom1);
  }
  return packData;
};


/*
  construct data for line chart(3rd)
 */

changeChronologicalData = function() {
  var baseCol, baseLeafData, baseRow, baseTopData, bulan, checked, col, cronologicalData, fixDate, i, iterator, l, leafData, leafList, len, len1, len2, len3, len4, m, n, num, o, p, parentName, preRenderData, q, readyRenderData, ref, ref1, ref2, row, tahun, timeParse;
  cronologicalData = null;
  baseTopData = [[13, 3], [13, 8], [13, 1], [13, 2], [13, 5], [13, 6], [13, 7]];
  baseLeafData = [[4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1]];
  cronologicalData = [];
  ref = checkedList.top;
  for (l = 0, len = ref.length; l < len; l++) {
    checked = ref[l];
    switch (checked) {
      case 'ak':
        cronologicalData.push({
          id: 'total ak',
          location: baseTopData[0]
        });
        break;
      case 'bak':
        cronologicalData.push({
          id: 'total bak',
          location: baseTopData[1]
        });
        break;
      case 'bekerja':
        cronologicalData.push({
          id: 'total bekerja',
          location: baseTopData[2]
        });
        break;
      case 'pengangguran':
        cronologicalData.push({
          id: 'total pengangguran',
          location: baseTopData[3]
        });
        break;
      case 'sekolah':
        cronologicalData.push({
          id: 'total sekolah',
          location: baseTopData[4]
        });
        break;
      case 'mengurus':
        cronologicalData.push({
          id: 'total mengurus',
          location: baseTopData[5]
        });
        break;
      case 'lainnya':
        cronologicalData.push({
          id: 'total lainnya',
          location: baseTopData[6]
        });
        break;
      default:
        throw new Error('push harder');
    }
  }
  ref1 = checkedList.leaf;
  for (num = m = 0, len1 = ref1.length; m < len1; num = ++m) {
    leafList = ref1[num];
    baseCol = 0;
    parentName = 'unset';
    switch (num) {
      case 0:
      case 1:
        baseCol = num + 1;
        parentName = 'ak.' + labelAt([3, baseCol]);
        break;
      case 2:
      case 3:
      case 4:
        baseCol = num + 3;
        parentName = 'bak.' + labelAt([3, baseCol]);
        break;
      default:
        throw new Error('err');
    }
    for (n = 0, len2 = leafList.length; n < len2; n++) {
      checked = leafList[n];
      leafData = {
        id: parentName
      };
      baseRow = 4;
      switch (checked) {
        case 'tidak pernah sekolah':
          leafData.id += '.tidak pernah sekolah';
          leafData.location = [baseRow, baseCol];
          break;
        case 'tidak tamat sd':
          leafData.id += '.tidak tamat sd';
          leafData.location = [baseRow + 1, baseCol];
          break;
        case 'SD':
          leafData.id += '.SD';
          leafData.location = [baseRow + 2, baseCol];
          break;
        case 'SLTP':
          leafData.id += '.SLTP';
          leafData.location = [baseRow + 3, baseCol];
          break;
        case 'SMU':
          leafData.id += '.SMU';
          leafData.location = [baseRow + 4, baseCol];
          break;
        case 'SMK':
          leafData.id += '.SMK';
          leafData.location = [baseRow + 5, baseCol];
          break;
        case 'Diploma':
          leafData.id += '.Diploma';
          leafData.location = [baseRow + 6, baseCol];
          break;
        case 'Universitas':
          leafData.id += '.Universitas';
          leafData.location = [baseRow + 7, baseCol];
          break;
        default:
          throw new Error('oh dear where are you? who is typing?');
      }
      cronologicalData.push(leafData);
    }
  }
  readyRenderData = [];
  for (i = o = 0, len3 = cronologicalData.length; o < len3; i = ++o) {
    preRenderData = cronologicalData[i];
    readyRenderData[i] = [];
    row = 0;
    for (tahun = p = 2008; p <= 2015; tahun = ++p) {
      iterator = {
        key: preRenderData.id
      };
      ref2 = ['Februari', 'Agustus'];
      for (q = 0, len4 = ref2.length; q < len4; q++) {
        bulan = ref2[q];
        col = null;
        fixDate = '';
        timeParse = d3.timeParse('%m-%Y');
        if (bulan === 'Februari') {
          col = 0;
          fixDate = '02-' + tahun;
          iterator.date = timeParse(fixDate);
        } else if (bulan === 'Agustus') {
          col = 10;
          fixDate = '08-' + tahun;
          iterator.date = timeParse(fixDate);
        }
        iterator.value = dataAt([preRenderData.location[0] + row, preRenderData.location[1] + col]);
        readyRenderData[i].push(iterator);
        iterator = {
          key: preRenderData.id
        };
      }
      row += 14;
    }
  }
  // console.log('returned from changeCronologicalData: ', readyRenderData);
  return readyRenderData;
};


/*
  get data at, all access data should be here, but i am late to
  figure it out
  @param location= row,col
  @type String
  @return data at that row and col
 */

dataAt = function(location, incRow, incCol) {
  var defaultCol, defaultRow, err, errMsg;
  if (incRow == null) {
    incRow = 0;
  }
  if (incCol == null) {
    incCol = 0;
  }
  defaultRow = defaultCol = null;
  if (typeof location === 'string') {
    defaultRow = Number(location.split(',')[0]);
    defaultCol = Number(location.split(',')[1]);
  } else {
    defaultRow = location[0];
    defaultCol = location[1];
  }
  if (incRow === 0 && incCol === 0) {
    if ((data[defaultRow][defaultCol] != null) || (data[defaultRow] != null)) {
      return convertToNumber(data[defaultRow][defaultCol]);
    } else {
      if (data[defaultRow] == null) {
        errMsg = "data at row " + defaultRow + " not exist";
        throw errMsg;
      } else {
        err = "accessing null value on cvs data, col : " + col;
        throw err;
      }
    }
  } else {
    if (incRow > 0) {
      defaultRow += incRow;
    }
    if (incCol > 0) {
      defaultCol += incCol;
    }
    return convertToNumber(data[defaultRow][defaultCol]);
  }
};


/*
  similar to dataAt but no converting to number because it's a label
 */

labelAt = function(location) {
  var defCol, defRow;
  if (typeof location === 'string') {
    defRow = Number(location.split(',')[0]);
    defCol = Number(location.split(',')[1]);
  } else if (typeof location === 'object') {
    defRow = location[0];
    defCol = location[1];
  } else {
    throw new Error("Unsupported type " + (typeof location) + " location");
  }
  return data[defRow][defCol];
};


/*
 clear graphs element except it container
 @param index number of graph to be clear
 @type Number
 */

removePrevGraph = function(index) {
  switch (index) {
    case 0:
      // console.log('removing 0');
      GraphContainer[index].selectAll('g.arc').data([]).exit().remove();
      return DataContextContainer[index].selectAll('text.view-context').data([]).exit().remove();
    case 1:
      // console.log('removing 1', GraphContainer[1]);
      GraphContainer[1].selectAll('g, text').remove();
      // return console.log('done removing 1 :', true);
      return;
    case 2:
      // console.log('removing 2');
      GraphContainer[index].selectAll('g').remove();
      return GraphContainer[3].selectAll('text, rect').remove();
  }
};


/*
  generate data id based it parent
  sparated by ., and replace original space with _
 */

generateDataId = function(d) {
  var dataId, dataName, l, len, name, parent;
  dataName = [];
  dataName.push(d.data.name);
  parent = d.parent;
  while (parent != null) {
    dataName.push(parent.data.name);
    parent = parent.parent;
  }
  dataName.reverse();
  dataId = '';
  for (l = 0, len = dataName.length; l < len; l++) {
    name = dataName[l];
    while (name.indexOf(' ') > -1) {
      name = name.replace(' ', '_');
    }
    dataId += name + '.';
  }
  return dataId;
};


/* return data.label
 */

getLabel = function(d) {
  if (d.data.value > 0) {
    return d.data.label;
  } else {

  }
};
