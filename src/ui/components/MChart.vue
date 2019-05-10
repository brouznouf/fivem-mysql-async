<template>
  <canvas :id="chartId" width="1920" height="400"></canvas>
</template>

<script>
import Chart from 'chart.js';
import data from './chart-data.js'

Chart.defaults.global.defaultFontFamily = "'Fira Sans', 'sans-serif'";

export default {
  data() {
    return {
      chartData: data,
    }
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
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
    chartId: {
      type: String,
      default: 'line-chart',
    },
  },
  mounted() {
    this.createChart(this.chartId, this.chartData);
  }
}
</script>
