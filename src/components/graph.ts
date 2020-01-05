import Vue from 'vue';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';

const events = new Vue();

// TODO Merge this interface with the (Vuex) State interface.
interface Data {
  nodes: Array<Graph.Node>,
  families: Array<Graph.Family>,
  edges: Array<Graph.Edge>,
}

function getNode(id: string, data: Data) {
  return data.nodes.find(node => node.id === id);
}

function getFamily(node: Graph.Node, data: Data) {
  const family = data.families.find((_family) => {
    const spouses = _family.spouses || [];
    return spouses.includes(node.id);
  });
  if (!family) {
    return undefined;
  }
  family.children = data.edges
    .filter(edge => edge.tail === family.spouses[0] || edge.tail === family.spouses[1])
    .map(edge => edge.head)
    || [];
  return family;
}

function getParentFamily(node: Graph.Node, data: Data) {
  const edge = data.edges.find(_edge => _edge.head === node.id);
  if (!edge) {
    return undefined;
  }
  const tail = getNode(edge.tail, data);
  if (!tail) {
    return undefined;
  }
  return getFamily(tail, data);
}

export default function (data: Data) {
  const g = new dagreD3.graphlib.Graph({ compound: true })
    .setGraph({})
    .setDefaultEdgeLabel(() => ({}));

  data.nodes.forEach(node => g.setNode(node.id, node.settings));
  data.families.forEach((family) => {
    g.setNode(family.id, {});
    family.spouses.forEach(spouse => g.setParent(spouse, family.id));
  });
  data.edges.forEach((edge) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    edge.settings.arrowhead = 'undirected';
    g.setEdge(edge.tail, edge.head, edge.settings);
  });

  g.nodes().forEach((v: string) => {
    const node = g.node(v);
    // Round the corners of the nodes.
    node.rx = 5;
    node.ry = 5;
  });

  // Create the renderer.
  // eslint-disable-next-line new-cap
  const render = new dagreD3.render();

  // Set up an SVG group so that we can translate the final graph.
  const svg = d3.select('svg');
  const svgGroup = svg.append('g');

  // Run the renderer. This is what draws the final graph.
  // @ts-ignore
  render(d3.select('svg g'), g);

  // Center the graph.
  svgGroup.attr('transform', 'translate(0, 20)');
  svg.attr('width', g.graph().width);
  svg.attr('height', g.graph().height + 40);

  function drawMarriage(identifier: string) {
    // @ts-ignore
    const spouses = g.children(identifier).map(v => ({ ...g.node(v), id: v }));

    // Gracefully handle unknown husband/wife.
    if (spouses.length < 2) {
      // eslint-disable-next-line prefer-destructuring
      spouses[1] = spouses[0];
    }

    // Draw edges from spouses to children.
    const source = {
      x: spouses[0].x + (spouses[1].x - spouses[0].x) / 2,
      y: spouses[0].y,
    };
    document.querySelectorAll(`.edgePath.family-${identifier} > path`).forEach((child) => {
      const d = child.getAttribute('d');
      if (!d) {
        return;
      }
      const line = d.substring(d.lastIndexOf('L'), d.length);
      const values = line.substring(1, d.length).split(',');
      const x = parseFloat(values[0]);
      const y = parseFloat(values[1]);
      const moveTo = `M${source.x},${source.y}`;
      const vertical = `V${source.y + (y - source.y) / 2}`;
      const horizontal = `H${x}`;
      child.setAttribute('d', moveTo + vertical + horizontal + line);
    });

    // Draw edges between spouses.
    d3.select('.edgePaths')
      .append('g')
      .attr('class', `edgePath family-${identifier}`)
      .append('path')
      .attr('d', `M ${spouses[0].x} ${spouses[0].y} L ${spouses[1].x} ${spouses[1].y}`);
  }

  const marriages = data.families.map(family => family.id);
  marriages.map(drawMarriage);

  function addEventListener(node: Element) {
    node.addEventListener('click', () => {
      // TODO Find a more robust way to extract the node ID from HTML classes.
      const nodeObject = getNode(node.classList[1], data);

      events.$emit('select', nodeObject);
    });

    node.addEventListener('mouseover', () => {
      document.querySelectorAll('.highlight')
        .forEach(element => element.classList.remove('highlight'));
      document.querySelectorAll('.highlight--strong')
        .forEach(element => element.classList.remove('highlight--strong'));

      // TODO Find a more robust way to extract the node ID from HTML classes.
      const nodeObject = getNode(node.classList[1], data);
      const familyObject = nodeObject ? getFamily(nodeObject, data) : null;
      const parentFamilyObject = nodeObject ? getParentFamily(nodeObject, data) : null;

      // Highlight nodes.
      const nodes = [];
      if (familyObject) {
        // @ts-ignore
        nodes.push(...familyObject.spouses, ...familyObject.children);
      }
      if (parentFamilyObject) {
        // @ts-ignore
        nodes.push(...parentFamilyObject.spouses, ...parentFamilyObject.children);
      }
      nodes.forEach((id) => {
        const element = document.querySelector(`.${id}`);
        if (element) {
          element.classList.add('highlight');
        }
      });

      // Highlight edges.
      const container = document.querySelector('.edgePaths');
      if (container) {
        const edges = [];
        if (familyObject) {
          edges.push(...document.querySelectorAll(`.family-${familyObject.id}`));
        }
        if (parentFamilyObject) {
          edges.push(...document.querySelectorAll(`.family-${parentFamilyObject.id}`));
        }
        edges.forEach((element) => {
          element.classList.add('highlight');
          // Draw the edge on top of all other edges.
          container.appendChild(element);
        });
      }

      // Highlight selected node itself.
      node.classList.remove('highlight');
      node.classList.add('highlight--strong');
    });
  }

  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => addEventListener(node));

  return events;
}
