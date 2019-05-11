<template>
  <canvas :id="id" :width="width" :height="height"></canvas>
</template>

<script>
import Chart from 'chart.js';

Chart.defaults.global.defaultFontFamily = "'Fira Sans', 'sans-serif'";

export default {
  data() {
    return {
    };
  },
  methods: {
    createChart(chartId) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        }
      });
    }
  },
  props: {
    id: {
      type: String,
      default: 'line-chart',
    },
    type: {
      type: String,
      default: 'line',
    },
    datasets: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 400,
    },
    width: {
      type: Number,
      default: 1600,
    },
  },
  mounted() {
    this.createChart(this.id);
  }
}
</script>
