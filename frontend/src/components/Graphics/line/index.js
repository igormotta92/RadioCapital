import React from 'react';
import { Line } from 'react-chartjs-2';
import convertCoinBr from '../../../utils/convertCoinBr';

export default function LineChart(props) {
  // console.log(props.data.months);

  const months = props.data.months || [];
  const values = props.data.values || [];

  const state = {
    labels: months,
    datasets: [
      {
        label: 'Lucro',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(255,255,255)',
        borderWidth: 2,
        data: values,
      },
    ],
  };

  return (
    <div>
      <Line
        data={state}
        options={{
          responsive: true,
          title: {
            display: true,
            text: 'Lucro',
            fontSize: 15,
          },
          legend: {
            display: false,
            position: 'left',
          },
          tooltips: {
            // mode: 'index',
            // intersect: false,
            callbacks: {
              label: function (tooltipItem, data) {
                //let label = data.datasets[tooltipItem.datasetIndex].label + ' - ' + data.labels[tooltipItem.index];
                let datasetLabel =
                  data.datasets[tooltipItem.datasetIndex].data[
                    tooltipItem.index
                  ];
                //return `<ul><li>${label}</li><li>${convertCoinBr(datasetLabel)}</li></ul>`;
                return convertCoinBr(datasetLabel);
              },
            },
          },
        }}
      />
    </div>
  );
}
