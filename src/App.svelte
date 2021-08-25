<script>
  import { LayerCake, Svg } from "layercake";
  import { data } from "./data/data";
  import Treemap from "./Treemap.svelte";
  import Tooltip from "./Tooltip.svelte";
  import { group } from "d3-array";
  import { format } from "d3-format";

  let hovered;

  const rootHeight = 60;
  const grouped = group(
    data,
    (d) => d["organization_group"],
    (d) => d.department,
    (d) => d.program,
    (d) => d.character,
    (d) => d.object
  );

  function formatDollars(d) {
    return format("$0.3s")(d).replace(/G/, "B").toLowerCase();
  }
</script>

<main>
  <div class="chart-container">
    <LayerCake
      data={grouped}
      padding={{ top: rootHeight, right: 0, bottom: 0, left: 0 }}
    >
      <Svg>
        <Treemap bind:hovered {formatDollars} {rootHeight} />
      </Svg>
      <Tooltip {hovered} {formatDollars} />
    </LayerCake>
  </div>
</main>

<style>
  .chart-container {
    width: 100%;
    height: 100vh;
  }
</style>
