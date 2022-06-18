import { Dot, Link, Node, State } from '@/utils/types';
import { DOT_SIZE, STROKE_WIDTH } from '@/utils/consts';
import * as d3 from 'd3';

export function onClickLink(state: State) {
  return function (this: any, e: PointerEvent, d: Link) {
    state.svg
      .select('#link' + state.selectedLink)
      .style('stroke', 'black')
      .attr('stroke-width', STROKE_WIDTH);
    if (state.selectedLink === d.id) {
      d3.select(this)
        .style('stroke', 'black')
        .attr('stroke-width', STROKE_WIDTH);
      state.selectedLink = null;
    } else {
      d3.select(this)
        .style('stroke', 'red')
        .attr('stroke-width', STROKE_WIDTH * 2);
      state.selectedLink = d.id;
    }
  };
}

export function onClickNode(state: State) {
  return function (this: any, e: PointerEvent, d: Node) {
    state.svg.select('#node' + state.selectedNode).style('fill', 'transparent');
    if (state.selectedNode === d.id) {
      d3.select(this).style('fill', 'transparent');
      state.selectedNode = null;
    } else {
      d3.select(this).style('fill', 'red');
      state.selectedNode = d.id;
    }
  };
}

export function onClickDot(state: State) {
  return function (this: any, e: PointerEvent, d: Dot) {
    state.svg
      .select('#dot' + state.selectedDot)
      .style('fill', 'black')
      .attr('r', DOT_SIZE);
    if (state.selectedDot === d.id) {
      d3.select(this).style('fill', 'black').attr('r', DOT_SIZE);
      state.selectedDot = null;
    } else {
      d3.select(this)
        .style('fill', 'red')
        .attr('r', DOT_SIZE * 2);
      state.selectedDot = d.id;
    }
  };
}

export function onClickNodeAlternative(state: State) {
  return function (this: any, e: PointerEvent, d: Node) {
    if (state.selectedTargetNodes.includes(d.id)) {
      d3.select(this).style('fill', 'lightblue');
      state.selectedTargetNodes = state.selectedTargetNodes.filter(
        (element) => element !== d.id
      );
    } else {
      d3.select(this).style('fill', 'green');
      state.selectedTargetNodes.push(d.id);
    }
  };
}
