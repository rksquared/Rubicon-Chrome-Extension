import * as React from 'react';
import { Affix, Button, Select, Input, Form } from 'antd';
import * as d3 from 'd3';
import axios from 'axios';

const Option = Select.Option;

class Floater extends React.Component<IProps, { toggle: boolean, histories: any, input: string }> {

  public handleToggle() {
    this.setState({ toggle: !this.state.toggle });
  }

  public handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  public handleFormSubmit(ev) {
    ev.preventDefault();
    console.log(this.state.input);
  }

  public state = { toggle: true, histories: [], input: '' };

  public getUserGraphs() {
    axios.get('http://localhost:3005/api/histories')
    .then((result: any) => {
      this.setState({ histories: result.data });
    })
    .catch((err: any) => {
      console.log(err);
    })
  }
  private ctrls: IRefs = {};
  private force: any;

  public componentDidMount() {
    this.getUserGraphs();

    if (this.ctrls.mountPoint !== undefined) {
      const { width, height, data } = this.props;

      this.force = d3
        .forceSimulation()
        .nodes(data.nodes)
        .force('charge', d3.forceManyBody().strength(-120))
        .force('link', d3.forceLink(data.links).distance(50))
        //.force('center', d3.forceCenter(width / 2, height / 2));

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
      backgroundColor: 'white',
      height,
      width
    };

    const show = (
      <>
        <div style={{ backgroundColor: "#f65d5d", paddingBottom: "5px", paddingTop: "5px", position: "relative", height: "45px" }}>
        <Button type="primary" shape="circle" icon="shrink" style={{ float: "left", marginLeft: "5px" }} onClick={ this.handleToggle.bind(this) }></Button>
        <Form layout="inline" onSubmit={() => {}}>
          <Form.Item>
            <span>
              <Input
                type="text"
                onChange={ this.handleInputChange.bind(this) }
                placeholder="History Name"
                style={{ width: '65%', marginLeft: "10px" }}
              />
            </span>
          </Form.Item>
          <Form.Item>
            <Button onClick={ this.handleFormSubmit.bind(this) } style={{ marginLeft: "-60px", marginBottom: "5px" }} htmlType="submit">Save</Button>
          </Form.Item>
          <Select           
            showSearch
            placeholder="Select a History"
            style={{ width: "10%", right: "10px", position: "absolute" }}
            onChange={() => {}}>
            {this.state.histories.map((history) => {
              return <Option value={history.name} key={history.id}>{history.name}</Option>
            })}
          </Select>
        </Form>
        </div>
        <div style={style} ref={mountPoint => (this.ctrls.mountPoint = mountPoint)} />
      </>
      );

    return (
      <Affix offsetBottom={0}>
        {this.state.toggle ? show : <Button type="primary" shape="circle" icon="arrows-alt" onClick={ this.handleToggle.bind(this) }></Button>}
      </Affix>
      );
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

export default Floater;


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


