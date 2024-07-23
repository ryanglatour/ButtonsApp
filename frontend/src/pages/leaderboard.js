import React, { useRef, useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useExperiment } from '../context/experimentContext'

Chart.register(...registerables);

function Leaderboard() {
    const {id, trials, time, correct } = useExperiment()
    const [chartData, setChartData] = useState({
        datasets: [
          {
            label: 'Others',
            data: [],
            backgroundColor: 'rgba(75,192,192,1)',
          },
          {
            label: 'You',
            data: [],
            backgroundColor: 'rgba(255,0,0,1)', // Different color for the current user
          },
        ],
      });

  const chartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Average Guess Time (s)',
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Accuracy (%)',
        },
      },
    },
  };

  const getData = async () => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/api/getLeaderboard`, {
        method: 'GET'
    })

    const json = await response.json()

    const formattedData = json.data.map(item => ({
        x: item.avg_guess_time,
        y: item.accuracy,
      }))

    return formattedData
  }

  const updateLeaderboard = async (avg_time, accuracy) => {
    try{
        const entryData = {
            user_id: id,
            avg_guess_time: avg_time,
            accuracy: accuracy
        }
        const response = await fetch (`${process.env.REACT_APP_API_URL}/api/addToLeaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the Content-Type header
            },
            body: JSON.stringify(entryData),
        })

        if (response.ok) return 1
        else throw Error(response.statusText)
    }
    catch(error) {
        console.log(error.message)
    }
    
  }

  useEffect(() => {
    const setupChart = async (avg_time, accuracy) => {
        const data = await getData()
        setChartData({
            datasets: [
              {
                label: 'Others',
                data,
                backgroundColor: 'rgba(75,192,192,1)',
              },
              {
                label: 'You',
                data: [[avg_time, accuracy]],
                backgroundColor: 'rgba(255,0,0,1)', // Different color for the current user
              }
            ],
          });
          console.log(data)
          console.log([1,1])
          await updateLeaderboard(avg_time, accuracy)
    }
    const avg_time = (time / 1000) /trials
    const accuracy = (correct/trials) * 100
    setupChart(avg_time, accuracy)
    
  }, [])

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
}

export default Leaderboard;
