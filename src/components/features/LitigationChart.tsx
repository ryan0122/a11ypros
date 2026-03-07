'use client'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const chartData = [
    { year: '2019', count: 2890 },
    { year: '2020', count: 3503 },
    { year: '2021', count: 4011 },
    { year: '2022', count: 4035 },
    { year: '2023', count: 4630 },
    { year: '2024', count: 4187 },
]

export default function LitigationChart() {
    const data = {
        labels: chartData.map((d) => d.year),
        datasets: [
            {
                label: 'Federal ADA Title III Lawsuits',
                data: chartData.map((d) => d.count),
                borderColor: '#0E8168',
                backgroundColor: '#0E816822',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#d4e300',
                pointBorderColor: '#0E8168',
                pointBorderWidth: 2,
            },
        ],
    }

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: { parsed: { y: number | null } }) =>
                        ctx.parsed.y != null
                            ? `${ctx.parsed.y.toLocaleString()} lawsuits`
                            : '',
                },
            },
        },
        scales: {
            y: {
                grid: { color: '#f0f0f0' },
                ticks: {
                    callback: (value: number | string) =>
                        Number(value).toLocaleString(),
                },
            },
            x: { grid: { display: false } },
        },
    }

    return (
        <div>
            {/* Chart — aria-label provides the accessible name; the table below is the text alternative */}
            <div className="h-64" role="img" aria-label="Line chart showing ADA Title III lawsuits (federal and state combined) from 2,890 in 2019 to 4,187 in 2024, peaking at 4,630 in 2023. See the data table below for full figures.">
                <Line data={data} options={options} />
            </div>

            {/* Accessible data table alternative (SC 1.1.1) */}
            <details className="mt-6">
                <summary className="text-xs font-bold text-gray-500 cursor-pointer hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168]">
                    View chart data as table
                </summary>
                <table className="mt-4 w-full text-sm border-collapse">
                    <caption className="sr-only">
                        Federal ADA Title III lawsuits by year
                    </caption>
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="text-left py-2 px-3 border-b border-gray-200 font-bold text-gray-600"
                            >
                                Year
                            </th>
                            <th
                                scope="col"
                                className="text-right py-2 px-3 border-b border-gray-200 font-bold text-gray-600"
                            >
                                Lawsuits Filed
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map((row) => (
                            <tr key={row.year} className="even:bg-gray-50">
                                <td className="py-2 px-3 border-b border-gray-100">
                                    {row.year}
                                </td>
                                <td className="py-2 px-3 border-b border-gray-100 text-right font-mono">
                                    {row.count.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </div>
    )
}
