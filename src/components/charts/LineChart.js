import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data }) => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Linha do tempo tabela FIPE',
      },
    },
  };

  const chartData = {
    labels: data.map(d => d.mes + ' ' + d.ano),
    datasets: [
      {
        label: 'Preco',
        data: data.map(d => d.valor),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={ options } data={ chartData }/>;
}

export default LineChart;
