import React from 'react';
import {Doughnut} from 'react-chartjs-2';

//O grafico deve apontar quantidade de investidores referente ao mes
export default function DoughnutChart(props) {

  const data = {
    labels: [
      'Red',
      'Green',
      'Yellow'
    ],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
      ],
      hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
      ]
    }]
  };

  return (
    <div>
      <Doughnut
        data={data}
        options={{
          responsive: true,
          title:{
            display:true,
            text:'Investidores',
            fontSize:15,
          },
          legend:{
            display:false,
            position:'left',
          },

        }}
      />
    </div>
  );

}