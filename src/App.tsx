import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';

interface IProps {
  width: number;
  height: number;
  data: {
    nodes: Array<{ name: string; group: number }>;
    links: Array<{ source: number; target: number; value: number }>;
  };
}

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}

export default class ForceGraph extends Component<IProps, {}> {
  private ctrls: IRefs = {};
  private force: any;


  public componentDidMount() {
    if (this.ctrls.mountPoint !== undefined) {
      const { width, height, data } = this.props;

      this.force = d3
        .forceSimulation()
        .nodes(data.nodes)
        .force('charge', d3.forceManyBody().strength(-120))
        .force('link', d3.forceLink(data.links).distance(50))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const svg = d3
        .select(this.ctrls.mountPoint)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const link = svg
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .style('stroke', '#999999')
        .style('stroke-opacity', 0.6)
        .style('stroke-width', d => Math.sqrt(d.value));


      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const node = svg
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append<SVGCircleElement>('circle')
        .attr('r', 5)
        .style('stroke', '#FFFFFF')
        .style('stroke-width', 1.5)
        .style('fill', (d: any) => color(d.group))
        .call(
          d3
            .drag()
            .on('start', this.dragStarted)
            .on('drag', this.dragged)
            .on('end', this.dragEnded),
      );

      this.force.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      });
    }
  }

  public render() {
    const { width, height } = this.props;
    const style = {
      backgroundColor: '#333',
      height,
      width
    };
    return <div style={style} ref={mountPoint => (this.ctrls.mountPoint = mountPoint)} />;
  }

  private dragStarted(d: any) {
    this.force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(d: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragEnded(d: any) {
    this.force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

}


