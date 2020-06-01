import * as d3 from 'd3';

let margin = { top: 20, right: 20, bottom: 20, left: 20 };

let createViz = () => {
    d3.tsv('../../data/usWeather.tsv').then(data => {
        data.forEach((dataPoint) => {
            dataPoint.date = d3.timeParse('%Y%m%d')(dataPoint.date);
            dataPoint['Austin'] = parseFloat(dataPoint['Austin']);
            dataPoint['New York'] = parseFloat(dataPoint['New York']);
            dataPoint['San Francisco'] = parseFloat(dataPoint['San Francisco']);
        });

        let cities = ['Austin', 'New York', 'San Francisco'];

        let body = d3.select('body');
        let svg = body.append('svg')
            .attr('class', 'svg--80hv');
        let svgBounds = svg.node().getBoundingClientRect();

        let xAxisGroup = svg
            .append('g')
            .attr('transform', `translate(0, ${svgBounds.height - margin.bottom})`);
        let yAxisGroup = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`);
        let rects = svg
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect');


        let city = "Austin";
        // Create X-Axis
        let xExtent = d3.extent(data, d => d["date"]);
        let xScale = d3.scaleTime().domain(xExtent).range([margin.left, svgBounds.width - margin.right]);
        let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%b %Y"));
        // Create Y-Axis
        let yMax = d3.max(data, d => d[city]);
        let yScale = d3.scaleLinear().domain([0, yMax]).range([svgBounds.height - margin.bottom, margin.top]);
        let heightScale = d3.scaleLinear().domain([0, yMax]).range([0, svgBounds.height - margin.bottom - margin.top]);
        let yAxis = d3.axisLeft().scale(yScale);

        // Append it to the svg
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        // Create bars
        rects
            .attr('width', svgBounds.width / data.length)
            .attr('height', d => heightScale(d[city]))
            .attr('x', d => xScale(d["date"]))
            .attr('y', d => yScale(d[city]))
            .attr('fill', 'rgb(12, 99, 200')
            .attr('stroke', 'white')
            .attr('stroke-width', '0.1')
            .on("mouseover", (d, i, nodes) => {
                d3.select(nodes[i]).attr('fill', 'red');
            })
            .on("mouseout", (d, i, nodes) => {
                d3.select(nodes[i]).attr('fill', 'blue');
            });



        let updateData = newCity => {
            city = newCity;
            console.log("City Changed", city);
            let bars = svg.selectAll('rect')
                .data(data);

            // Remove old, unused data
            bars.exit().remove();

            // Enter new data
            let enter = bars.enter().append('rect');

            // Merge and update
            bars = bars.merge(enter)
                .attr('width', svgBounds.width / data.length)
                .attr('height', d => heightScale(d[city]))
                .attr('x', d => xScale(d["date"]))
                .attr('y', d => yScale(d[city]))
        };

        let index = 0;
        setInterval(() => updateData(cities[index++ % cities.length]), 3000);
    });



};

export {
    createViz
}
