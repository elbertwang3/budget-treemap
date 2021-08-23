<script>
  import { getContext } from "svelte";
  import { treemap, hierarchy, treemapBinary } from "d3-hierarchy";
  import { scaleLinear } from "d3-scale";
  import { some, isEqual } from "lodash";
  import Node from "./Node.svelte";
  //   import { fade, fly } from "svelte/transition";

  export let hovered, formatDollars, rootHeight;

  const { data, width, height } = getContext("LayerCake");

  const color = {
    "Public Works, Transportation & Commerce": "#f15f27",
    "Human Welfare & Neighborhood Development": "#25c2e4",
    "Community Health": "#ffca42",
    "Public Protection": "#ffebe3",
    "General Administration & Finance": "#d6f8ff",
    "General City Responsibilities": "#efbbcc",
    "Culture & Recreation": "#7DDF64",
  };

  $: x = scaleLinear().domain([0, $width]).range([0, $width]);
  $: y = scaleLinear().domain([0, $height]).range([0, $height]);

  $: treeMapFn = treemap()
    .tile(treemapBinary)
    .padding(1)
    // .paddingInner(1)
    // .paddingOuter(1)
    .round(false)
    .size([$width, $height]);

  $: root = treeMapFn(
    hierarchy($data)
      .sum((d) => d.budget)
      .sort((a, b) => b.value - a.value)
  );
  //   $: console.log(root);

  $: nodes = root.children.concat(root);

  $: descendants = treeMapFn(
    hierarchy($data)
      .sum((d) => d.budget)
      .sort((a, b) => b.value - a.value)
  ).descendants();

  //   $: console.log(descendants);

  //   $: descendants.filter((d) => (d.show = some(nodes, d)));
  //   $: console.log(descendants);
  // .forEach((d) => {
  //   console.log(d);
  //   d.show = some(nodes, d);
  //   console.log(d.show);
  // });

  //   $: console.log(descendants);

  //   $: nodes = root.children.concat(root);

  //   $: console.log(nodes);

  function getCategory(d) {
    while (d.depth > 1) d = d.parent;
    return d.data[0];
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    console.log("zooming in");
    if (d.children) {
      x = x.domain([d.x0, d.x1]);
      y = y.domain([d.y0, d.y1]);
      root = d;
    }
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    console.log("zooming out");
    if (d.parent) {
      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);
      root = d.parent;
    }
  }

  function tile(node, x0, y0, x1, y1) {
    treemapBinary(node, 0, 0, $width, $height);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / $width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / $width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / $height) * (y1 - y0);
      child.y1 = y0 + (child.y1 / $height) * (y1 - y0);
    }
  }
  // on:click={(event) => (isEqual(d, root) ? zoomout(root) : zoomin(d))}
</script>

<g class="treemap-layer">
  {#each descendants as d, i}
    {#if d.depth == 2 || isEqual(d, root)}
      <!-- content here -->
      <g
        class={`node`}
        class:root={isEqual(d, root)}
        class:active={d.depth == 2}
        transform={isEqual(d, root)
          ? `translate(0,${-rootHeight})`
          : `translate(${x(d.x0)},${y(d.y0)})`}
        on:mousemove={(e) => {
          if (!isEqual(d, root)) {
            hovered = { e: e, data: d };
          }
        }}
        on:mouseout={() => (hovered = null)}
      >
        <rect
          id={`rect-${i}`}
          width={x(d.x1) - x(d.x0)}
          height={isEqual(d, root) ? rootHeight : y(d.y1) - y(d.y0)}
          fill={isEqual(d, root) ? "#fff" : color[getCategory(d)]}
        />
        <clipPath id={`node-${i}`}>
          <use xlink:href={`#rect-${i}`} />
        </clipPath>
        <text class="cat" clip-path={`url(#node-${i})`} x={6} y={10}>
          {d.data[0] ? d.data[0] : "Total"}
        </text>
        <text
          class="value"
          clip-path={`url(#node-${i})`}
          x={6}
          y={isEqual(d, root) ? 35 : 25}
        >
          {formatDollars(d.value)}
        </text>
      </g>
    {/if}
  {/each}
</g>

<style>
  text {
    font-family: "Amiko", sans-serif;
    pointer-events: none;
    alignment-baseline: hanging;
    fill: #333;
  }
  /* 
  .node {
    pointer-events: none;
    opacity: 0;
  }

  .node.active {
    pointer-events: all;
    opacity: 1;
    cursor: pointer;
    transition: all 0.75s;
  } */

  .node {
    cursor: pointer;
  }

  .node.active rect:hover {
    stroke: #333;
    stroke-width: 2;
  }

  rect {
    stroke: white;
  }

  /* .node.active {
    pointer-events: all;
    cursor: pointer;
  } */

  .cat {
    font-size: 12px;
    /* font-weight: 600; */
  }

  .value {
    font-size: 14px;
    font-weight: 600;
  }

  .node.root .cat {
    font-size: 18px;
  }

  .node.root .value {
    font-size: 24px;
  }
</style>
