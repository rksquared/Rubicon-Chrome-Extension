import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import * as React from 'react';
import './App.css';
import HistoryGraphNode from './HistoryGraphNode';

class HistoryGraphView extends React.Component {

    private ref: SVGSVGElement;
    private nodes: HistoryGraphNode[] = [];
    private links: Array<{source: SimulationNodeDatum, target: SimulationNodeDatum}> = [];

    constructor(props: any) {
        super(props);
    }

    public loadGraph() {
        const svg = d3.select(this.ref);
        const    width = +svg.attr("width");
        const    height = +svg.attr("height");
        const   color = d3.scaleOrdinal(d3.schemeCategory10);
        const simulation = d3.forceSimulation(this.nodes)
            .force("charge", d3.forceManyBody().strength(-200).distanceMax(200))
            .force("link", d3.forceLink(this.links).distance(50).strength(0.5))
            .force("y", d3.forceY((d: any) => d.isSuggestion? d.y: 0))
            .alphaTarget(1)
            .on("tick", ticked)
        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        let link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
        let node = g.selectAll('.node');
        const restart = (restartingSimulation: any) => {
            // Apply the general update pattern to the nodes.
            node = node.data(this.nodes, (d: any) => d.index);
            node.exit().remove();
            node = node.enter()
                .append("g").attr("fill", (d: any) => color(d.index)) // ((d.mousedOver === true) || !d.isSuggestion)? color(d.index): 'grey')
                .attr("r", 8)
                .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
                .merge(node);
            node.append("text")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text((d: any) => d.data.name);

            node.append("image")
                .attr("xlink:href", "https://github.com/favicon.ico")
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 20)
                .attr("height", 20)
                .on('click', (d: any) => {
                    chrome.runtime.sendMessage({type: "deleteNode", data: d, nodes: this.nodes}, ([nodes, links]) => {
                        this.nodes = nodes;
                        this.links = links;
                        restart(simulation);
                    });
                })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended))
                    
                    // .on('mouseover', (d: any) => {
                    //     d.mousedOver = true;
                    //     d3.select(this).empty
                    // })
                    // .on('mouseout', (d: any) => {d.mousedOver = false;});

                // Apply the general update pattern to the links.
                link = link.data(this.links, (d: {source: SimulationNodeDatum, target: SimulationNodeDatum})  =>
                    d.source.index + "-" + d.target.index)
                link.exit().remove();
                link = link.enter().append("line").merge(link);

                // Update and restart the simulation.
                restartingSimulation.nodes(this.nodes);
                restartingSimulation.force("link").links(this.links);
                restartingSimulation.alpha(1).restart();
        }

        restart(simulation);     
        const addNodeTimer = (i = 2) => {
            setTimeout(() => {
                chrome.runtime.sendMessage({type: "addNode", data: i, nodes: this.nodes}, ([nodes, links]) => {
                    this.nodes = nodes;
                    this.links = links;
                    restart(simulation);
                    if (i < 1000) {
                        addNodeTimer(i + 1);
                    }
                });
            }, 2000)
        }
        addNodeTimer();

        function ticked() {
            const positions = {};
            node.attr("cx", (d: any) => {
                positions[d.data.name] = [d.x, d.y];
                return d.x;
            })
            
            node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)

            link.attr("x1", (d: any) => positions[d.source.data.name][0])
                .attr("y1", (d: any) => positions[d.source.data.name][1])
                .attr("x2", (d: any) => positions[d.target.data.name][0])
                .attr("y2", (d: any) => positions[d.target.data.name][1]);
        }

        function dragstarted(d: any) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart()
            };
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragged(d: any) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
          
          function dragended(d: any) {
            if (!d3.event.active) {
                simulation.alphaTarget(0)
            };
            d.fx = null;
            d.fy = null;
          }
    }

    public componentDidMount() {
        chrome.runtime.sendMessage({type: "getNodesAndLinks", nodes: this.nodes}, ([nodes, links]) => {
            this.nodes = nodes;
            this.links = links;
            this.loadGraph();
        });          
    }

  public render() {
    return (
      <div className="App">
        <svg width="960" height="500"  ref={(ref: SVGSVGElement) => this.ref = ref}/>
      </div>
    );
  }
}

export default HistoryGraphView;
